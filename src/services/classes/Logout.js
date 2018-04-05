'use strict'
import * as realm from '../../repositories/realmdb'
import _ from 'lodash'

class Logout {

    deleteDataBase() {
        realm.deleteRecords()
    }
    
    checkForUnsyncTransactions(pendingSyncTransactionIds) {
        let transactionsToSync = (!pendingSyncTransactionIds || !pendingSyncTransactionIds.value) ? [] : pendingSyncTransactionIds.value;
        return (transactionsToSync.length > 0)
    }
}

export let logoutService = new Logout()