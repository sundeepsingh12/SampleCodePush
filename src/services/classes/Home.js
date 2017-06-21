import * as realmdb from '../../repositories/realmdb'
const { TABLE_JOB_TRANSACTION } = require('../../lib/constants').default
import JobTransaction from '../../repositories/schema/jobTransaction'

class Home {


    /**
     * get different configurations for job listing
     * tabs
     * jobstatus
     * jobTransaction for status ids
     * holderListCustomizationMap
     * jobMaster
     */
    async getConfigurations(pageNumber) {
        // var datas = [];
        // for (var i = 0; i < 50; i++) {
        //     datas.push({
        //         "runsheetNo": "11223344/kamal_11223344/2017-03-02",
        //         "syncErp": false,
        //         "jobCreatedAt": "2017-03-02 19:54:45",
        //         "erpSyncTime": null,
        //         "androidPushTime": "2017-03-02 19:54:49",
        //         "lastUpdatedAtServer": '',
        //         "lastTransactionTimeOnMobile": '',
        //         "jobEtaTime": '',
        //         "seqSelected": 2,
        //         "seqActual": 0,
        //         "seqAssigned": 0,
        //         "companyId": 495,
        //         "jobId": 2140472,
        //         "jobMasterId": 1748,
        //         "userId": 14560,
        //         "jobStatusId": 8814,
        //         "actualAmount": 0,
        //         "originalAmount": 0,
        //         "moneyTransactionType": '',
        //         "referenceNumber": "11223344-1488464685295",
        //         "runsheetId": 167552,
        //         "hubId": 10055,
        //         "cityId": 1299,
        //         "trackKm": 0,
        //         "trackHalt": 0,
        //         "trackCallCount": 0,
        //         "trackCallDuration": 0,
        //         "trackSmsCount": 0,
        //         "trackTransactionTimeSpent": 0,
        //         "latitude": 0,
        //         "longitude": 0,
        //         "trackBattery": 0,
        //         "deleteFlag": 0,
        //         "attemptCount": 1,
        //         "startTime": '',
        //         "endTime": '',
        //         "merchantCode": '',
        //         "imeiNumber": '',
        //         "npsFeedBack": '',
        //         "id": i,
        //         "lastUpdatedDuration": ''
        //     });
        // }
        // console.log('datas')
        // console.log(datas)
        // realmdb.saveList(TABLE_JOB_TRANSACTION,datas)
        console.log('pageNumber')
        console.log(pageNumber)
        let dataFromDb = realmdb.getAll(TABLE_JOB_TRANSACTION)
        let firsttransaction
        if (pageNumber > 0) {
            firsttransaction = dataFromDb.slice(0, (pageNumber * 10) + 10)
        } else {
            firsttransaction = dataFromDb.slice(0, 10)
        }
        console.log('firsttransaction')
        console.log(firsttransaction)
        return firsttransaction
    }

    /**
     * search text
     * @param {*} searchText 
     */
    searchText(searchText) {

    }


    /**
     * 
     */
    sortJobs() {

    }
}

export let homeService = new Home()