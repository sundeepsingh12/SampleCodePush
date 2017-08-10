'use strict'

class JobDetails {

    prepareDataObject(id, positionId, dataList, attributeMasterMap, attributeMap, isJob) {
        let dataMap = {},
            dataList = [],
            contactList = [],
            addressList = []
        let dataQuery
        if (isJob) {
            dataQuery = 'jobId = ' + id + ' AND parentId = ' + positionId
        } else {
            dataQuery = 'jobTransactionId = ' + id + ' AND parentId = ' + positionId
        }
        let filteredDataList = realm.filterRecordList(dataList, dataQuery)

        for (let index in filteredDataList) {
            let data = {...filteredDataList[index] }
            let attributeMaster, attributeStatus
            if (isJob) {
                attributeMaster = attributeMasterMap[data.jobAttributeMasterId]
            } else {
                attributeMaster = attributeMasterMap[data.fieldAttributeMasterId]
            }
            // let attributeMaster = attributeMasterMap[data.jobAttributeMasterId]
            if (isJob) {
                attributeStatus = attributeMap[data.jobAttributeMasterId]
            } else {
                attributeStatus = attributeMap[data.fieldAttributeMasterId]
            }
            if (!attributeMaster.hidden && data.value !== undefined && data.value !== null) {
                let dataObject = {}
                    // jobDataMap[jobAttributeMaster.attributeTypeId] = {}
                dataMap[jobData.jobAttributeMasterId] = {}
                dataObject.data = data
                dataObject.sequence = attributeStatus.sequence
                dataObject.label = attributeMaster.label
                dataObject.attributeTypeId = attributeMaster.attributeTypeId
                    // jobDataList[jobAttributeStatus.sequence] = {}
                    // jobDataList[jobAttributeStatus.sequence].jobData = []
                if (data.value.toLocaleLowerCase() == 'objectsarojfareye' || data.value.toLocaleLowerCase() == 'arraysarojfareye') {
                    let childDataObject = prepareJobDataMap(id, data.positionId, dataList, attributeMasterMap)
                    if (isJob) {
                        dataMap[data.jobAttributeMasterId].childDataMap = dataObject.dataMap
                    } else {
                        dataMap[data.fieldAttributeMasterId].childDataMap = dataObject.dataMap
                    }
                    dataObject.childDataList = childDataObject.dataList
                        // sequenceJobDataMap[jobAttributeStatus.sequence].childJobDataMap = sequenceJobDataMap
                }
                dataList.push(dataObject)
                dataMap[data.jobAttributeMasterId] = dataObject
                    // sequenceJobDataMap[jobAttributeStatus.sequence].jobData.push(jobData)
                if (parentId !== 0 || !isJob) {
                    continue
                } else if (this.checkContacNumber(jobData.jobAttributeMasterId, jobData.value, jobAttributeMasterMap)) {
                    contactList.push(jobData)
                } else if (this.checkAddressField(jobData.jobAttributeMasterId, jobData.value, jobAttributeMasterMap)) {
                    addressList.push(jobData)
                }
            }
        }
        dataList = dataList.sort((x, y) => x.sequence - y.sequence)
        return {
            dataMap,
            dataList
        }
    }
}

export let jobDetailsService = new JobDetails()