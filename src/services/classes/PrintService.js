
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
    FIELD_ATTRIBUTE_VALUE,
    JOB_ATTRIBUTE,
    FIELD_ATTRIBUTE
} from '../../lib/constants'
import {
    PRINT_SKU,
    LINE_FEED,
} from '../../lib/ContainerConstants'
import isEmpty from 'lodash/isEmpty'
import sortBy from 'lodash/sortBy'

class PrintService {

    async printingTemplateFormatStructureForFormLayout(cloneFormElement, jobTransaction, printAttributeMasterId, previousStatusFieldAttributeMap) {
        try {
            let masterIdPrintingObjectMap = {}, jobDataObject = {}
            let transaction = jobTransaction && jobTransaction.length ? jobTransaction[0] : jobTransaction
            const fieldAttributeValueList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALUE);
            let printingFieldAttributeMasterValue = fieldAttributeValueMasterService.filterFieldAttributeValueList(fieldAttributeValueList.value, printAttributeMasterId);
            let { attributeMap, jobAttributesMap } = this.combineJobAndFieldAttribute(cloneFormElement.jobAndFieldAttributesList.jobAttributes, cloneFormElement.jobAndFieldAttributesList.fieldAttributes)
            let { masterIdJobAttributeMap, printingAttributeValueMap, labelMap } = this.createMapOfMasterIdAndPrintingObject(printingFieldAttributeMasterValue, masterIdPrintingObjectMap, attributeMap, jobAttributesMap)
            printingAttributeValueMap = sortBy(printingAttributeValueMap, function (object) { return object.sequence });
            if (!isEmpty(masterIdJobAttributeMap)) {
                jobDataObject = jobDataService.prepareJobDataForTransactionParticularStatus(transaction.jobId, masterIdJobAttributeMap, masterIdJobAttributeMap)
            }
            let dataList = Object.assign({}, jobDataObject.dataList, cloneFormElement.formElement, previousStatusFieldAttributeMap)
            await this.preparePrintingTemplate(transaction.id, dataList, printingAttributeValueMap, masterIdPrintingObjectMap, labelMap,true)
        } catch (error) {
            console.log(error.message)
        }
    }

    async printingTemplateFormatStructureForDetails(jobTransaction, fieldDataList, jobDataList) {
        let masterIdPrintingObjectMap = {}
        let transaction = jobTransaction && jobTransaction.length ? jobTransaction[0] : jobTransaction
        const fieldAttributeValueList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALUE);
        const jobAttributeMasterList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
        const fieldAttributeMasterList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
        let { attributeMap } = this.combineJobAndFieldAttribute(jobAttributeMasterList.value, fieldAttributeMasterList.value)
        let dataList = Object.assign({}, jobDataList, fieldDataList)
        let printingFieldAttributeMasterValue = fieldAttributeValueMasterService.filterFieldAttributeValueList(fieldAttributeValueList.value, jobTransaction.printAttributeMasterId);
        let { printingAttributeValueMap, labelMap } = this.createMapOfMasterIdAndPrintingObject(printingFieldAttributeMasterValue, masterIdPrintingObjectMap, attributeMap)
        printingAttributeValueMap = sortBy(printingAttributeValueMap, function (object) { return object.sequence });
        await this.preparePrintingTemplate(transaction.id, dataList, printingAttributeValueMap, masterIdPrintingObjectMap, labelMap)
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

    printTypeFormatString(value, code, label) {
        switch (code) {
            case 'Barcode': return `<barcode system="CODE_128" width="DOT_250" height= "100">${String(value)}</barcode>`
            case 'Text': if (!label) {
                return `<text size=".7:0">${value + `   `}</text>`
            } else {
                return `<text size=".7:0">${label + `   :   ` + value + `   `}</text>`
            }
            case 'Header': return `<bold><text size=".8:0">${value + `   `}</text></bold>`
        }
    }

    prepareTemplateForObjectInArray(childDataValueObject, printingFieldAttributeMasterValue, attributeMasterIdType, printFormatValue, printArray, sequenceArray) {
        let childValue, childObjectValues = {}, count = 1
        for (let childItem in childDataValueObject) {
            let dataItem = childDataValueObject[childItem] && childDataValueObject[childItem].data ? childDataValueObject[childItem].data : childDataValueObject[childItem]
            if (!printingFieldAttributeMasterValue[dataItem[attributeMasterIdType]]) {
                continue
            }
            childObjectValues[dataItem[attributeMasterIdType]] = { code: printingFieldAttributeMasterValue[dataItem[attributeMasterIdType]].code, value: dataItem.value ? dataItem.value : '' }
        }
        for (let data in sequenceArray) {
            childValue = this.prepareTemplateForArrayObjectChildAttribute(printArray, printFormatValue, childObjectValues[sequenceArray[data].masterId].value, childObjectValues[sequenceArray[data].masterId].code, '', null, count)
            printArray = childValue.printArray
            printFormatValue = childValue.printFormatValue
            count += 1
        }
        printFormatValue += `<line-feed />`
        return { printArray, printFormatValue }
    }

    prepareTemplateForArrayObjectChildAttribute(printArray, printFormatValue, value, code, lineFeed, label, count) {
        if (code == 'Qrcode' && !isEmpty(value)) {
            if (!isEmpty(printFormatValue)) {
                printArray.push(printFormatValue)
                printFormatValue = ``
            }
            printArray.push([value])
        } else {
            printFormatValue += this.alignArrayItemsAccordingToOrder(value, code, label, count) + lineFeed //this.printTypeFormatString(value, code, label) + lineFeed
        }
        return { printArray, printFormatValue }
    }

    prepareTemplateForArrayInArray(childDataList, labelMap, printingFieldAttributeMasterValue, printFormatValue, attributeMasterIdType, printArray) {
        let detailArrayChildData, detailsValue, objectValue
        for (let detailsData in childDataList) {
            detailArrayChildData = childDataList[detailsData]
            detailsValue = detailArrayChildData.data ? detailArrayChildData.data : detailArrayChildData
            if (!detailsValue || detailsValue.value != OBJECT_SAROJ_FAREYE || !detailArrayChildData.childDataList) {
                continue
            }
            for (let detailObject in detailArrayChildData.childDataList) {
                objectValue = this.prepareTemplateForNormalAttribute(detailArrayChildData.childDataList[detailObject], printingFieldAttributeMasterValue, attributeMasterIdType, printFormatValue, printArray, labelMap)
                printArray = objectValue.printArray
                printFormatValue = objectValue.printFormatValue
            }
        }
        return { printArray, printFormatValue }
    }

    prepareHeaderInCaseOfObjectInArray(childDataValueObject, printFormatValue, labelMap, printingFieldAttributeMasterValue, attributeMasterIdType) {
        let valueData, printingDataObject, mapValue = {}, arrayData = [], count = 0
        for (let childItem in childDataValueObject) {
            valueData = childDataValueObject[childItem].data ? childDataValueObject[childItem].data : childDataValueObject[childItem]
            printingDataObject = printingFieldAttributeMasterValue[valueData[attributeMasterIdType]]
            if (printingDataObject) {
                mapValue[valueData[attributeMasterIdType]] = labelMap[valueData[attributeMasterIdType]]
                arrayData.push({ masterId: valueData[attributeMasterIdType], sequence: printingDataObject.sequence })
            }
        }
        let sequenceArray = sortBy(arrayData, function (object) { return object.sequence });
        for (let value in sequenceArray) {
            count += 1
            printFormatValue += this.alignArrayItemsAccordingToOrder(mapValue[sequenceArray[value].masterId], 'Text', null, count)
        }
        return { printFormatValue, sequenceArray }
    }

    alignArrayItemsAccordingToOrder(value, code, label, count = 2) {
        let countModeMap = { 1: 'left', 2: 'center' }
        let modeValue = (count >= 3) ? 'right' : countModeMap[count]
        return (!value) ? this.printTypeFormatString(value, code, label) : `<align mode= "${modeValue}">${this.printTypeFormatString(value, code, label)}</align>`
    }

    concatAllNavigationStatusAttribute(navigationFormLayoutStates) {
        let previousStatusFieldAttributeMap = {}
        for (let statusId in navigationFormLayoutStates) {
            if (isEmpty(navigationFormLayoutStates[statusId].formElement)) {
                continue
            }
            previousStatusFieldAttributeMap = Object.assign(previousStatusFieldAttributeMap, navigationFormLayoutStates[statusId].formElement)
        }
        return previousStatusFieldAttributeMap
    }

    preparePrintTemplateInCaseOfArray(childDataObject, printingFieldAttributeMasterValue, labelMap, attributeMasterIdType, printFormatValue, printArray) {
        let labelCount = 0, childValue, isChildPresentInPrintObject = true, childLabel
        for (let data in childDataObject) {
            if (childDataObject[data].attributeTypeId == OBJECT) { // case of object in array
                if (labelCount == 0) {
                    childLabel = this.prepareHeaderInCaseOfObjectInArray(childDataObject[data].childDataList, printFormatValue, labelMap, printingFieldAttributeMasterValue, attributeMasterIdType)
                    isChildPresentInPrintObject = childLabel.sequenceArray.length > 0
                    printFormatValue = childLabel.printFormatValue + `<line-feed />`
                    labelCount = 1
                }
                if (!isChildPresentInPrintObject) {
                    continue
                }
                childValue = this.prepareTemplateForObjectInArray(childDataObject[data].childDataList, printingFieldAttributeMasterValue, attributeMasterIdType, printFormatValue, printArray, childLabel.sequenceArray)
            } else if (childDataObject[data].attributeTypeId == ARRAY) {  // case of array in array
                childValue = this.prepareTemplateForArrayInArray(childDataObject[data].childDataList, labelMap, printingFieldAttributeMasterValue, printFormatValue, attributeMasterIdType, printArray)
            } else { // case of normal attribute in array
                childValue = this.prepareTemplateForNormalAttribute(childDataObject[data], printingFieldAttributeMasterValue, attributeMasterIdType, printFormatValue, printArray, labelMap)
            }
            printArray = childValue.printArray
            printFormatValue = childValue.printFormatValue
        }
        return { printArray, printFormatValue }
    }

    prepareTemplateForNormalAttribute(childDataObject, printingFieldAttributeMasterValue, attributeMasterIdType, printFormatValue, printArray, labelMap) {
        let dataItem = childDataObject && childDataObject.data ? childDataObject.data : childDataObject
        if (!dataItem || !dataItem.value || !printingFieldAttributeMasterValue[dataItem[attributeMasterIdType]]) {
            return { printArray, printFormatValue }
        }
        let dataValue = this.prepareTemplateForArrayObjectChildAttribute(printArray, printFormatValue, dataItem.value, printingFieldAttributeMasterValue[dataItem[attributeMasterIdType]].code, LINE_FEED, labelMap[dataItem[attributeMasterIdType]])
        return { printArray: dataValue.printArray, printFormatValue: dataValue.printFormatValue }
    }


    async preparePrintingTemplate(jobTransactionId, dataList, printingAttributeValueMap, printingFieldAttributeMasterValue, labelMap, isCalledFromFormLayout) {
        let printFormatValue = ``, printArray = [], attributeMasterIdType, childDataObject, printTemplate
        for (let id in printingAttributeValueMap) {
            if (!dataList[printingAttributeValueMap[id].name]) { // case of checking print Data is in datalist 
                continue
            }
            attributeMasterIdType = dataList[printingAttributeValueMap[id].name].data && dataList[printingAttributeValueMap[id].name].data.fieldAttributeMasterId || dataList[printingAttributeValueMap[id].name].fieldAttributeMasterId ? FIELD_ATTRIBUTE_MASTER_ID : JOB_ATTRIBUTE_MASTER_ID
            if (dataList[printingAttributeValueMap[id].name].childDataList) { // case of arrayType attribute
                childDataObject = dataList[printingAttributeValueMap[id].name] ? dataList[printingAttributeValueMap[id].name].childDataList : null
                childDataObject = isCalledFromFormLayout && printingAttributeValueMap[id].code == PRINT_SKU ? childDataObject[jobTransactionId].childDataList : childDataObject
                printFormatValue += `<align mode="center"><text-line size="1:0">${dataList[printingAttributeValueMap[id].name].label}</text-line><line-feed /></align>`
                printTemplate = this.preparePrintTemplateInCaseOfArray(childDataObject, printingFieldAttributeMasterValue, labelMap, attributeMasterIdType, printFormatValue, printArray)
            } else { // case of normal attribute
                printTemplate = this.prepareTemplateForNormalAttribute(dataList[printingAttributeValueMap[id].name], printingFieldAttributeMasterValue, attributeMasterIdType, printFormatValue, printArray, labelMap)
            }
            printArray = printTemplate.printArray
            printFormatValue = printTemplate.printFormatValue + LINE_FEED
        }
        printArray.push(printFormatValue + LINE_FEED + LINE_FEED)
        await this.printSortingData(printArray)
    }

    async printSortingData(printArray) {
        let startStr = `<?xml version="1.0" encoding="UTF-8"?><document><small>`
        let endStr = `</small></document>`, buffer
        for (let printData in printArray) {
            if (printArray[printData] && printArray[printData].constructor == Array) { // case of QrCode code
                await BluetoothSerial.write(String(printArray[printData][0]), 150);
            } else { // case of normal code other than qr code
                buffer = EscPos.getBufferFromTemplate(startStr + printArray[printData] + endStr, {});
                await BluetoothSerial.write(buffer, 0);
            }
        }
    }

    replaceArraySequenceWithObjectSequence(printingAttributeValueMap, masterIdPrintingObjectMap, attributeMap) {
        for (let masterId in masterIdPrintingObjectMap) {
            if (attributeMap[masterId].attributeTypeId == 11 && attributeMap[masterId].parentId && printingAttributeValueMap[attributeMap[masterId].parentId]) {
                printingAttributeValueMap[attributeMap[masterId].parentId].sequence = masterIdPrintingObjectMap[masterId].sequence
            }
        }
    }

    createMapOfMasterIdAndPrintingObject(printingAttributeValueList, masterIdPrintingObjectMap, attributeMap, jobAttributesMap) {
        let masterIdJobAttributeMap = {}, printingAttributeValueMap = {}, labelMap = {}
        for (let item in printingAttributeValueList) {
            let masterId = printingAttributeValueList[item].name.split('[')
            masterId = (masterId[masterId.length - 1]).split(']')
            printingAttributeValueList[item].name = masterId[0]
            masterIdPrintingObjectMap[masterId[0]] = printingAttributeValueList[item]
            labelMap[masterId[0]] = attributeMap[masterId[0]].label
            if (jobAttributesMap && jobAttributesMap[masterId[0]]) { // check for jobData in printAttribute in case of formLayout
                masterIdJobAttributeMap[masterId[0]] = jobAttributesMap[masterId[0]]
            }
            if (masterId[0] && attributeMap[masterId[0]] && attributeMap[masterId[0]].parentId) { // !attributeMap[masterId[0]] is to check case for JobDetails
                continue
            }
            printingAttributeValueMap[masterId[0]] = printingAttributeValueList[item]
        }
        this.replaceArraySequenceWithObjectSequence(printingAttributeValueMap, masterIdPrintingObjectMap, attributeMap)
        return { masterIdJobAttributeMap, printingAttributeValueMap, labelMap }
    }
}

export let printService = new PrintService()