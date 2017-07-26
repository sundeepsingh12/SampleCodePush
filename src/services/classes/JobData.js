'use strict'

class JobData {

    /**
     * 
     * @param {*} jobDataList 
     * @returns 
     * {
     *  JobDataMap : Map<JobId,Map<JobAttributeMasterId,JobData>>
     *  ContactMap : Map<JobId,[JobData]>
     *  AddressMap : Map<JobId,[JobData]>
     * }
     */
    getJobDataDetailsForListing(jobDataList,jobAttributeMasterMap) {
        let jobDataDetailsForListing = {}, jobDataMap = {},contactMap = {},addressMap = {}
        jobDataList.forEach(jobDataObj => {
            let jobId = jobDataObj.jobId
            let jobAttributeMasterId = jobDataObj.jobAttributeMasterId
            let value = jobDataObj.value
            let jobData = {
                jobId,
                jobAttributeMasterId,
                value
            }
            if (!jobDataMap[jobId]) {
                jobDataMap[jobId] = {}
            }
            jobDataMap[jobId][jobAttributeMasterId] = value
            if(this.checkContacNumber(jobAttributeMasterId,value,jobAttributeMasterMap)) {
                if(!contactMap[jobId]) {
                    contactMap[jobId] = []
                }
                contactMap[jobId].push(jobData)
            } else if (this.checkAddressField(jobAttributeMasterId,value,jobAttributeMasterMap)) {
                if(!addressMap[jobId]) {
                    addressMap[jobId] = []
                }
                addressMap[jobId].push(jobData)
            }
        })
        jobDataDetailsForListing.jobDataMap = jobDataMap
        jobDataDetailsForListing.contactMap = contactMap
        jobDataDetailsForListing.addressMap = addressMap
        return jobDataDetailsForListing
    }

    /**
     * This method checks if job attrinute is a contact number,
     * contact number is greater than 6 digits
     * all digits of number are not same(eg 1111111,222222)
     * @param {*} jobData 
     * @param {*} jobAttributeMasterMap 
     */
    checkContacNumber(jobAttributeMasterId,value,jobAttributeMasterMap) {
        if(!jobAttributeMasterMap[jobAttributeMasterId]) {
            return false
        }
        if(jobAttributeMasterMap[jobAttributeMasterId].hidden || 
        jobAttributeMasterMap[jobAttributeMasterId].attributeTypeId !== 27 || 
        _.isNull(value) || _.isUndefined(value) || value.trim() === '' || 
        value.length < 6 || /(.)\\1+/.test(value)) {
            return false
        }
        return true
    }

    checkAddressField(jobAttributeMasterId,value,jobAttributeMasterMap) {
        if(!jobAttributeMasterMap[jobAttributeMasterId]) {
            return false
        }
        if(jobAttributeMasterMap[jobAttributeMasterId].hidden || 
        _.isNull(value) || _.isUndefined(value) || value.trim() === '' ) {
            return false
        }
        if(jobAttributeMasterMap[jobAttributeMasterId].attributeTypeId == 28 || 
        jobAttributeMasterMap[jobAttributeMasterId].attributeTypeId == 29 || 
        jobAttributeMasterMap[jobAttributeMasterId].attributeTypeId == 30 ||
        jobAttributeMasterMap[jobAttributeMasterId].attributeTypeId == 31) {
            return true
        }
        return false
    }

}

export let jobDataService = new JobData()