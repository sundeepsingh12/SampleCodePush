'use strict'

import { setState, navigateToScene, showToastAndAddUserExceptionLog } from '../global/globalActions'
import {
    ADD_FORM_LAYOUT_STATE,
    LOADER_IS_RUNNING,
    FormLayout
} from '../../lib/constants'
import { draftService } from '../../services/classes/DraftService'
import _ from 'lodash'
/**This action is called from componentDidMount 
 * 
 * Add form layout state of current status to transientFormLayoutMap
 * @param {*} formLayout  // form layout state of current status
 * @param {*} transientFormLayoutMap //contains form layout state of previous statuses and current status
 * @param {*} currentStatus 
 */
export function setStateFromNavigationParams(navigationParams, transientFormLayoutMap, navigate) {
    return async function (dispatch) {
        try {
            dispatch(setState(LOADER_IS_RUNNING, true))
            let { formLayoutState, currentStatus, contactData, jobTransaction, jobMasterId, jobDetailsScreenKey, pageObjectAdditionalParams } = navigationParams
            if (!currentStatus || !formLayoutState) {
                throw new Error('current status missing')
            }
            let cloneTransientFormLayoutMap = _.cloneDeep(transientFormLayoutMap)
            cloneTransientFormLayoutMap[currentStatus.id] = _.cloneDeep(formLayoutState)
            dispatch(setState(ADD_FORM_LAYOUT_STATE, cloneTransientFormLayoutMap))
            draftService.saveDraftInDb(formLayoutState, jobMasterId, cloneTransientFormLayoutMap, jobTransaction)
        } catch (error) {
            dispatch(setState(LOADER_IS_RUNNING, false))
            showToastAndAddUserExceptionLog(2501, error.message, 'danger', 1)
        }
    }
}