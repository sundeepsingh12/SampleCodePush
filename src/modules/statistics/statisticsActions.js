
'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { statisticsListService } from '../../services/classes/Statistics'
import { setState, showToastAndAddUserExceptionLog } from '../global/globalActions'
import {
    SET_DATA_IN_STATISTICS_LIST,USER_SUMMARY
} from '../../lib/constants'

/**This action is fire when statistics module is tap,
 * 
 * return data for view of statistics list 
 */
export function getDataForStatisticsList() {
    return async function (dispatch) {
        try {
            const userSummaryList = await keyValueDBService.getValueFromStore(USER_SUMMARY)
            if (!userSummaryList) {
                throw new Error('User Summary not available')
            }
            const selectedStatisticsList =  statisticsListService.setStatisticsList(userSummaryList.value)
            dispatch(setState(SET_DATA_IN_STATISTICS_LIST, selectedStatisticsList))
        } catch (error) {
            showToastAndAddUserExceptionLog(2401, error.message, 'danger', 1)
        }
    }
}
