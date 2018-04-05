'use strict'
import { invalidateUserSessionForAutoLogout } from '../pre-loader/preloaderActions'

export function setAutoLogout() {
    return async function (dispatch) {
        try {
            dispatch(invalidateUserSessionForAutoLogout())
        //  pendingSyncTransactionIds = await keyValueDBService.getValueFromStore(PENDING_SYNC_TRANSACTION_IDS)
        //     if(pendingSyncTransactionIds && pendingSyncTransactionIds.value.length > 0){
        //         //console.logs("3")
                
        //         dispatch(setState(SET_LOADER_IN_AUTOLOGOUT,true))                
        //     }else{
        //         console.logs("4")
        //         // dispatch(invalidateUserSessionForAutoLogout())
        //     }            
        } catch (error) {
            console.log(error)
        //         dispatch(setState(SET_LOADER_IN_AUTOLOGOUT,false))                
        }
    }
}