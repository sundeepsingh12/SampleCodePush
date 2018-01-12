'use strict'
import {
    setState
} from '../global/globalActions'
import {
    bulkService
} from '../../services/classes/Bulk'
import {
    keyValueDBService
} from '../../services/classes/KeyValueDBService'
import {SET_LOADER_IN_AUTOLOGOUT,USER,AutoLogoutScreen,HomeTabNavigatorScreen,PENDING_SYNC_TRANSACTION_IDS} from '../../lib/constants'
import moment from 'moment'
import {
    NavigationActions
  } from 'react-navigation'
  import {
    invalidateUserSessionForAutoLogout,startLoginScreenWithoutLogout
  } from '../pre-loader/preloaderActions'



export function setAutoLogout() {
    return async function (dispatch) {
        // let pendingSyncTransactionIds
        try {
            dispatch(invalidateUserSessionForAutoLogout())
        //     console.logs("2")            
        //  pendingSyncTransactionIds = await keyValueDBService.getValueFromStore(PENDING_SYNC_TRANSACTION_IDS)
        //     if(pendingSyncTransactionIds && pendingSyncTransactionIds.value.length > 0){
        //         console.logs("3")
                
        //         //dispatch(setState(SET_LOADER_IN_AUTOLOGOUT,true))                
        //     }else{
        //         console.logs("4")
        //         dispatch(invalidateUserSessionForAutoLogout())
        //     }            
        } catch (error) {
            console.log(error)
        }
    }
}