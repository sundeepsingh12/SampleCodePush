
import { transientStatusService } from '../classes/TransientStatusService'
import {
    DATA_STORE_ATTR_MASTER_ID,
    DATA_STORE_MASTER_ID,
    SEARCH_VALUE,
    GET,
    EXTERNAL_DATA_STORE_URL,
    DATA_STORE_ATTR_KEY,
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
    IMAGE_EXTENSION
} from '../../lib/AttributeConstants'
import { formLayoutEventsInterface } from '../classes/formLayout/FormLayoutEventInterface.js'

describe('test getCurrentStatus', () => {
    let statusList = {
        value: [{
            id: 1,
            jobMasterId: 123
        }]
    }
    let jobMasterId = 123
    let statusId = 1

    it('should return current status', () => {
        const result = {
            id: 1,
            jobMasterId: 123
        }
        expect(transientStatusService.getCurrentStatus(statusList, statusId, jobMasterId)).toEqual(result)
    })
})



// describe('test getRecurringData', () => {
//     it('should return recurringData', () => {
//         let formLayoutState = {
//             id: 123
//         }
//         let recurringData = {}
//         let jobTransaction = {
//             id: -1,
//             jobId: -1
//         }
//         let statusId = 123

//         let differentData = {
//             '-1': {
//                 id: -1,
//                 jobId: -1,
//                 textToShow: 1,
//                 fieldDataArray: elementsArray,
//                 formLayoutState,
//                 amount: 0
//             }
//         }
//         expect(transientStatusService.setSavedJobDetails(formLayoutState, recurringData, jobTransaction, statusId)).toEqual(result)
//     })
// })
