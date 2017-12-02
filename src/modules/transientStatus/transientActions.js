'use strict'

import { setState } from '../global/globalActions'
import {
    ADD_FORM_LAYOUT_STATE,
    LOADER_IS_RUNNING,
} from '../../lib/constants'


/**This action is called from componentDidMount 
 * 
 * Add form layout state of current status to transientFormLayoutMap
 * @param {*} formLayout  // form layout state of current status
 * @param {*} transientFormLayoutMap //contains form layout state of previous statuses and current status
 * @param {*} currentStatus 
 */
export function setStateFromNavigationParams(formLayout, transientFormLayoutMap, currentStatus) {
    return async function (dispatch) {
        try {
            if (formLayout && currentStatus) {
                dispatch(setState(LOADER_IS_RUNNING, true))
                let cloneTransientFormLayoutMap = _.cloneDeep(transientFormLayoutMap)
                cloneTransientFormLayoutMap[currentStatus.id] = _.cloneDeep(formLayout)
                dispatch(setState(ADD_FORM_LAYOUT_STATE, cloneTransientFormLayoutMap))
            }
        } catch (error) {
            console.log(error)
        }
    }
}