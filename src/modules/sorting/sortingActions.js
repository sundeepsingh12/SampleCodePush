'use strict'

import {
    SORTING_SEARCH_VALUE,
    SORTING_ITEM_DETAILS,
    ERROR_MESSAGE,
    SORTING_LOADER
} from '../../lib/constants'
import { sortingService } from '../../services/classes/Sorting'
import { setState } from '../global/globalActions'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import CONFIG from '.././../lib/config'
import {TOKEN_MISSING} from '../../lib/AttributeConstants'


/**This action is fire when search button or qr button is tap,
 * 
 * @param {*} referenceNumber // it return the user_detail
 * return data for view of sorting and printing list 
 */
export function getDataForSortingAndPrinting(referenceNumber) {
    return async function (dispatch) {
        try {
            dispatch(setState(SORTING_LOADER, true))
            const token =  await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            if (!token && token.value != null && token.value != undefined) {
                throw new Error(TOKEN_MISSING)
            }
            const  sortingJson =  await sortingService.getSortingData(referenceNumber,token.value)
            const setSortingValues = sortingService.setSortingData(sortingJson,referenceNumber)
            dispatch(setState(SORTING_ITEM_DETAILS, setSortingValues))
        } catch (error) {
            dispatch(setState(ERROR_MESSAGE, error.message))
            // dispatch(setState(ERROR_MESSAGE, ''))
        }
    }
}