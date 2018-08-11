'use strict'

import * as realm from '../../repositories/realmdb'
import {keyValueDBService} from '../classes/KeyValueDBService'
import RestAPIFactory from '../../lib/RestAPIFactory'
import jsSha512 from 'js-sha512'
import CONFIG from '../../lib/config'
 

class PayByLinkPayment {

    async prepareJsonAndHitPayByLinkUrl(payByLinkConfigJSON, customerContact, id) {
        let typeSwitchMode = {97 : '1', 98 : '2', 99 : '3'}, requestMessage, data = []
        let requestBody = payByLinkConfigJSON.mosambeeUsername + String(payByLinkConfigJSON.actualAmount * 100) + customerContact + payByLinkConfigJSON.referenceNoActualAmountMap + typeSwitchMode[id]  
        if(typeSwitchMode[id] == '3' && payByLinkConfigJSON.enableVpa) requestBody += 'payerAddress'
        const checkSum = jsSha512.update(requestBody + payByLinkConfigJSON.secretKey)
        if(typeSwitchMode[id] == '3' && payByLinkConfigJSON.enableVpa){
           requestMessage = payByLinkConfigJSON.mosambeeUsername + '~' + String(payByLinkConfigJSON.actualAmount * 100) + '~' + customerContact + '~' + payByLinkConfigJSON.referenceNoActualAmountMap + '~' + typeSwitchMode[id] + '~' + 'payerAddress' + '~' + checkSum;
        }else{
           requestMessage = payByLinkConfigJSON.mosambeeUsername + '~' + String(payByLinkConfigJSON.actualAmount * 100) + '~' + customerContact + '~' + payByLinkConfigJSON.referenceNoActualAmountMap + '~' + typeSwitchMode[id] + '~'  + checkSum;
        }
        data.push(encodeURIComponent('requestMessage') + '=' + encodeURIComponent(requestMessage));
        data = data.join("&");
        const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
        let payByLinkResponse = await RestAPIFactory(token.value).serviceCall(data, payByLinkConfigJSON.netBankingURL, 'WALLET')
        const jsonArray = (payByLinkResponse) ? payByLinkResponse.json : null
        return jsonArray
    }
    
}

export let payByLinkPaymentService = new PayByLinkPayment()