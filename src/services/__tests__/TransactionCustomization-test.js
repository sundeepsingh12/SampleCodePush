'use strict'

import { transactionCustomizationService } from '../classes/TransactionCustomization'
import { keyValueDBService } from '../classes/KeyValueDBService'
import {
    CUSTOMER_CARE,
    CUSTOMIZATION_LIST_MAP,
    JOB_ATTRIBUTE,
    JOB_ATTRIBUTE_STATUS,
    JOB_MASTER,
    JOB_STATUS,
    SMS_TEMPLATE,
} from '../../lib/constants'
import { keyValueDB } from '../../repositories/keyValueDb';

describe('test cases for getModuleCustomizationMapForAppModuleId', () => {

    it('should return jobTransactionCustomizationListParametersDTO', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({
            value: {
                id: '123'
            }
        })

        const jobTransactionCustomizationListParametersDTO = {
            customerCareList: { id: '123' },
            jobAttributeMasterList: { id: '123' },
            jobAttributeStatusList: { id: '123' },
            jobMasterList: { id: '123' },
            jobMasterIdCustomizationMap: { id: '123' },
            smsTemplateList: { id: '123' },
            statusList: { id: '123' },
        }

        return transactionCustomizationService.getJobListingParameters()
            .then((data) => {
                expect(data).toEqual(jobTransactionCustomizationListParametersDTO)
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(7)
            })
    })
})