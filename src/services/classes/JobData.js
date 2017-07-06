import * as realm from '../../repositories/realmdb'
const {
    TABLE_JOB_DATA,
} = require('../../lib/constants').default
import _ from 'underscore'

class JobData {

    getAllJobData() {
        const allJobData = realm.getAll(TABLE_JOB_DATA)
        return allJobData
    }

    /**
     * 
     * @param {*} jobId 
     * @param {*} jobAttributeMasterIdList 
     * let tanDogs = dogs.filtered('color = "tan" AND name BEGINSWITH "B"');
     * var filtered = sample.filtered([2,4,7,10].map((id) => 'id == ' + id).join(' OR '));
     */
    getJobDataForJobId(jobId, jobAttributeMasterIdList) {
        console.log('jobAttributeMasterIdList')
         console.log(jobAttributeMasterIdList)
        let allJobData = this.getAllJobData()
        filteredData = allJobData.filtered(jobAttributeMasterIdList.map(
            (object) => 'jobAttributeMasterId = ' + object.jobAttributeMasterId).join(' OR ')).filtered('jobId = '+jobId)
        console.log(filteredData.length)
        console.log(filteredData[0])
    }

}

export let jobDataService = new JobData()