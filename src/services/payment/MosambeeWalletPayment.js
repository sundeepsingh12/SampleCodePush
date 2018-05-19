'use strict'

import * as realm from '../../repositories/realmdb'
import RestAPIFactory from '../../lib/RestAPIFactory'
import { keyValueDBService } from '../classes/KeyValueDBService'
import {
    TABLE_JOB_DATA
} from '../../lib/constants'
import CONFIG from '../../lib/config'

class MosambeeWalletPayment {

    async hitWalletUrlToGetWalletList(walletParameters) {
        const jsonArray = await this.fetchDatafromWalletApi(walletParameters.partnerId, walletParameters.walletURL, null, walletParameters.secretKey)
        let walletList = []
        for (let id in jsonArray) {
            if (_.isEqual(_.toLower(jsonArray[id].status), 'y')) {
                walletList.push({ code: jsonArray[id].code, name: jsonArray[id].name })
            }
        }
        return walletList
    }

    async fetchDatafromWalletApi(partnerId, url, requestData, secretKey) {
        const requestJson = (!requestData) ? JSON.stringify({ apiPassword: secretKey }) : requestData
        const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
        let data = []
        data.push(encodeURIComponent('partnerId') + '=' + encodeURIComponent(partnerId));
        data.push(encodeURIComponent('request') + '=' + encodeURIComponent(requestJson));
        data = data.join("&");
        let walletListResponse = await RestAPIFactory(token.value).serviceCall(data, url, 'WALLET')
        const jsonArray =(walletListResponse)  ? walletListResponse.json : null
        return jsonArray
    }
}

export let MosambeeWalletPaymentServices = new MosambeeWalletPayment()