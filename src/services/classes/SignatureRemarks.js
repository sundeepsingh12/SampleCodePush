'use strict'
import RNFS from 'react-native-fs';
import moment from 'moment'
import CONFIG from '../../lib/config'
import {
    SKU_ARRAY,
    CAMERA_HIGH,
    CAMERA_MEDIUM,
    CAMERA,
    SIGNATURE,
    SIGNATURE_AND_FEEDBACK,
    CASH_TENDERING,
    OPTION_CHECKBOX,
    ARRAY,
    OPTION_RADIO_FOR_MASTER,
    FIXED_SKU,
    MULTIPLE_SCANNER,
    SKU_ACTUAL_AMOUNT,
    TOTAL_ORIGINAL_QUANTITY,
    TOTAL_ACTUAL_QUANTITY,
    MONEY_COLLECT,
    MONEY_PAY,
    ACTUAL_AMOUNT,
    PATH_TEMP,
    SIGN,
    IMAGE_EXTENSION,
    PATH
} from '../../lib/AttributeConstants'
import {
    USER,
    FIELD_ATTRIBUTE,
} from '../../lib/constants'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { fieldDataService } from '../../services/classes/FieldData'
class SignatureRemarks {

    /**
        * creates remarks DataList object, which contains value and label of all remarks
        * @param {*formElement Map} nextEditable 
        */
    filterRemarksList(fieldDataList) {
        if (fieldDataList == undefined)
            return []
        let checkCondition;
        let dataList = []
        for (let [key, fieldDataObject] of fieldDataList.entries()) {
            let dataObject = {}
            switch (fieldDataObject.attributeTypeId) {
                case CAMERA_HIGH:
                case CAMERA_MEDIUM:
                case CAMERA:
                case SIGNATURE:
                case SKU_ARRAY:
                case SIGNATURE_AND_FEEDBACK:
                case CASH_TENDERING:
                case OPTION_CHECKBOX:
                case ARRAY:
                case OPTION_RADIO_FOR_MASTER:
                case FIXED_SKU:
                case MULTIPLE_SCANNER:
                case SKU_ACTUAL_AMOUNT:
                case TOTAL_ORIGINAL_QUANTITY:
                case TOTAL_ACTUAL_QUANTITY:
                case MONEY_COLLECT:
                case MONEY_PAY:
                    checkCondition = false;
                    break;
                default:
                    checkCondition = true;
            }
            if (fieldDataObject && !fieldDataObject.hidden && fieldDataObject.value != undefined && fieldDataObject.value.trim() != '' && (fieldDataObject.parentId == 0 || fieldDataObject.parentId == -1) && checkCondition) {
                let { label, value, fieldAttributeMasterId } = fieldDataObject
                dataList.push({ label, value, fieldAttributeMasterId })
            }
            if ((fieldDataObject.attributeTypeId == MONEY_COLLECT || fieldDataObject.attributeTypeId == MONEY_PAY) && fieldDataObject.childDataList != null && fieldDataObject.childDataList.length > 0) {
                for (let childFieldData of fieldDataObject.childDataList) {
                    if (childFieldData.attributeTypeId == ACTUAL_AMOUNT) {
                        let { label, fieldAttributeMasterId } = fieldDataObject
                        let { value } = childFieldData
                        dataList.push({ label, value, fieldAttributeMasterId })
                    }
                }
            }
        }
        return dataList
    }
    /**
            * saves signature image and returns image name
            * @param {*} result result from signature save
            * @param {*} currentTimeInMillis current time 
            */
    async saveFile(result, currentTimeInMillis, isCameraImage) {
        RNFS.mkdir(PATH_TEMP);
        RNFS.mkdir(PATH);
        let image_name
        if (!isCameraImage) {
            image_name = SIGN + currentTimeInMillis + IMAGE_EXTENSION
            await RNFS.writeFile(PATH_TEMP + image_name, result.encoded, 'base64');
            await RNFS.writeFile(PATH + image_name, result.encoded, 'base64');
        } else {
            image_name = 'cust_' + currentTimeInMillis + IMAGE_EXTENSION
            await RNFS.writeFile(PATH_TEMP + image_name, result, 'base64');
            await RNFS.writeFile(PATH + image_name, result, 'base64');
        }
        const user = await keyValueDBService.getValueFromStore(USER);
        const value = moment().format('YYYY-MM-DD') + '/' + user.value.company.id + '/' + image_name
        return value
    }
    /**
     * returns remarks validation
     * @param {*} validation validation array
     */
    getRemarksValidation(validation) {
        if (validation && validation.length > 0) {
            let value = validation.filter((value) => value.timeOfExecution == 'MINMAX')
            return ((value[0] && value[0].condition == 'TRUE'))
        }
        return false
    }
    /**
   * creates fieldDataObject , which contains childFieldDataList for sign and nps attribute
   * @param {*} signatureValue
   * @param {*} npsValue
   * @param {*} currentElement 
   * @param {*} fieldAttributeMasterList 
   * @param {*} jobTransactionId 
   * @param {*} latestPositionId 
   */
    prepareSignAndNpsFieldData(signatureValue, npsValue, currentElement, fieldAttributeMasterList, jobTransactionId, latestPositionId) {
        if (!fieldAttributeMasterList || !fieldAttributeMasterList.value || fieldAttributeMasterList.value.length <= 0) return []
        let fieldAttributeList = fieldAttributeMasterList.value.filter((fieldAttribute) => fieldAttribute.parentId == currentElement.fieldAttributeMasterId)
        let childDataList = []
        for (let fieldAttribute of fieldAttributeList) {
            fieldAttribute.value = (fieldAttribute.attributeTypeId == SIGNATURE) ? signatureValue : npsValue + ''
            let { id, attributeTypeId, value, key } = fieldAttribute
            childDataList.push({ fieldAttributeMasterId: id, attributeTypeId, value, key })
        }
        let fieldDataObject = fieldDataService.prepareFieldDataForTransactionSavingInState(childDataList, jobTransactionId, currentElement.positionId, latestPositionId)
        return fieldDataObject
    }
    async getImageData(value) {
        let imageName = value.split('/')
        let fileExits = await RNFS.exists(PATH + imageName[imageName.length - 1])
        let result
        if (fileExits) {
            result = await RNFS.readFile(PATH + imageName[imageName.length - 1], 'base64');
        }
        return result
    }
}

export let signatureService = new SignatureRemarks()