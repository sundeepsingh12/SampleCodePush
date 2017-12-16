'use strict'

import { setState, navigateToScene } from '../global/globalActions'
import {
    ADD_FORM_LAYOUT_STATE,
    LOADER_IS_RUNNING,
    FormLayout
} from '../../lib/constants'


/**This action is called from componentDidMount 
 * 
 * Add form layout state of current status to transientFormLayoutMap
 * @param {*} formLayout  // form layout state of current status
 * @param {*} transientFormLayoutMap //contains form layout state of previous statuses and current status
 * @param {*} currentStatus 
 */
export function setStateFromNavigationParams(formLayout, transientFormLayoutMap, currentStatus, contactData, jobTransaction, jobMasterId) {
    return async function (dispatch) {
        try {
            if (formLayout && currentStatus) {
                dispatch(setState(LOADER_IS_RUNNING, true))
                let cloneTransientFormLayoutMap = _.cloneDeep(transientFormLayoutMap)
                cloneTransientFormLayoutMap[currentStatus.id] = _.cloneDeep(formLayout)
                dispatch(setState(ADD_FORM_LAYOUT_STATE, cloneTransientFormLayoutMap))
                if (_.size(currentStatus.nextStatusList) == 1) {
                    dispatch(navigateToScene(FormLayout, {
                        contactData,
                        jobTransactionId: jobTransaction.id,
                        jobTransaction: jobTransaction,
                        statusId: currentStatus.nextStatusList[0].id,
                        statusName: currentStatus.nextStatusList[0].name,
                        jobMasterId: jobMasterId,
                        navigationFormLayoutStates: cloneTransientFormLayoutMap,
                    }))
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}