'use strict'
import * as realm from '../../repositories/realmdb'


class Logout {

    deleteDataBase() {
        realm.deleteRecords()
    }
}

export let logoutService = new Logout()