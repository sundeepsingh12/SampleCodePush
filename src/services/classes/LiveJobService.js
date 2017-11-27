'use strict'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import {

} from '../../lib/AttributeConstants'
import {
    TABLE_JOB
} from '../../lib/constants'
import { jobTransactionService } from './JobTransaction'
import {
    transactionCustomizationService
} from './TransactionCustomization'
import * as realm from '../../repositories/realmdb'
class LiveJobService {
    async getLiveJobList() {
        // const query = `status = 6`
        // let realmJobObjects = realm.getRecordListOnQuery(TABLE_JOB, query)
        // let liveJobList = []
        // for (let index in realmJobObjects) {
        //     let liveJob = { ...realmJobObjects[index] }
        //     console.log('live job', liveJob)
        //     liveJobList.push(liveJob)
        // }
        const jobTransactionCustomizationListParametersDTO = await transactionCustomizationService.getJobListingParameters()
        const jobTransactionCustomizationList = await jobTransactionService.getAllJobTransactionsCustomizationList(jobTransactionCustomizationListParametersDTO, 'LiveJob', null)
        return jobTransactionCustomizationList
    }
}

export let liveJobService = new LiveJobService()
