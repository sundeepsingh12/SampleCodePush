'use strict'

import { fieldAttributeMasterService } from './FieldAttributeMaster'
import * as realm from '../../repositories/realmdb'
const {
    ACTUAL_AMOUNT,
    AMOUNT,
    ARRAY,
    ARRAYSAROJFAREYE,
    CASH,
    CHEQUE,
    DECIMAL,
    DEMAND_DRAFT,
    DISCOUNT,
    EZE_TAP,
    FIXED_SKU,
    MODE,
    MOSAMBEE,
    MOSAMBEE_WALLET,
    MPAY,
    M_SWIPE,
    NET_BANKING,
    NOT_PAID,
    OBJECT,
    OBJECTSAROJFAREYE,
    ORIGINAL_AMOUNT,
    PAYNEAR,
    PAYO,
    PAYTM,
    POS,
    RAZOR_PAY,
    RECEIPT,
    REMARKS,
    SODEXO,
    SKU_ARRAY,
    SKU_ACTUAL_AMOUNT,
    SPLIT,
    TICKET_RESTAURANT,
    TRANSACTION_NUMBER,
    UPI,
} = require('../../lib/AttributeConstants')

const {
    TABLE_JOB_DATA,
} = require('../../lib/constants').default

class Payment {

    /**
     * 
     * @param {*} jobMasterId 
     * @param {*} jobMasterMoneyTransactionModesList 
     * @returns
     * paymentModeList : [jobMasterMoneyTransactionMode]
     */
    getPaymentParameters(jobMasterId, fieldAttributeMasterId, jobMasterMoneyTransactionModesList, fieldAttributeMasterList, formData, jobId) {
        // TODO : remove harcoded fieldAttributeMasterId
        fieldAttributeMasterId = 22843
        jobMasterMoneyTransactionModesList = jobMasterMoneyTransactionModesList ? jobMasterMoneyTransactionModesList : []
        const paymentModeList = jobMasterMoneyTransactionModesList.filter(jobMasterMoneyTransactionMode => jobMasterMoneyTransactionMode.jobMasterId == jobMasterId)
        const fieldAttributeMasterMapWithParentId = fieldAttributeMasterService.getFieldAttributeMasterMapWithParentId(fieldAttributeMasterList)
        let moneyCollectMaster = fieldAttributeMasterMapWithParentId[jobMasterId]['root'][fieldAttributeMasterId]
        moneyCollectMaster.childObject = fieldAttributeMasterService.setChildFieldAttributeMaster(fieldAttributeMasterMapWithParentId[jobMasterId][fieldAttributeMasterId], fieldAttributeMasterMapWithParentId[jobMasterId])
        let originalAmount = this.getOriginalAmount(moneyCollectMaster, formData, jobId)
        let actualAmount = this.getTotalActualAmount(moneyCollectMaster, formData)
        actualAmount = actualAmount ? actualAmount : originalAmount
        let isAmountEditable = actualAmount ? false : true
        return {
            actualAmount,
            isAmountEditable,
            moneyCollectMaster,
            originalAmount,
            paymentModeList,
        }
    }

