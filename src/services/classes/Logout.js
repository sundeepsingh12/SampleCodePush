'use strict'
import * as realm from '../../repositories/realmdb'
import size from 'lodash/size'

class Logout {

    deleteDataBase() {
        realm.deleteRecords()
    }

    checkForUnsyncTransactions(pendingSyncTransactionIds) {
        let transactionsToSync = (!pendingSyncTransactionIds || !pendingSyncTransactionIds.value) ? {} : pendingSyncTransactionIds.value;
        return (size(transactionsToSync) > 0)
    }
}

export let logoutService = new Logout()