
'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { statisticsListService } from '../../services/classes/statistics'
import { setState } from '../global/globalActions'
const {
    SET_DATA_IN_STATISTICS_LIST,USER_SUMMARY
} = require('../../lib/constants').default


export function getDataForStatisticsList() {
    return async function (dispatch) {
        try {
            const statisticsList = await keyValueDBService.getValueFromStore(USER_SUMMARY)
            console.log("data123",statisticsList)
            if (!statisticsList) {
                throw new Error('User Summary not available')
            }
            const selectedStatisticsList =  statisticsListService.setStatisticsList(statisticsList.value)
            dispatch(setState(SET_DATA_IN_STATISTICS_LIST, selectedStatisticsList))
        } catch (error) {
           console.log("ErrorMessage",error)
        }
    }
}