    /**
     * This function returns original amount if mapped with job or field attribute
     * @param {*} moneyCollectMaster 
     * @param {*} formData 
     * @param {*} jobId 
     * @returns 
     * originalAmount : integer
     */
    getOriginalAmount(moneyCollectMaster, formData, jobId) {
        let originalAmountMaster, originalAmount
        for (let index in moneyCollectMaster.childObject) {
            if (moneyCollectMaster.childObject[index].attributeTypeId == ORIGINAL_AMOUNT) {
                originalAmountMaster = moneyCollectMaster.childObject[index]
            }
        }
        if (originalAmountMaster.jobAttributeMasterId) {
            let jobDataQuery = `jobId = ${jobId} AND jobAttributeMasterId = ${originalAmountMaster.jobAttributeMasterId} AND parentId = 0`
            let jobDataList = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobDataQuery, null, null)
            originalAmount = jobDataList[0] ? jobDataList[0].value : null
        } else if (originalAmountMaster.fieldAttributeMasterId) {
            originalAmount = formData[originalAmountMaster.fieldAttributeMasterId].value
        }
        return originalAmount
    }

    /**
     * This function returns total actual amount from sku and fixed sku
     * @param {*} moneyCollectMaster 
     * @param {*} formData 
     * @returns
     * totalActualAmount : integer
     */
    getTotalActualAmount(moneyCollectMaster, formData) {
        let actualAmount
        for (let index in formData) {
            if (formData[index].attributeTypeId == SKU_ARRAY && formData[index].sequence < moneyCollectMaster.sequence) {
                actualAmount += this.getActualAmount(formData[index].childList, SKU_ACTUAL_AMOUNT)
            }

            if (formData[index].attributeTypeId == FIXED_SKU && formData[index].sequence < moneyCollectMaster.sequence) {
                actualAmount += this.getActualAmount(formData[index].childList, DECIMAL)
            }
        }
        return actualAmount
    }

    /**
     * This function returns actual amount of attribute based on its childList and property
     * @param {*} childList 
     * @param {*} property 
     * @returns
     * actualAmount : integer
     */
    getActualAmount(childList, property) {
        for (let index in childList) {
            if (childList[index].attributeTypeId == property) {
                return childList[index].value
            }
        }
        return 0
    }

    prepareMoneyCollectChildFieldDataListDTO(actualAmount, fieldAttributeMaster, originalAmount, selectedIndex, transactionNumber, remarks, receipt) {
        //TODO : change key to attribute type for details object
        let moneyCollectFieldDataChildList = []
        for (let index in fieldAttributeMaster.childObject) {
            if (fieldAttributeMaster.childObject[index].attributeTypeId == ORIGINAL_AMOUNT) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId,fieldAttributeMaster.childObject[index].id,originalAmount))
            } else if (fieldAttributeMaster.childObject[index].attributeTypeId == ACTUAL_AMOUNT) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId,fieldAttributeMaster.childObject[index].id,actualAmount))
            } else if (fieldAttributeMaster.childObject[index].childObject) {
                let detailsData = {}
                detailsData.fieldAttributeMasterId = fieldAttributeMaster.childObject[index].id
                detailsData.value = fieldAttributeMaster.childObject[index].attributeTypeId == ARRAY ? ARRAYSAROJFAREYE : fieldAttributeMaster.childObject[index].attributeTypeId == OBJECT ? OBJECTSAROJFAREYE : null
                detailsData.childDataList = this.prepareMoneyCollectChildFieldDataListDTO(actualAmount, fieldAttributeMaster.childObject[index], originalAmount, selectedIndex, transactionNumber, remarks, receipt)
                moneyCollectFieldDataChildList.push(detailsData)
            } else if (fieldAttributeMaster.childObject[index].key.toLocaleLowerCase() == MODE) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId,fieldAttributeMaster.childObject[index].id,this.getModeTypeFromModeTypeId(selectedIndex)))
            } else if (fieldAttributeMaster.childObject[index].key.toLocaleLowerCase() == TRANSACTION_NUMBER) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId,fieldAttributeMaster.childObject[index].id,transactionNumber))
            } else if (fieldAttributeMaster.childObject[index].key.toLocaleLowerCase() == AMOUNT) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId,fieldAttributeMaster.childObject[index].id,actualAmount))
            } else if (fieldAttributeMaster.childObject[index].key.toLocaleLowerCase() == RECEIPT) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId,fieldAttributeMaster.childObject[index].id,receipt))
            } else if (fieldAttributeMaster.childObject[index].key.toLocaleLowerCase() == REMARKS) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId,fieldAttributeMaster.childObject[index].id,remarks))
            }
        }
        return moneyCollectFieldDataChildList
    }

    setFieldDataKeysAndValues(attributeTypeId,fieldAttributeMasterId,value) {
        return(
            {
                attributeTypeId,
                fieldAttributeMasterId,
                value
            }
        )
    }

    getModeTypeFromModeTypeId(modeTypeId) {
        switch(modeTypeId) {
            case CASH.id: return CASH.modeType
            case CHEQUE.id: return CHEQUE.modeType
            case DEMAND_DRAFT.id: return DEMAND_DRAFT.modeType
            case DISCOUNT.id: return DISCOUNT.modeType
            case EZE_TAP.id: return EZE_TAP.modeType
            case MOSAMBEE.id: return MOSAMBEE.modeType
            case MOSAMBEE_WALLET.id: return MOSAMBEE_WALLET.modeType
            case MPAY.id: return MPAY.modeType
            case M_SWIPE.id: return M_SWIPE.modeType
            case NET_BANKING.id: return NET_BANKING.modeType
            case NOT_PAID.id: return NOT_PAID.modeType
            case PAYNEAR.id: return PAYNEAR.modeType
            case PAYO.id: return PAYO.modeType
            case PAYTM.id: return PAYTM.modeType
            case POS.id: return POS.modeType
            case RAZOR_PAY.id: return RAZOR_PAY.modeType
            case SODEXO.id: return SODEXO.modeType
            case SPLIT.id: return SPLIT.modeType
            case TICKET_RESTAURANT.id: return TICKET_RESTAURANT.modeType
            case UPI.id: return UPI.modeType
        }
    }

}

export let paymentService = new Payment()