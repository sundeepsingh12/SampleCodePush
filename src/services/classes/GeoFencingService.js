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

class GeoFencingService {

    /**
     * This method is use to get mean lat long, radius, transactionIdIdentifier which is a transactionId of current Job
     * @param {*} jobMasterIdListWithEnableResequenceRestriction 
     * @param {*} openRunsheetList 
     * @param {*} fenceForInitialJob 
     * @returns { meanLatLong, radius, transactionIdIdentifier}
     */
    async getLatLng(jobMasterIdListWithEnableResequenceRestriction, openRunsheetList, fenceForInitialJob) {
        let hubLatLong = await keyValueDBService.getValueFromStore(HUB_LAT_LONG)
        let latLongObject, transactionIdIdentifier
        if (fenceForInitialJob) {
            let returnLatLngParams = await this.getjobTransactionLatLongList(jobMasterIdListWithEnableResequenceRestriction, null, openRunsheetList, hubLatLong)
            latLongObject = returnLatLngParams.latLongObject
            transactionIdIdentifier = returnLatLngParams.transactionIdIdentifier
        } else {
            let fenceLatLongObject = await keyValueDBService.getValueFromStore(LAT_LONG_GEO_FENCE)
            if (!fenceLatLongObject || !fenceLatLongObject.value) {
                throw new Error(FENCE_LAT_LONG_MISSING)
            }
            let returnLatLngParams = await this.getjobTransactionLatLongList(jobMasterIdListWithEnableResequenceRestriction, fenceLatLongObject.value.latLongObject.currentLatLong, openRunsheetList, hubLatLong)
            latLongObject = returnLatLngParams.latLongObject
            transactionIdIdentifier = returnLatLngParams.transactionIdIdentifier
            await keyValueDBService.deleteValueFromStore(LAT_LONG_GEO_FENCE)
        }
        let listOfLatLong = this.getListOfLatLong(latLongObject)
        let meanLatLong = this.findCentreOfPolygon(listOfLatLong)
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
            if (jobTransactionLatLongList[index]) {
                let latLongSplitArray = jobTransactionLatLongList[index].split(',')
                listOfLatLong.push({
                    latitude: latLongSplitArray[0],
                    longitude: latLongSplitArray[1]
                })
            }
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
        if (previousLatLng == null) {
            previousLatLng = hubLatLong.value
        }
        let latLongObject = { previousLatLng }
        let transactionIdIdentifier
        let statusIds = await jobStatusService.getNonUnseenStatusIdsForStatusCategory(PENDING)
        let jobTransactionQuery = `(` + statusIds.map(statusId => 'jobStatusId = ' + statusId).join(' OR ')
        jobTransactionQuery += `) AND (` + jobMasterIdListWithEnableResequenceRestriction.map(jobMasterId => 'jobMasterId = ' + jobMasterId).join(' OR ')
        jobTransactionQuery += `) AND (` + openRunsheetList.map(runsheet => 'runsheetId = ' + runsheet.id).join(' OR ')
        jobTransactionQuery += `) AND deleteFlag != 1`
        let jobTransactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobTransactionQuery, true, 'seqSelected')
        if (jobTransactionList.length >= 1) {
            for (let jobTransactionIndex = 0; jobTransactionIndex < jobTransactionList.length && jobTransactionIndex < 2; jobTransactionIndex++) {
                let jobTransactionObject = { ...jobTransactionList[jobTransactionIndex] }
                let jobQuery = `id = ` + jobTransactionObject.jobId
                let jobCorrespondingToJobTransactionObject = realm.getRecordListOnQuery(TABLE_JOB, jobQuery)
                let job = { ...jobCorrespondingToJobTransactionObject[0] }
                if (job.latitude && job.longitude && (job.latitude != 0.0 || job.longitude != 0.0)) {
                    if (jobTransactionIndex == 0) {
                        latLongObject.currentLatLong = job.latitude + ',' + job.longitude
                        transactionIdIdentifier = jobTransactionObject.id
                    } else if (jobTransactionIndex == 1) {
                        latLongObject.nextLatLong = job.latitude + ',' + job.longitude
                        break
                    }
                }
            }
            if (jobTransactionList.length == 1) { // only 1 job is there
                latLongObject.nextLatLong = hubLatLong.value
            }
        }
        return { latLongObject, transactionIdIdentifier }
    }


    /**
     * check for job masters having Enable Resequence Restriction and company having allowOffRouteNotification as true
     */
    async checkForEnableResequenceRestrictionAndCheckAllowOffRouteNotification() {
        let fenceIdentifier = await keyValueDBService.getValueFromStore(GEO_FENCING)
        if (fenceIdentifier && fenceIdentifier.value) {
            return {
                fencePresent: true
            }
        }
        const userData = await keyValueDBService.getValueFromStore(USER)
        let jobMasters = await keyValueDBService.getValueFromStore(JOB_MASTER)
        if (!jobMasters || !jobMasters.value || !userData || !userData.value || !userData.value.company || !userData.value.company.allowOffRouteNotification) {
            return []
        }
        let jobMasterIdListWithEnableResequenceRestriction = []
        for (let jobMaster of jobMasters.value) {
            if (jobMaster.enableResequenceRestriction) {
                jobMasterIdListWithEnableResequenceRestriction.push(jobMaster.id)
            }
        }
        let openRunsheetList = runSheetService.getOpenRunsheets()
        return {
            fencePresent: false,
            jobMasterIdListWithEnableResequenceRestriction,
            openRunsheetList
        }
    }
}

export let geoFencingService = new GeoFencingService()