'use strict'
import {
    JOB_MASTER,
    HUB_LAT_LONG,
    USER,
    TABLE_JOB_TRANSACTION,
    TABLE_JOB,
    GEO_FENCING,
    LAT_LONG_GEO_FENCE
} from '../../lib/constants'
import {
    PENDING
} from '../../lib/AttributeConstants'
import * as realm from '../../repositories/realmdb'
import { keyValueDBService } from './KeyValueDBService'
import _ from 'lodash'
import { jobStatusService } from './JobStatus'
import { runSheetService } from './RunSheet'
import { jobDetailsService } from './JobDetails'
import {
    HUB_LAT_LONG_MISSING,
    FENCE_LAT_LONG_MISSING
} from '../../lib/ContainerConstants'
import { trackingService } from './Tracking';

class GeoFencingService {

    /**
     * This method is use to get mean lat long, radius, transactionIdIdentifier which is a transactionId of current Job
     * @param {*} jobMasterIdListWithEnableResequenceRestriction 
     * @param {*} openRunsheetList 
     * @param {*} fenceForInitialJob 
     * @returns { meanLatLong, radius, transactionIdIdentifier}
     */
    async getLatLng(jobMasterIdListWithEnableResequenceRestriction, openRunsheetList, fenceForInitialJob) {
        let hubLatLong = await keyValueDBService.getValueFromStore(HUB_LAT_LONG) //get hub lat long
        let latLongObject, transactionIdIdentifier
        // case of initial job
        if (fenceForInitialJob) {
            /*
            this method get lat long object which has previous, current and next job lat long 
                it also returns transactionIdIdentifier
            */
            let returnLatLngParams = await this.getjobTransactionLatLongList(jobMasterIdListWithEnableResequenceRestriction, null, openRunsheetList, hubLatLong)
            latLongObject = returnLatLngParams.latLongObject
            transactionIdIdentifier = returnLatLngParams.transactionIdIdentifier
        } else {
            // subsequent job case

            // this is used to get fenceLatLongObject which contains current job lat long and this is used as previous lat long for the next geo fence
            let fenceLatLongObject = await keyValueDBService.getValueFromStore(LAT_LONG_GEO_FENCE)
            if (!fenceLatLongObject || !fenceLatLongObject.value) {
                throw new Error(FENCE_LAT_LONG_MISSING)
            }
            let returnLatLngParams = await this.getjobTransactionLatLongList(jobMasterIdListWithEnableResequenceRestriction, fenceLatLongObject.value.latLongObject.currentLatLong, openRunsheetList, hubLatLong)
            latLongObject = returnLatLngParams.latLongObject
            transactionIdIdentifier = returnLatLngParams.transactionIdIdentifier
            // if transactionIdIdentifier is undefined then it a case of no pending jobs left with proper specifications of geo fencing and no geo fence is added or deleted
            if (transactionIdIdentifier) {
                let fenceIdentifier = await keyValueDBService.getValueFromStore(GEO_FENCING)
                await trackingService.removeGeofence(fenceIdentifier)
            } else {
                return {
                    radius: 0
                }
            }
            await keyValueDBService.deleteValueFromStore(LAT_LONG_GEO_FENCE)
        }
        // convert previous, current and next lat long to a list of lat long
        let listOfLatLong = this.getListOfLatLong(latLongObject)
        // center of polygon made from all lat long
        let meanLatLong = this.findCentreOfPolygon(listOfLatLong)
        // calculate radius of polygon and is used to make circular fence
        let radius = this.calculateRadius(meanLatLong, listOfLatLong)
        await keyValueDBService.validateAndSaveData(LAT_LONG_GEO_FENCE, { latLongObject, radius: parseInt(radius), meanLatLong })
        return {
            meanLatLong,
            radius,
            transactionIdIdentifier
        }
    }

    /**
     * Calculate center of polygon which is made from 3 pair of lat long
     * @param {*} listOfLatLong
     * @returns {latitude, longitude} //mean lat long
     */
    findCentreOfPolygon(listOfLatLong) {
        let centroidX = 0, centroidY = 0
        for (let latLong of listOfLatLong) {
            centroidX += parseFloat(latLong.latitude)
            centroidY += parseFloat(latLong.longitude)
        }
        return {
            latitude: centroidX / listOfLatLong.length,
            longitude: centroidY / listOfLatLong.length
        }
    }

    /**
     * calculate radius in meters and adding a leverage of 800 meters 
     * and the radius is farthest distance from mean lat long from the list of lat long
     * @param {*} meanLatLong 
     * @param {*} listOfLatLong
     * @returns {radius} 
     */
    calculateRadius(meanLatLong, listOfLatLong) {
        let radius = 0
        for (let latLong of listOfLatLong) {
            let distance = jobDetailsService.distance(meanLatLong.latitude, meanLatLong.longitude, latLong.latitude, latLong.longitude)
            if (radius < distance) {
                radius = distance
            }
        }
        return (radius * 1000) + 800 // Converting to meters from km and adding 800 meters as leverage
    }

