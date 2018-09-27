
import { jobDataService } from './JobData'
import BluetoothSerial from 'react-native-bluetooth-serial';
import { EscPos } from 'escpos-xml';
import { keyValueDBService } from './KeyValueDBService.js'
import { fieldAttributeValueMasterService } from './FieldAttributeValueMaster'
import {
    ARRAY,
    OBJECT,
    OBJECT_SAROJ_FAREYE,
    FIELD_ATTRIBUTE_MASTER_ID,
    JOB_ATTRIBUTE_MASTER_ID
} from '../../lib/AttributeConstants'
import {
    FIELD_ATTRIBUTE_VALUE
}from '../../lib/constants'
import {
    PRINT_SKU,
    LINE_FEED,
}from '../../lib/ContainerConstants'
import isEmpty from 'lodash/isEmpty'
import sortBy from 'lodash/sortBy'

class PrintService {

    async printingTemplateFormatStructureForFormLayout(cloneFormElement, jobTransaction, printAttributeMasterId, previousStatusFieldAttributeMap) {
        let masterIdPrintingObjectMap = {}, jobDataObject = {}
        let transaction = jobTransaction && jobTransaction.length ? jobTransaction[0] : jobTransaction
        const fieldAttributeValueList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALUE);
        let printingFieldAttributeMasterValue = fieldAttributeValueMasterService.filterFieldAttributeValueList(fieldAttributeValueList.value, printAttributeMasterId);
        let { attributeMap, jobAttributesMap } = this.combineJobAndFieldAttribute(cloneFormElement.jobAndFieldAttributesList.jobAttributes, cloneFormElement.jobAndFieldAttributesList.fieldAttributes)
        let { masterIdJobAttributeMap, printingAttributeValueMap, labelMap } = this.createMapOfMasterIdAndPrintingObject(printingFieldAttributeMasterValue, masterIdPrintingObjectMap, attributeMap, jobAttributesMap, true)
        printingAttributeValueMap = sortBy(printingAttributeValueMap, function (object) { return object.sequence });
        if (!isEmpty(masterIdJobAttributeMap)) {
            jobDataObject = jobDataService.prepareJobDataForTransactionParticularStatus(transaction.jobId, masterIdJobAttributeMap, masterIdJobAttributeMap)
        }
        let dataList = Object.assign({}, jobDataObject.dataList, cloneFormElement.formElement, previousStatusFieldAttributeMap)
        await this.preparePrintingTemplate(transaction.id, dataList, printingAttributeValueMap, masterIdPrintingObjectMap, labelMap)
    }

    async printingTemplateFormatStructureForDetails(jobTransaction, fieldDataList, jobDataList) {
        let  masterIdPrintingObjectMap = {}
        let transaction = jobTransaction && jobTransaction.length ? jobTransaction[0] : jobTransaction
        const fieldAttributeValueList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALUE);
        let dataList = Object.assign({}, jobDataList, fieldDataList)
        let printingFieldAttributeMasterValue = fieldAttributeValueMasterService.filterFieldAttributeValueList(fieldAttributeValueList.value, jobTransaction.printAttributeMasterId);
        let { printingAttributeValueMap } = this.createMapOfMasterIdAndPrintingObject(printingFieldAttributeMasterValue, masterIdPrintingObjectMap, dataList)
        printingAttributeValueMap = sortBy(printingAttributeValueMap, function (object) { return object.sequence });
        await this.preparePrintingTemplate(transaction.id, dataList, printingAttributeValueMap, masterIdPrintingObjectMap)
    }

    combineJobAndFieldAttribute(jobAttributes, fieldAttributes) {
        let attributeMap = {}, jobAttributesMap = {}
        for (let id in jobAttributes) {
            attributeMap[jobAttributes[id].id] = jobAttributes[id]
            jobAttributesMap[jobAttributes[id].id] = jobAttributes[id]
        }
        for (let id in fieldAttributes) {
            attributeMap[fieldAttributes[id].id] = fieldAttributes[id]
        }
        return { attributeMap, jobAttributesMap }
    }

    printTypeFormatString(value, label) {
        switch (label) {
            case 'Barcode': return `<barcode system="CODE_128" width="DOT_250" height= "100">${String(value)}</barcode>`
            case 'Text': return `<text size="1:0">${value + `   `}</text>`
            case 'Header': return `<bold><text size="1:1">${value + `   `}</text></bold>`
        }
    }

    prepareTemplateForObjectInArray(childDataValueObject, printingFieldAttributeMasterValue, attributeMasterIdType, printFormatValue, printArray) {
        let childValue
        for (let childItem in childDataValueObject) {
            childValue = this.prepareTemplateForNormalAttribute(childDataValueObject[childItem], printingFieldAttributeMasterValue, attributeMasterIdType, printFormatValue, printArray, ``)
            printArray = childValue.printArray
            printFormatValue = childValue.printFormatValue 
        }
        printFormatValue +=  `<line-feed />`
        return { printArray, printFormatValue }
    }

    prepareTemplateForArrayInArray(childDataList, labelMap, printingFieldAttributeMasterValue, printFormatValue, attributeMasterIdType, printArray) {
        let detailArrayChildData, detailsValue, objectValue
        for (let detailsData in childDataList) {
            detailArrayChildData = childDataList[detailsData]
            detailsValue = labelMap ? detailArrayChildData : detailArrayChildData.data
            if (!detailsValue || detailsValue.value != OBJECT_SAROJ_FAREYE || !detailArrayChildData.childDataList) {
                continue
            }
            for (let detailObject in detailArrayChildData.childDataList) {
                objectValue = this.prepareTemplateForNormalAttribute(detailArrayChildData.childDataList[detailObject], printingFieldAttributeMasterValue, attributeMasterIdType, printFormatValue, printArray, LINE_FEED)
                printArray = objectValue.printArray
                printFormatValue = objectValue.printFormatValue
            }
        }
        return { printArray, printFormatValue }
    }

    prepareHeaderInCaseOfObjectInArray(childDataValueObject, printFormatValue, labelMap, printingFieldAttributeMasterValue, attributeMasterIdType){
        let  valueData, printingDataObject
        for (let childItem in childDataValueObject) {
            valueData = childDataValueObject[childItem].data ? childDataValueObject[childItem].data : childDataValueObject[childItem]
            printingDataObject = printingFieldAttributeMasterValue[valueData[attributeMasterIdType]]
            if (printingDataObject) {
                printFormatValue += this.printTypeFormatString(labelMap ? labelMap[valueData[attributeMasterIdType]] : childDataValueObject[childItem].label, 'Text')
            }
        }
        return printFormatValue
    }

    concatAllNavigationStatusAttribute(navigationFormLayoutStates){
        let previousStatusFieldAttributeMap = {}
        for(let statusId in navigationFormLayoutStates){
            if(isEmpty(navigationFormLayoutStates[statusId].formElement)) {
                continue
            }
            previousStatusFieldAttributeMap = Object.assign(previousStatusFieldAttributeMap,navigationFormLayoutStates[statusId].formElement)
        }
        return previousStatusFieldAttributeMap 
    }

    preparePrintTemplateInCaseOfArray(childDataObject, printingFieldAttributeMasterValue, labelMap, attributeMasterIdType, printFormatValue, printArray) {
        let labelCount = 0, childValue, isChildPresentInPrintObject = true, childLabel
        for (let data in childDataObject) {
            if (childDataObject[data].attributeTypeId == OBJECT) { // case of object in array
                if(labelCount == 0){
                    childLabel = this.prepareHeaderInCaseOfObjectInArray(childDataObject[data].childDataList, printFormatValue, labelMap, printingFieldAttributeMasterValue, attributeMasterIdType)
                    isChildPresentInPrintObject = childLabel != printFormatValue
                    printFormatValue = childLabel + `<line-feed />`
                    labelCount = 1
                }
                if(!isChildPresentInPrintObject){
                    continue
                }
                childValue = this.prepareTemplateForObjectInArray(childDataObject[data].childDataList, printingFieldAttributeMasterValue, attributeMasterIdType, printFormatValue, printArray)
            } else if (childDataObject[data].attributeTypeId == ARRAY) {  // case of array in array
                childValue = this.prepareTemplateForArrayInArray(childDataObject[data].childDataList, labelMap, printingFieldAttributeMasterValue, printFormatValue, attributeMasterIdType, printArray)
            } else { // case of normal attribute in array
                childValue = this.prepareTemplateForNormalAttribute(childDataObject[data], printingFieldAttributeMasterValue, attributeMasterIdType, printFormatValue, printArray, LINE_FEED)
            }
            printArray = childValue.printArray
            printFormatValue = childValue.printFormatValue
        }
        return { printArray, printFormatValue }
    }

    prepareTemplateForNormalAttribute(childDataObject, printingFieldAttributeMasterValue, attributeMasterIdType, printFormatValue, printArray, lineFeed) {
        let dataItem = childDataObject && childDataObject.data ? childDataObject.data : childDataObject
        if (!dataItem || !dataItem.value || !printingFieldAttributeMasterValue[dataItem[attributeMasterIdType]]) {
            return {printArray, printFormatValue}
        }
        if (printingFieldAttributeMasterValue[dataItem[attributeMasterIdType]].code == 'Qrcode') {
            if (!isEmpty(printFormatValue)) {
                printArray.push(printFormatValue)
                printFormatValue = ``
            }
            printArray.push([dataItem.value])
        } else {
            printFormatValue += this.printTypeFormatString(dataItem.value, printingFieldAttributeMasterValue[dataItem[attributeMasterIdType]].code) + lineFeed
        }
        return {printArray, printFormatValue}
    }


    async preparePrintingTemplate(jobTransactionId, dataList, printingAttributeValueMap, printingFieldAttributeMasterValue, labelMap) {
        let printFormatValue = ``, printArray = [], attributeMasterIdType, childDataObject, printTemplate
        for (let id in printingAttributeValueMap) {
            if (!dataList[printingAttributeValueMap[id].name]) { // case of checking print Data is in datalist 
                continue
            }
            attributeMasterIdType = dataList[printingAttributeValueMap[id].name].data && dataList[printingAttributeValueMap[id].name].data.fieldAttributeMasterId || dataList[printingAttributeValueMap[id].name].fieldAttributeMasterId ? FIELD_ATTRIBUTE_MASTER_ID : JOB_ATTRIBUTE_MASTER_ID
            if (dataList[printingAttributeValueMap[id].name].childDataList) { // case of arrayType attribute
                childDataObject = dataList[printingAttributeValueMap[id].name] ? dataList[printingAttributeValueMap[id].name].childDataList : null
                childDataObject = labelMap && printingAttributeValueMap[id].code == PRINT_SKU ? childDataObject[jobTransactionId].childDataList : childDataObject
                printFormatValue += `<align mode="center"><text-line size="1:0">${dataList[printingAttributeValueMap[id].name].label}</text-line><line-feed /></align>`
                printTemplate = this.preparePrintTemplateInCaseOfArray(childDataObject, printingFieldAttributeMasterValue, labelMap, attributeMasterIdType, printFormatValue, printArray)
            } else { // case of normal attribute
                printTemplate = this.prepareTemplateForNormalAttribute(dataList[printingAttributeValueMap[id].name], printingFieldAttributeMasterValue, attributeMasterIdType, printFormatValue, printArray, LINE_FEED)
            }               
            printArray = printTemplate.printArray
            printFormatValue = printTemplate.printFormatValue
        }
        printArray.push(printFormatValue)
        await this.printSortingData(printArray)
    }

    async printSortingData(printArray) {
        let startStr = `<?xml version="1.0" encoding="UTF-8"?><document><small><align mode="center">`
        let endStr = `</align></small></document>`, buffer
        for (let printData in printArray) {
            if (printArray[printData] && printArray[printData].constructor == Array) { // case of QrCode code
                await BluetoothSerial.write(String(printArray[printData][0]), 150);
            } else { // case of normal code other than qr code
                buffer = EscPos.getBufferFromTemplate(startStr + printArray[printData] + endStr, {});
                await BluetoothSerial.write(buffer, 0);
            }
        }
    }

    createMapOfMasterIdAndPrintingObject(printingAttributeValueList, masterIdPrintingObjectMap, attributeMap, jobAttributesMap, calledFromFormLayout) {
        let masterIdJobAttributeMap = {}, printingAttributeValueMap = {}, labelMap = {}
        for (let item in printingAttributeValueList) {
            let masterId = printingAttributeValueList[item].name.split('[')
            masterId = (masterId[masterId.length - 1]).split(']')
            printingAttributeValueList[item].name = masterId[0]
            masterIdPrintingObjectMap[masterId[0]] = printingAttributeValueList[item]
            if (calledFromFormLayout) { // check for jobData in printAttribute in case of formLayout
                labelMap[masterId[0]] = attributeMap[masterId[0]].label
                if (jobAttributesMap && jobAttributesMap[masterId[0]]) {
                    masterIdJobAttributeMap[masterId[0]] = jobAttributesMap[masterId[0]]
                }
            }
            if (masterId[0] && ((calledFromFormLayout && attributeMap[masterId[0]] && attributeMap[masterId[0]].parentId) || !attributeMap[masterId[0]])) { // !attributeMap[masterId[0]] is to check case for JobDetails
                continue
            }
            printingAttributeValueMap[masterId[0]] = printingAttributeValueList[item]
        }
        return { masterIdJobAttributeMap, printingAttributeValueMap, labelMap }
    }
}

export let printService = new PrintService()