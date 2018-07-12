'use strict'

import {
    SORTING_ITEM_DETAILS,
    DEFAULT_ERROR_MESSAGE_IN_SORTING,
    SORTING_LOADER
} from '../../lib/constants'
import { sortingService } from '../../services/classes/Sorting'
import { setState, showToastAndAddUserExceptionLog } from '../global/globalActions'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import CONFIG from '.././../lib/config'
import { TOKEN_MISSING } from '../../lib/AttributeConstants'


/**This action is fire when search button or qr button is tap,
 * 
 * @param {*} referenceNumber // it return the user_detail
 * return data for view of sorting and printing list 
 */
export function getDataForSortingAndPrinting(referenceNumber) {
    return async function (dispatch) {
        try {
            dispatch(setState(SORTING_LOADER, true))
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            if (!token) {
                throw new Error(TOKEN_MISSING)
            }
            const sortingJson = await sortingService.getSortingData(referenceNumber, token.value)
            const setSortingValues = sortingService.setSortingData(sortingJson)
            dispatch(setState(SORTING_ITEM_DETAILS, setSortingValues))
        } catch (error) {
            dispatch(setState(DEFAULT_ERROR_MESSAGE_IN_SORTING, error.message))
            showToastAndAddUserExceptionLog(2301, error.message, 'danger', 0)
        }
    }
}