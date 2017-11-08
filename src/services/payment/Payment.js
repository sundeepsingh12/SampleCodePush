'use strict'

import { fieldAttributeMasterService } from '../classes/FieldAttributeMaster'
import { fieldValidationService } from '../classes/FieldValidation'
import { moduleCustomizationService } from '../classes/ModuleCustomization'
import * as realm from '../../repositories/realmdb'
const {
    ACTUAL_AMOUNT,
    AMOUNT,
    ARRAY,
    ARRAY_SAROJ_FAREYE,
    CASH,
    CHEQUE,
    DECIMAL,
    DEMAND_DRAFT,
    DISCOUNT,
    EZE_TAP,
    FIXED_SKU,
    MODE,
    MONEY_COLLECT,
    MONEY_PAY,
    MOSAMBEE,
    MOSAMBEE_WALLET,
    MPAY,
    M_SWIPE,
    NET_BANKING,
    NET_BANKING_LINK,
    NET_BANKING_CARD_LINK,
    NET_BANKING_UPI_LINK,
    NOT_PAID,
    OBJECT,
    OBJECT_SAROJ_FAREYE,
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
     * This function render payment modes,original amount and actual amount and its validations
     * @param {*} jobMasterId 
     * @param {*} fieldAttributeMasterId 
     * @param {*} jobMasterMoneyTransactionModesList 
     * @param {*} fieldAttributeMasterList 
     * @param {*} formData 
     * @param {*} jobId 
     * @returns
     * {
     *      actualAmount : integer,
     *      isAmountEditable : boolean,
     *      moneyCollectMaster : {
     *                              fieldAttributeMaster,
     *                              childObject : {
     *                                                 fieldAttributeMasterId : fieldAttributeMaster
     *                                            }
     *                           },
     *      originalAmount : integer,
     *      paymentModeList : [
     *                              {
     *                                  id,
     *                                  jobMasterId,
     *                                  moneyTransactionModeId
     *                              }
     *                        ]
     * }
     */
    getPaymentParameters(jobMasterId, fieldAttributeMasterId, jobMasterMoneyTransactionModesList, fieldAttributeMasterList, formData, jobId, jobStatusId, fieldAttributeMasterValidationList, modulesCustomizationList) {
        const fieldAttributeMasterMapWithParentId = fieldAttributeMasterService.getFieldAttributeMasterMapWithParentId(fieldAttributeMasterList)
        const fieldValidationMap = fieldValidationService.getFieldValidationMap(fieldAttributeMasterValidationList)
        const modulesCustomizationMap = moduleCustomizationService.getModuleCustomizationMapForAppModuleId(modulesCustomizationList)
        this.setDisplayNameForPaymentModules(modulesCustomizationMap)
        let moneyCollectMaster = fieldAttributeMasterMapWithParentId[jobMasterId]['root'][fieldAttributeMasterId]
        moneyCollectMaster.childObject = fieldAttributeMasterService.setChildFieldAttributeMaster(fieldAttributeMasterMapWithParentId[jobMasterId][fieldAttributeMasterId], fieldAttributeMasterMapWithParentId[jobMasterId])
        jobMasterMoneyTransactionModesList = jobMasterMoneyTransactionModesList ? jobMasterMoneyTransactionModesList : []
        let paymentModeList = []
        if (moneyCollectMaster.attributeTypeId == MONEY_COLLECT) {
            paymentModeList = jobMasterMoneyTransactionModesList.filter(jobMasterMoneyTransactionMode => jobMasterMoneyTransactionMode.jobMasterId == jobMasterId)
        } else if (moneyCollectMaster.attributeTypeId == MONEY_PAY) {
            paymentModeList.push({
                id: 0,
                moneyTransactionModeId: 1,
                jobMasterId
            })
        }
        let originalAmount = this.getOriginalAmount(moneyCollectMaster, formData, jobId)
        let actualAmount = this.getTotalActualAmount(moneyCollectMaster, formData)
        actualAmount = actualAmount ? actualAmount : originalAmount
        let amountEditableObject = this.actualAmountEditable(moneyCollectMaster, fieldValidationMap, jobStatusId)
        return {
            actualAmount,
            amountEditableObject,
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
                break
            }
        }
        if (originalAmountMaster && originalAmountMaster.jobAttributeMasterId) {
            let jobDataQuery = `jobId = ${jobId} AND jobAttributeMasterId = ${originalAmountMaster.jobAttributeMasterId} AND parentId = 0`
            let jobDataList = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobDataQuery, null, null)
            originalAmount = jobDataList[0] ? parseInt(jobDataList[0].value) : 0
        } else if (originalAmountMaster && originalAmountMaster.fieldAttributeMasterId) {
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
        for (let [fieldAttributeMasterId, formElement] of formData) {
            if (formElement.attributeTypeId == SKU_ARRAY && formElement.sequence < moneyCollectMaster.sequence) {
                actualAmount += this.getActualAmount(formElement.childList, SKU_ACTUAL_AMOUNT)
            }

            if (formElement.attributeTypeId == FIXED_SKU && formElement.sequence < moneyCollectMaster.sequence) {
                actualAmount += this.getActualAmount(formElement.childList, DECIMAL)
            }
        }
        return actualAmount
    }

    /**
     * This function determines min and max value of actual amount if its editable
     * @param {*} moneyCollectMaster 
     * @param {*} validationMap 
     * @param {*} jobStatusId 
     * @returns
     * {
     *      minValue : integer 
     *      maxValue : integer
     * }
     */
    actualAmountEditable(moneyCollectMaster, validationMap, jobStatusId) {
        let actualAmountMaster
        for (let index in moneyCollectMaster.childObject) {
            if (moneyCollectMaster.childObject[index].attributeTypeId == ACTUAL_AMOUNT) {
                actualAmountMaster = moneyCollectMaster.childObject[index]
                break
            }
        }
        let actualAmountValidation = validationMap ? validationMap[actualAmountMaster.id] ? validationMap[actualAmountMaster.id][0] : null : null
        if (!actualAmountValidation) {
            return null
        }
        let rightKey = actualAmountValidation.rightKey ? actualAmountValidation.rightKey.split(',') : []
        if (rightKey.includes('' + jobStatusId)) {
            let leftKey = actualAmountValidation.leftKey.split('||')
            let minValueList = leftKey[0].split(',')
            let maxValueList = leftKey[1].split(',')
            return (
                {
                    minValue: parseInt(minValueList[1]),
                    maxValue: parseInt(maxValueList[1]),
                }
            )
        }
        return null
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

    /**
     * This function prepares childFieldDataListDTO for moneycollect
     * @param {*} actualAmount 
     * @param {*} fieldAttributeMaster 
     * @param {*} originalAmount 
     * @param {*} selectedIndex 
     * @param {*} transactionNumber 
     * @param {*} remarks 
     * @param {*} receipt
     * @returns
     *  
     */
    prepareMoneyCollectChildFieldDataListDTO(actualAmount, fieldAttributeMaster, originalAmount, selectedIndex, transactionNumber, remarks, receipt) {
        //TODO : change key to attribute type for details object
        let moneyCollectFieldDataChildList = []
        for (let index in fieldAttributeMaster.childObject) {
            if (fieldAttributeMaster.childObject[index].attributeTypeId == ORIGINAL_AMOUNT) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId, fieldAttributeMaster.childObject[index].id, originalAmount))
            } else if (fieldAttributeMaster.childObject[index].attributeTypeId == ACTUAL_AMOUNT) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId, fieldAttributeMaster.childObject[index].id, actualAmount))
            } else if (fieldAttributeMaster.childObject[index].childObject) {
                let detailsData = {}
                detailsData.attributeTypeId = fieldAttributeMaster.childObject[index].attributeTypeId
                detailsData.fieldAttributeMasterId = fieldAttributeMaster.childObject[index].id
                detailsData.value = fieldAttributeMaster.childObject[index].attributeTypeId == ARRAY ? ARRAY_SAROJ_FAREYE : fieldAttributeMaster.childObject[index].attributeTypeId == OBJECT ? OBJECT_SAROJ_FAREYE : null
                detailsData.childDataList = this.prepareMoneyCollectChildFieldDataListDTO(actualAmount, fieldAttributeMaster.childObject[index], originalAmount, selectedIndex, transactionNumber, remarks, receipt)
                moneyCollectFieldDataChildList.push(detailsData)
            } else if (fieldAttributeMaster.childObject[index].key.toLocaleLowerCase() == MODE) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId, fieldAttributeMaster.childObject[index].id, this.getModeTypeFromModeTypeId(selectedIndex)))
            } else if (fieldAttributeMaster.childObject[index].key.toLocaleLowerCase() == TRANSACTION_NUMBER) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId, fieldAttributeMaster.childObject[index].id, transactionNumber))
            } else if (fieldAttributeMaster.childObject[index].key.toLocaleLowerCase() == AMOUNT) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId, fieldAttributeMaster.childObject[index].id, actualAmount))
            } else if (fieldAttributeMaster.childObject[index].key.toLocaleLowerCase() == RECEIPT) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId, fieldAttributeMaster.childObject[index].id, receipt))
            } else if (fieldAttributeMaster.childObject[index].key.toLocaleLowerCase() == REMARKS) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId, fieldAttributeMaster.childObject[index].id, remarks))
            }
        }
        return moneyCollectFieldDataChildList
    }

    /**
     * This function set field data values in object
     * @param {*} attributeTypeId 
     * @param {*} fieldAttributeMasterId 
     * @param {*} value 
     * @returns
     * {
     *      attributeTypeId,
     *      fieldAttributeMasterId,
     *      value
     * }
     */
    setFieldDataKeysAndValues(attributeTypeId, fieldAttributeMasterId, value) {
        return (
            {
                attributeTypeId,
                fieldAttributeMasterId,
                value
            }
        )
    }

    /**
     * 
     * @param {*} modeTypeId 
     */
    getModeTypeFromModeTypeId(modeTypeId) {
        switch (modeTypeId) {
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

    /**
     * 
     * @param {*} modeTypeId 
     */
    checkCardPayment(modeTypeId) {
        switch (modeTypeId) {
            case EZE_TAP.id:
            case MOSAMBEE.id:
            case MOSAMBEE_WALLET.id:
            case MPAY.id:
            case M_SWIPE.id:
            case NET_BANKING.id:
            case NET_BANKING_LINK.id:
            case NET_BANKING_CARD_LINK.id:
            case NET_BANKING_UPI_LINK.id:
            case PAYNEAR.id:
            case PAYO.id:
            case PAYNEAR.id:
            case RAZOR_PAY.id:
            case UPI.id: return true
            default: return false
        }
    }

    /**
     * This function set display name for card type payments
     * @param {*} modulesCustomizationMap 
     */
    setDisplayNameForPaymentModules(modulesCustomizationMap) {
        EZE_TAP.displayName = modulesCustomizationMap[EZE_TAP.appModuleId] ? modulesCustomizationMap[EZE_TAP.appModuleId].displayName ? modulesCustomizationMap[EZE_TAP.appModuleId].displayName : EZE_TAP.displayName : EZE_TAP.displayName
        MOSAMBEE.displayName = modulesCustomizationMap[MOSAMBEE.appModuleId] ? modulesCustomizationMap[MOSAMBEE.appModuleId].displayName ? modulesCustomizationMap[MOSAMBEE.appModuleId].displayName : MOSAMBEE.displayName : MOSAMBEE.displayName
        MOSAMBEE_WALLET.displayName = modulesCustomizationMap[MOSAMBEE_WALLET.appModuleId] ? modulesCustomizationMap[MOSAMBEE_WALLET.appModuleId].displayName ? modulesCustomizationMap[MOSAMBEE_WALLET.appModuleId].displayName : MOSAMBEE_WALLET.displayName : MOSAMBEE_WALLET.displayName
        MPAY.displayName = modulesCustomizationMap[MPAY.appModuleId] ? modulesCustomizationMap[MPAY.appModuleId].displayName ? modulesCustomizationMap[MPAY.appModuleId].displayName : MPAY.displayName : MPAY.displayName
        M_SWIPE.displayName = modulesCustomizationMap[M_SWIPE.appModuleId] ? modulesCustomizationMap[M_SWIPE.appModuleId].displayName ? modulesCustomizationMap[M_SWIPE.appModuleId].displayName : M_SWIPE.displayName : M_SWIPE.displayName
        NET_BANKING.displayName = modulesCustomizationMap[NET_BANKING.appModuleId] ? modulesCustomizationMap[NET_BANKING.appModuleId].displayName ? modulesCustomizationMap[NET_BANKING.appModuleId].displayName : NET_BANKING.displayName : NET_BANKING.displayName
        this.setNetBankingTypeDisplayName(modulesCustomizationMap[NET_BANKING.appModuleId])
        PAYNEAR.displayName = modulesCustomizationMap[PAYNEAR.appModuleId] ? modulesCustomizationMap[PAYNEAR.appModuleId].displayName ? modulesCustomizationMap[PAYNEAR.appModuleId].displayName : PAYNEAR.displayName : PAYNEAR.displayName
        RAZOR_PAY.displayName = modulesCustomizationMap[RAZOR_PAY.appModuleId] ? modulesCustomizationMap[RAZOR_PAY.appModuleId].displayName ? modulesCustomizationMap[RAZOR_PAY.appModuleId].displayName : RAZOR_PAY.displayName : RAZOR_PAY.displayName
        UPI.displayName = modulesCustomizationMap[UPI.appModuleId] ? modulesCustomizationMap[UPI.appModuleId].displayName ? modulesCustomizationMap[UPI.appModuleId].displayName : UPI.displayName : UPI.displayName
    }

    /**
     * This function set display name for net banking types
     * @param {*} modulesCustomization 
     */
    setNetBankingTypeDisplayName(modulesCustomization) {
        let remarks = modulesCustomization ? JSON.parse(modulesCustomization.remark) : null
        NET_BANKING_LINK.displayName = remarks ? remarks.netBankingCustomName ? remarks.netBankingCustomName : NET_BANKING_LINK.displayName : NET_BANKING_LINK.displayName
        NET_BANKING_CARD_LINK.displayName = remarks ? remarks.cardCustomName ? remarks.cardCustomName : NET_BANKING_CARD_LINK.displayName : NET_BANKING_CARD_LINK.displayName
        NET_BANKING_UPI_LINK.displayName = remarks ? remarks.upiCustomName ? remarks.upiCustomName : NET_BANKING_UPI_LINK.displayName : NET_BANKING_UPI_LINK.displayName
    }

}

export let paymentService = new Payment()