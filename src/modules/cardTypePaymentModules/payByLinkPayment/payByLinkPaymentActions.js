'use strict'

import { setState } from '../../global/globalActions'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { moduleCustomizationService } from '../../../services/classes/ModuleCustomization'
import { payByLinkPaymentService } from '../../../services/payment/PayByLinkPayment'
const {
    CUSTOMIZATION_APP_MODULE,
    SET_PAY_BY_LINK_PARAMETERS,
} = require('../../../lib/constants').default

import {
    PAYBYLINKMODULE
} from '../../../lib/AttributeConstants'

export function getPayByLinkPaymentParameters() {
    return async function (dispatch) {
        try {
            const modulesCustomization = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
            console.log('modulesCustomization', modulesCustomization)
            const payByLinkModule = moduleCustomizationService.getModuleCustomizationForAppModuleId(modulesCustomization.value, PAYBYLINKMODULE)[0]
            const payByLinkConfigJSON = payByLinkModule ? payByLinkModule.remark ? JSON.parse(payByLinkModule.remark) : null : null
            dispatch(setState(SET_PAY_BY_LINK_PARAMETERS,
                {
                    payByLinkConfigJSON
                }
            ))
        } catch (error) {
            console.log(error)
        }
    }
}