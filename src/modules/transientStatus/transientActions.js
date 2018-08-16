'use strict'

import { setState, showToastAndAddUserExceptionLog } from '../global/globalActions'
import {
    ADD_FORM_LAYOUT_STATE,
    LOADER_IS_RUNNING,
} from '../../lib/constants'
import { draftService } from '../../services/classes/DraftService'
/**This action is called from componentDidMount 
 * 
 * Add form layout state of current status to transientFormLayoutMap
 * @param {*} formLayout  // form layout state of current status
 * @param {*} transientFormLayoutMap //contains form layout state of previous statuses and current status
 * @param {*} currentStatus 
 */
export function setStateFromNavigationParams(navigationParams, transientFormLayoutMap) {
    return async function (dispatch) {
        try {
            dispatch(setState(LOADER_IS_RUNNING, true))
            let { formLayoutState, currentStatus, jobTransaction, jobMasterId } = navigationParams
            if (!currentStatus || !formLayoutState) {
                throw new Error('current status missing')
            }
            let cloneTransientFormLayoutMap = JSON.parse(JSON.stringify(transientFormLayoutMap))
            cloneTransientFormLayoutMap[currentStatus.id] = JSON.parse(JSON.stringify(formLayoutState))
            dispatch(setState(ADD_FORM_LAYOUT_STATE, cloneTransientFormLayoutMap))
            draftService.saveDraftInDb(formLayoutState, jobMasterId, cloneTransientFormLayoutMap, jobTransaction)
        } catch (error) {
            dispatch(setState(LOADER_IS_RUNNING, false))
            showToastAndAddUserExceptionLog(2501, error.message, 'danger', 1)
        }
    }
}