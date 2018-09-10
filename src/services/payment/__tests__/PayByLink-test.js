'use strict'
import {
    keyValueDBService,
} from '../../classes/KeyValueDBService'
import { payByLinkPaymentService } from '../PayByLinkPayment'
import  RestAPIFactory  from '../../../lib/RestAPIFactory'
import jsSha512 from 'js-sha512'

describe('test cases of payByLink', () => {
    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
        jsSha512.update = jest.fn()
        RestAPIFactory().serviceCall = jest.fn()
    })
    it('it should prepare JSON and hit payByLink Api', () => {
        const payByLinkConfigJSON = {
            mosambeeUsername : '123234234',
            actualAmount : 43,
            referenceNoActualAmountMap : {
                233443 : 12,
                324344 : 31
            },
            enableVpa : false,
            apiPassword : '32421435453',
            netBankingURL : 'http://www.google.com'
        }
        jsSha512.update.mockReturnValueOnce('65ycwd723c723648')
        keyValueDBService.getValueFromStore.mockReturnValueOnce({value : '324sd3124'})
        RestAPIFactory().serviceCall.mockReturnValueOnce({json : { status : 'success'}})
       
        payByLinkPaymentService.prepareJsonAndHitPayByLinkUrl(payByLinkConfigJSON, 243244, 97).then((result) => {
        expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
        expect(jsSha512.update).toHaveBeenCalled()
        expect(RestAPIFactory().serviceCall).toHaveBeenCalled()
        expect(result).toEqual(null)
        })

    })
})