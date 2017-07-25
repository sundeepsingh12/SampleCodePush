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
        jobDataList.forEach(jobData => {
            let jobDataObj = { ...jobData }
            if (!jobDataMap[jobDataObj.jobId]) {
                jobDataMap[jobDataObj.jobId] = {}
            }
            jobDataMap[jobDataObj.jobId][jobDataObj.jobAttributeMasterId] = jobDataObj
            if(this.checkContacNumber(jobDataObj,jobAttributeMasterMap)) {
                if(!contactMap[jobDataObj.jobId]) {
                    contactMap[jobDataObj.jobId] = []
                }
                contactMap[jobDataObj.jobId].push(jobDataObj)
            } else if (this.checkAddressField(jobDataObj,jobAttributeMasterMap)) {
                if(!addressMap[jobDataObj.jobId]) {
                    addressMap[jobDataObj.jobId] = []
                }
                addressMap[jobDataObj.jobId].push(jobDataObj)
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
    checkContacNumber(jobData,jobAttributeMasterMap) {
        if(!jobAttributeMasterMap[jobData.jobAttributeMasterId]) {
            return false
        }
        if(jobAttributeMasterMap[jobData.jobAttributeMasterId].hidden || 
        jobAttributeMasterMap[jobData.jobAttributeMasterId].attributeTypeId !== 27 || 
        _.isNull(jobData.value) || _.isUndefined(jobData.value) || jobData.value.trim() === '' || 
        jobData.value.length < 6 || /(.)\\1+/.test(jobData.value)) {
            return false
        }
        return true
    }

    checkAddressField(jobData,jobAttributeMasterMap) {
        if(!jobAttributeMasterMap[jobData.jobAttributeMasterId]) {
            return false
        }
        if(jobAttributeMasterMap[jobData.jobAttributeMasterId].hidden || 
        _.isNull(jobData.value) || _.isUndefined(jobData.value) || jobData.value.trim() === '' ) {
            return false
        }
        if(jobAttributeMasterMap[jobData.jobAttributeMasterId].attributeTypeId == 28 || 
        jobAttributeMasterMap[jobData.jobAttributeMasterId].attributeTypeId == 29 || 
        jobAttributeMasterMap[jobData.jobAttributeMasterId].attributeTypeId == 30 ||
        jobAttributeMasterMap[jobData.jobAttributeMasterId].attributeTypeId == 31) {
            return true
        }
        return false
    }

}

export let jobDataService = new JobData()