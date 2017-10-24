class FieldAttribute {

    prepareFieldDataForTransactionSavingInState(fieldDataListDTO, jobTransactionId, parentId, latestPositionId) {
        let fieldDataList = []
        for (let index in fieldDataListDTO) {
            let fieldData = {}
            fieldData.attributeTypeId = fieldDataListDTO[index].attributeTypeId
            fieldData.fieldAttributeMasterId = fieldDataListDTO[index].fieldAttributeMasterId
            fieldData.jobTransactionId = jobTransactionId
            fieldData.parentId = parentId
            fieldData.positionId = latestPositionId
            fieldData.value = fieldDataListDTO[index].value
            latestPositionId++
            if (fieldDataListDTO[index].childDataList) {
                let fieldDataDTO = this.prepareFieldDataForTransactionSavingInState(Object.values(fieldDataListDTO[index].childDataList), jobTransactionId, fieldData.positionId, latestPositionId)
                fieldData.childDataList = fieldDataDTO.fieldDataList
                latestPositionId = fieldDataDTO.latestPositionId
            }
            fieldDataList.push(fieldData)
        }
        return {
            fieldDataList,
            latestPositionId
        }
    }
}

export let fieldAttributeService = new FieldAttribute()