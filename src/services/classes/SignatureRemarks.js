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
    ACTUAL_AMOUNT
} from '../../lib/AttributeConstants'
class SignatureRemarks {

    filterRemarksList(fieldDataList) { //TODO add javadoc
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
                    checkCondition = false;
                    break;
                default:
                    checkCondition = true;
            }
            if (fieldDataObject && !fieldDataObject.hidden && fieldDataObject.value && fieldDataObject.value.trim() != '' && (fieldDataObject.parentId == 0 || fieldDataObject.parentId == -1) && checkCondition) {
                let { label, value } = fieldDataObject
                dataList.push({ label, value })
            }
            if ((fieldDataObject.attributeTypeId == MONEY_COLLECT || fieldDataObject.attributeTypeId == MONEY_PAY) && fieldDataObject.childFieldDataList != null && fieldDataObject.childFieldDataList.length > 0) {
                for (let childFieldData of fieldDataObject.childFieldDataList) {
                    if (childFieldData.attributeTypeId == ACTUAL_AMOUNT) {
                        let { label, value } = childFieldData
                        dataList.push({ label, value })
                    }
                }
            }
        }
        return dataList
    }

    async saveFile(result) {
        const currentTimeInMillis = moment()
        let PATH_TEMP = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/TEMP'; //TODO update variable name
        let image_name = 'sign_' + currentTimeInMillis + '.jpg'
        await RNFS.writeFile(PATH_TEMP + image_name, result.encoded, 'base64');
        return image_name
    }

    getRemarksValidation(validation) {
        if (validation != null && validation.length > 0) {
            let value = validation.filter((value) => value.timeOfExecution == 'MINMAX')
            if (value[0].condition == 'TRUE')
                return true
        }
        return false
    }
}

export let signatureService = new SignatureRemarks()