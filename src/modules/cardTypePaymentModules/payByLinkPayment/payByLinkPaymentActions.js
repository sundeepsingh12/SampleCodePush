'use strict'

import { setState } from '../../global/globalActions'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { moduleCustomizationService } from '../../../services/classes/ModuleCustomization'
import { payByLinkPaymentService } from '../../../services/payment/PayByLinkPayment'
import {
    CUSTOMIZATION_APP_MODULE,
    SET_PAY_BY_LINK_PARAMETERS,
} from '../../../lib/constants'

import {
    PAYBYLINKMODULE
} from '../../../lib/AttributeConstants'

export function getPayByLinkPaymentParameters(contactDataList) {
    return async function (dispatch) {
        try {
            console.log('getPayByLinkPaymentParameters',contactDataList)
            const modulesCustomization = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
            console.log('modulesCustomization', modulesCustomization)
            const payByLinkModule = moduleCustomizationService.getModuleCustomizationForAppModuleId(modulesCustomization.value, PAYBYLINKMODULE)[0]
            const payByLinkConfigJSON = payByLinkModule ? payByLinkModule.remark ? JSON.parse(payByLinkModule.remark) : null : null
            dispatch(setState(SET_PAY_BY_LINK_PARAMETERS,
                {
                    payByLinkConfigJSON,
                    customerContact : contactDataList[0]
                }
            ))
        } catch (error) {
            console.log(error)
        }
    }
}