    /**
     * Creates an array from object of lat long
     * @param {*} jobTransactionLatLongList 
     * @returns {listOfLatLong} //Array 
     */
    getListOfLatLong(jobTransactionLatLongList) {
        let listOfLatLong = []
        for (let index in jobTransactionLatLongList) {
            let latLongSplitArray = jobTransactionLatLongList[index].split(',')
            listOfLatLong.push({
                latitude: latLongSplitArray[0],
                longitude: latLongSplitArray[1]
            })
        }
        return listOfLatLong
    }

    /**
     * gives lat long object having previousLatLng{ lat long of previous job or hub}, currentLatLong{ lat long of current job },
     * nextLatLong{ lat long of next job or hub if current job is last job} lat long 
     * 
     * {transactionIdIdentifier} this is transactionId of currentJob 
     * @param {*} jobMasterIdListWithEnableResequenceRestriction 
     * @param {*} previousLatLng 
     * @param {*} openRunsheetList 
     * @param {*} hubLatLong
     * @returns {latLongObject, transactionIdIdentifier}
     */
    async getjobTransactionLatLongList(jobMasterIdListWithEnableResequenceRestriction, previousLatLng, openRunsheetList, hubLatLong) {
        if (!hubLatLong || !hubLatLong.value) {
            throw new Error(HUB_LAT_LONG_MISSING)
        }
        // if previous lat long is undefined then it is a case of inital job and hub lat long is used as previous lat long
        if (previousLatLng == null) {
            previousLatLng = hubLatLong.value
        }
        let latLongObject = { previousLatLng }
        let transactionIdIdentifier
        // get all pending job transaction for open runsheet with delete flag != 1 and is of job master whose enable resequence restriction is true
        let statusIds = await jobStatusService.getNonUnseenStatusIdsForStatusCategory(PENDING)
        let jobTransactionQuery = `(` + statusIds.map(statusId => 'jobStatusId = ' + statusId).join(' OR ')
        jobTransactionQuery += `) AND (` + jobMasterIdListWithEnableResequenceRestriction.map(jobMasterId => 'jobMasterId = ' + jobMasterId).join(' OR ')
        jobTransactionQuery += `) AND (` + openRunsheetList.map(runsheet => 'runsheetId = ' + runsheet.id).join(' OR ')
        jobTransactionQuery += `) AND deleteFlag != 1`
        let jobTransactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobTransactionQuery, true, 'seqSelected')
        if (jobTransactionList.length >= 1) {
            //loop through first 2 job transaction only if present
            for (let jobTransactionIndex = 0; jobTransactionIndex < jobTransactionList.length && jobTransactionIndex < 2; jobTransactionIndex++) {
                let jobTransactionObject = { ...jobTransactionList[jobTransactionIndex] }
                let jobQuery = `id = ` + jobTransactionObject.jobId
                // get job for particular job transaction
                let jobCorrespondingToJobTransactionObject = realm.getRecordListOnQuery(TABLE_JOB, jobQuery)
                let job = { ...jobCorrespondingToJobTransactionObject[0] }
                if (job.latitude && job.longitude && (job.latitude != 0.0 || job.longitude != 0.0)) {
                    if (jobTransactionIndex == 0) {//first job
                        latLongObject.currentLatLong = job.latitude + ',' + job.longitude
                        transactionIdIdentifier = jobTransactionObject.id
                    } else if (jobTransactionIndex == 1) {//second job
                        latLongObject.nextLatLong = job.latitude + ',' + job.longitude
                        break
                    }
                }
            }
            if (jobTransactionList.length == 1) { // only 1 job is there then next lat long is hub lat long
                latLongObject.nextLatLong = hubLatLong.value
            }
        }
        return { latLongObject, transactionIdIdentifier }
    }


    /**
     * check for job masters having Enable Resequence Restriction and company having allowOffRouteNotification as true
     */
    async checkForEnableResequenceRestrictionAndCheckAllowOffRouteNotification(fenceForInitialJob) {
        let fenceIdentifier = await keyValueDBService.getValueFromStore(GEO_FENCING)
        // if it is a case for initial job then check if fence is present or not if present then do not compute anything
        if (fenceForInitialJob && fenceIdentifier && fenceIdentifier.value) {
            return {
                fencePresent: true
            }
        }
        const userData = await keyValueDBService.getValueFromStore(USER)
        let jobMasters = await keyValueDBService.getValueFromStore(JOB_MASTER)
        //check job masters present and if userdata is present then check for allowOfRouteNotification is true or not
        if (!jobMasters || !jobMasters.value || !userData || !userData.value || !userData.value.company || !userData.value.company.allowOffRouteNotification) {
            return []
        }
        //loop through all job master and push those job master in a list whose enableResequenceRestriction is true
        let jobMasterIdListWithEnableResequenceRestriction = []
        for (let jobMaster of jobMasters.value) {
            if (jobMaster.enableResequenceRestriction) {
                jobMasterIdListWithEnableResequenceRestriction.push(jobMaster.id)
            }
        }
        //get all open runsheets
        let openRunsheetList = runSheetService.getOpenRunsheets()
        return {
            fencePresent: false,
            jobMasterIdListWithEnableResequenceRestriction,
            openRunsheetList
        }
    }
}

export let geoFencingService = new GeoFencingService()