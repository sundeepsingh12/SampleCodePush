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
    MONEY_PAY
} from '../../lib/AttributeConstants'
class SignatureRemarks {

    getRemarksList(fieldDataList) {
        var checkCondition;
        let dataList = []
        for (var [key, fieldDataObject] of fieldDataList.entries()) {
            let dataObject = {}
            switch (key) {
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
            if (!fieldDataObject.hidden && fieldDataObject.value !== undefined && fieldDataObject.value !== null && fieldDataObject.value.trim() != '' && (fieldDataObject.parentId == 0 || fieldDataObject.parentId == -1) && checkCondition) {
                dataObject.label = fieldDataObject.label
                dataObject.value = fieldDataObject.value
                dataList.push(dataObject)
            }
            if (fieldDataObject.attributeTypeId == MONEY_COLLECT || fieldDataObject.attributeTypeId == MONEY_PAY) {

                if (fieldDataObject.childFieldDataList.length > 0) {
                    for (let childFieldData of fieldDataObject.childFieldDataList) {
                        if (childFieldData.attributeTypeId == 26) {
                            dataObject.label = childFieldData.label
                            dataObject.value = childFieldData.value
                            dataList.push(dataObject)
                        }
                    }
                }
            }

        }
        return dataList
    }
    async saveFile(result) {
       // console.log('===' + result.encoded)
        const currentTimeInMillis = moment()
       // var PATH_TEMP = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/TEMP';
       var PATH_TEMP = 'storage/emulated/0/'
        //RNFS.mkdir(PATH_TEMP);        
        await RNFS.writeFile(PATH_TEMP + 'sign_' + currentTimeInMillis + '.jpg', result.encoded, 'base64');
        var stat = await RNFS.stat(PATH_TEMP + 'sign_' + currentTimeInMillis + '.jpg');
         console.log('=====img size '+stat.size);
    }
}

export let signatureService = new SignatureRemarks()