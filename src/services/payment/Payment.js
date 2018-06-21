'use strict'

import { fieldAttributeMasterService } from '../classes/FieldAttributeMaster'
import { fieldValidationService } from '../classes/FieldValidation'
import { moduleCustomizationService } from '../classes/ModuleCustomization'
import * as realm from '../../repositories/realmdb'
import {
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
} from '../../lib/AttributeConstants'

import {
    TABLE_JOB_DATA,
} from '../../lib/constants'
import {
    SPLIT_AMOUNT_ERROR,
    INVALID_CONFIGURATION
} from '../../lib/ContainerConstants'

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
    getPaymentParameters(jobTransaction, fieldAttributeMasterId, jobMasterMoneyTransactionModesList, fieldAttributeMasterList, formData, jobStatusId, fieldAttributeMasterValidationList, modulesCustomizationList) {
        let jobMasterId
        const fieldAttributeMasterMapWithParentId = fieldAttributeMasterService.getFieldAttributeMasterMapWithParentId(fieldAttributeMasterList)
        const fieldValidationMap = fieldValidationService.getFieldValidationMap(fieldAttributeMasterValidationList)
        const modulesCustomizationMap = moduleCustomizationService.getModuleCustomizationMapForAppModuleId(modulesCustomizationList)
        this.setDisplayNameForPaymentModules(modulesCustomizationMap)
        if (jobTransaction.length) {
            jobMasterId = jobTransaction[0].jobMasterId
        } else {
            jobMasterId = jobTransaction.jobMasterId
        }
        let moneyCollectMaster = fieldAttributeMasterMapWithParentId[jobMasterId]['root'][fieldAttributeMasterId]
        moneyCollectMaster.childObject = fieldAttributeMasterService.setChildFieldAttributeMaster(fieldAttributeMasterMapWithParentId[jobMasterId][fieldAttributeMasterId], fieldAttributeMasterMapWithParentId[jobMasterId])
        let paymentModeList = {}
        let splitPaymentMode = false
        if (moneyCollectMaster.attributeTypeId == MONEY_COLLECT) {
            //Getting payment mode list for this job master
            let paymentModeListObject = this.getPaymentModeList(jobMasterMoneyTransactionModesList, jobMasterId)
            paymentModeList = paymentModeListObject.paymentModeList
            splitPaymentMode = paymentModeListObject.splitPaymentMode
        } else if (moneyCollectMaster.attributeTypeId == MONEY_PAY) {
            //Adding cah payment mode to payment mode list for money pay as money pay has only one payment mode
            paymentModeList.otherPaymentModeList = []
            paymentModeList.otherPaymentModeList.push({
                id: 0,
                moneyTransactionModeId: 1,
                jobMasterId
            })
        }
        let originalAmountObject = this.getOriginalAmount(moneyCollectMaster, formData, jobTransaction)
        let actualAmount = this.getTotalActualAmount(moneyCollectMaster, formData)
        actualAmount = actualAmount ? actualAmount : originalAmountObject.originalAmount
        let amountEditableObject = this.actualAmountEditable(moneyCollectMaster, fieldValidationMap, jobStatusId)
        return {
            actualAmount,
            amountEditableObject,
            moneyCollectMaster,
            originalAmount: originalAmountObject.originalAmount,
            paymentModeList,
            splitPaymentMode,
            jobTransactionIdAmountMap: originalAmountObject.jobTransactionIdAmountMap
        }
    }

    /**
     * This function prepares payment mode list and check if split payment mode is active
     * @param {*} jobMasterMoneyTransactionModesList 
     * @param {*} jobMasterId 
     * @returns
     * paymentModeList : {
     *                      endPaymentModeList
     *                      otherPaymentModeList
     *                   }
     * splitPaymentMode : boolean
     */
    getPaymentModeList(jobMasterMoneyTransactionModesList, jobMasterId) {
        let paymentModeList = {
            endPaymentModeList: [],
            otherPaymentModeList: [],
        }
        let splitPaymentMode = false
        for (let index in jobMasterMoneyTransactionModesList) {
            //Checking jobMasterId of money transaction mode list
            if (jobMasterMoneyTransactionModesList[index].jobMasterId != jobMasterId) {
                continue
            }
            //Checking if money transaction mode is split
            if (jobMasterMoneyTransactionModesList[index].moneyTransactionModeId == SPLIT.id) {
                splitPaymentMode = true
                continue
            }
            //Checking if money transaction mode is of card type
            if (this.checkCardPayment(jobMasterMoneyTransactionModesList[index].moneyTransactionModeId)) {
                paymentModeList.endPaymentModeList.push(jobMasterMoneyTransactionModesList[index])
            } else {
                paymentModeList.otherPaymentModeList.push(jobMasterMoneyTransactionModesList[index])
            }
        }
        return {
            paymentModeList,
            splitPaymentMode
        }
    }

    /**
     * This function returns original amount if mapped with job or field attribute
     * @param {*} moneyCollectMaster 
     * @param {*} formData 
     * @param {*} jobId 
     * @returns 
     * {
     *      originalAmount : integer
     *      jobTransactionIdAmountMap(for bulk): {
     *                                     jobTransactionId :  {
     *                                                              originalAmount
     *                                                              actualAmount
     *                                                         }
     *                                 }
     * }
     */
    getOriginalAmount(moneyCollectMaster, formData, jobTransaction) {
        let originalAmountMaster, originalAmount, jobIdJobTransactionMap = {}, totalAmount = 0, jobTransactionIdAmountMap = {}
        for (let index in moneyCollectMaster.childObject) {
            if (moneyCollectMaster.childObject[index].attributeTypeId == ORIGINAL_AMOUNT) {
                originalAmountMaster = moneyCollectMaster.childObject[index]
                break
            }
        }

        //If original amount is mapped with job attribute
        if (originalAmountMaster && originalAmountMaster.jobAttributeMasterId) {
            let jobDataQuery = null
            if (jobTransaction.length) { // Is multiple job transaction ie case of bulk
                let jobQuery = ''
                for (let jobTransactionIndex in jobTransaction) {
                    if (jobTransactionIndex == 0) {
                        jobQuery += `jobId = ${jobTransaction[jobTransactionIndex].jobId}`
                    } else {
                        jobQuery += ` OR jobId = ${jobTransaction[jobTransactionIndex].jobId}`
                    }
                    jobIdJobTransactionMap[jobTransaction[jobTransactionIndex].jobId] = jobTransaction[jobTransactionIndex]
                }
                jobDataQuery = `(${jobQuery}) AND jobAttributeMasterId = ${originalAmountMaster.jobAttributeMasterId} AND parentId = 0`
            } else {
                jobDataQuery = `jobId = ${jobTransaction.jobId} AND jobAttributeMasterId = ${originalAmountMaster.jobAttributeMasterId} AND parentId = 0`
                jobTransactionIdAmountMap = null
            }
            let jobDataList = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobDataQuery, null, null)
            for (let jobDataIndex in jobDataList) {
                let jobAmount = parseFloat(jobDataList[jobDataIndex].value)
                totalAmount += (jobAmount ? jobAmount : 0)
                if (jobTransactionIdAmountMap) {
                    let amountMap = {
                        originalAmount: jobAmount ? jobAmount : 0,
                        actualAmount: jobAmount ? jobAmount : 0,
                    }
                    jobTransactionIdAmountMap[jobIdJobTransactionMap[jobDataList[jobDataIndex].jobId].jobTransactionId] = amountMap
                }
            }
            originalAmount = totalAmount + ''
        } else if (originalAmountMaster && originalAmountMaster.fieldAttributeMasterId) { //If original amount is mapped with field attribute
            originalAmount = formData[originalAmountMaster.fieldAttributeMasterId] ? formData[originalAmountMaster.fieldAttributeMasterId].value : null
            jobTransactionIdAmountMap = null
        } else if (jobTransaction.length) { // If case of bulk and money collect if not mapped
            throw new Error(INVALID_CONFIGURATION)
        } else {
            jobTransactionIdAmountMap = null
        }
        return {
            originalAmount,
            jobTransactionIdAmountMap
        }
    }

    /**
     * This function returns total actual amount from sku and fixed sku
     * @param {*} moneyCollectMaster 
     * @param {*} formData 
     * @returns
     * totalActualAmount : integer
     */
    getTotalActualAmount(moneyCollectMaster, formData) {
        let actualAmount = 0
        for (let formElement in formData) {
            // Check if sku present in form element and its sequence is before money collect
            if (formData[formElement].attributeTypeId == SKU_ARRAY && formData[formElement].positionId < formData[moneyCollectMaster.id].positionId) {
                actualAmount += this.getActualAmount(formData[formElement], SKU_ACTUAL_AMOUNT)
            }

            // Check if fixed sku present in form element and its sequence is before money collect
            if (formData[formElement].attributeTypeId == FIXED_SKU && formData[formElement].positionId < formData[moneyCollectMaster.id].positionId) {
                actualAmount += this.getActualAmount(formData[formElement], DECIMAL)
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
        if (rightKey.includes('' + jobStatusId)) { // Checking if actual amount validation contains this statusId on which job is updated
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
    getActualAmount(formElement, property) {
        let childList = formElement.childDataList
        for (let index in childList) {
            //Get value for property given
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
     * @param {*} selectedPaymentMode 
     * @param {*} transactionNumber 
     * @param {*} remarks 
     * @param {*} receipt
     * @returns
     * moneyCollectFieldDataChildList : [
     *                                      {
     *                                         attributeTypeId
     *                                         fieldAttributeMasterId
     *                                         value
     *                                         key
     *                                         childDataList : [
     *                                                              moneyCollectFieldDataChildList
     *                                                         ]
     *                                      }
     *                                  ]
     */
    prepareMoneyCollectChildFieldDataListDTO(actualAmount, fieldAttributeMaster, originalAmount, selectedPaymentMode, transactionNumber, remarks, receipt) {
        //TODO : change key to attribute type for details object
        let moneyCollectFieldDataChildList = []
        for (let index in fieldAttributeMaster.childObject) {
            if (fieldAttributeMaster.childObject[index].attributeTypeId == ORIGINAL_AMOUNT) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId, fieldAttributeMaster.childObject[index].id, originalAmount ? originalAmount : 0, fieldAttributeMaster.childObject[index].key))
            } else if (fieldAttributeMaster.childObject[index].attributeTypeId == ACTUAL_AMOUNT) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId, fieldAttributeMaster.childObject[index].id, actualAmount, fieldAttributeMaster.childObject[index].key))
            } else if (fieldAttributeMaster.childObject[index].childObject) {
                let detailsData = {}
                detailsData.attributeTypeId = fieldAttributeMaster.childObject[index].attributeTypeId
                detailsData.key = fieldAttributeMaster.childObject[index].key
                detailsData.fieldAttributeMasterId = fieldAttributeMaster.childObject[index].id
                detailsData.value = fieldAttributeMaster.childObject[index].attributeTypeId == ARRAY ? ARRAY_SAROJ_FAREYE : fieldAttributeMaster.childObject[index].attributeTypeId == OBJECT ? OBJECT_SAROJ_FAREYE : null
                detailsData.childDataList = this.prepareMoneyCollectChildFieldDataListDTO(actualAmount, fieldAttributeMaster.childObject[index], originalAmount, selectedPaymentMode, transactionNumber, remarks, receipt)
                moneyCollectFieldDataChildList.push(detailsData)
            } else if (fieldAttributeMaster.childObject[index].key.toLocaleLowerCase() == MODE) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId, fieldAttributeMaster.childObject[index].id, this.getModeTypeFromModeTypeId(selectedPaymentMode), fieldAttributeMaster.childObject[index].key))
            } else if (fieldAttributeMaster.childObject[index].key.toLocaleLowerCase() == TRANSACTION_NUMBER) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId, fieldAttributeMaster.childObject[index].id, transactionNumber ? transactionNumber : 'NA', fieldAttributeMaster.childObject[index].key))
            } else if (fieldAttributeMaster.childObject[index].key.toLocaleLowerCase() == AMOUNT) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId, fieldAttributeMaster.childObject[index].id, actualAmount, fieldAttributeMaster.childObject[index].key))
            } else if (fieldAttributeMaster.childObject[index].key.toLocaleLowerCase() == RECEIPT) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId, fieldAttributeMaster.childObject[index].id, receipt ? receipt : 'NA', fieldAttributeMaster.childObject[index].key))
            } else if (fieldAttributeMaster.childObject[index].key.toLocaleLowerCase() == REMARKS) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId, fieldAttributeMaster.childObject[index].id, remarks ? remarks : 'NA', fieldAttributeMaster.childObject[index].key))
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
    setFieldDataKeysAndValues(attributeTypeId, fieldAttributeMasterId, value, key) {
        return (
            {
                attributeTypeId,
                fieldAttributeMasterId,
                value,
                key
            }
        )
    }

    /**
     * This function return s mode type for corresponding payment mode id
     * @param {*} modeTypeId 
     * @return 
     * string
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
     * This function check payment mode is of card type
     * @param {*} modeTypeId 
     * @returns
     * boolean
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
            case PAYTM.id:
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

    /**
     * This function prepares splitPaymentModeMap for selected payment modes
     * @param {*} selectedPaymentMode 
     * @returns
     * splitPaymentModeMap : {
     *                          modeTypeId : {
     *                                          modeTypeId,
     *                                          amount,
     *                                          list(in case of cheque or dd): [
     *                                              {
     *                                                  modeTypeId,
     *                                                  amount
     *                                              }
     *                                          ]
     *                                       }
     *                       }
     */
    prepareSplitPaymentModeList(selectedPaymentMode) {
        let splitPaymentModeMap = {}
        for (let index in selectedPaymentMode.otherPaymentModeList) {
            //Check if payment mode is selected in case of split
            if (!selectedPaymentMode.otherPaymentModeList[index]) {
                continue
            }
            if (index == CHEQUE.id || index == DEMAND_DRAFT.id) {
                splitPaymentModeMap[index] = {
                    list: [
                        {
                            modeTypeId: index,
                            amount: null
                        }
                    ],
                    amount: 0
                }
            } else {
                splitPaymentModeMap[index] = {
                    modeTypeId: index,
                    amount: null
                }
            }
        }
        //To set split mode for card type
        if (selectedPaymentMode.cardPaymentMode) {
            splitPaymentModeMap[selectedPaymentMode.cardPaymentMode] = {
                modeTypeId: selectedPaymentMode.cardPaymentMode,
                amount: null
            }
        }
        return splitPaymentModeMap
    }

    /**
     * This function prepares childFieldDataListDTO for moneycollect in split payment mode
     * @param {*} actualAmount 
     * @param {*} fieldAttributeMaster 
     * @param {*} originalAmount 
     * @param {*} splitPaymentModeMap 
     * @returns
     * moneyCollectFieldDataChildList : [
     *                                      {
     *                                         attributeTypeId
     *                                         fieldAttributeMasterId
     *                                         value
     *                                         key
     *                                         childDataList : [
     *                                                              moneyCollectFieldDataChildList
     *                                                         ]
     *                                      }
     *                                  ]
     */
    prepareMoneyCollectChildFieldDataListDTOForSplit(actualAmount, fieldAttributeMaster, originalAmount, splitPaymentModeMap) {
        let moneyCollectFieldDataChildList = []
        for (let index in fieldAttributeMaster.childObject) {
            if (fieldAttributeMaster.childObject[index].attributeTypeId == ORIGINAL_AMOUNT) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId, fieldAttributeMaster.childObject[index].id, originalAmount, fieldAttributeMaster.childObject[index].key))
            } else if (fieldAttributeMaster.childObject[index].attributeTypeId == ACTUAL_AMOUNT) {
                moneyCollectFieldDataChildList.push(this.setFieldDataKeysAndValues(fieldAttributeMaster.childObject[index].attributeTypeId, fieldAttributeMaster.childObject[index].id, actualAmount, fieldAttributeMaster.childObject[index].key))
            } else if (fieldAttributeMaster.childObject[index].childObject) { // Check if field attribute has child
                let detailsData = {}
                detailsData.attributeTypeId = fieldAttributeMaster.childObject[index].attributeTypeId
                detailsData.fieldAttributeMasterId = fieldAttributeMaster.childObject[index].id
                detailsData.value = fieldAttributeMaster.childObject[index].attributeTypeId == ARRAY ? ARRAY_SAROJ_FAREYE : fieldAttributeMaster.childObject[index].attributeTypeId == OBJECT ? OBJECT_SAROJ_FAREYE : null
                detailsData.childDataList = []
                for (let paymentMode in splitPaymentModeMap) {
                    let childDataList = null
                    if (this.checkCardPayment(parseInt(paymentMode))) {
                        continue
                    }
                    if (parseInt(paymentMode) == CHEQUE.id || parseInt(paymentMode) == DEMAND_DRAFT.id) {
                        let paymentList = splitPaymentModeMap[paymentMode].list
                        for (let paymentObject in paymentList) {
                            childDataList = this.prepareMoneyCollectChildFieldDataListDTO(paymentList[paymentObject].amount, fieldAttributeMaster.childObject[index], originalAmount, parseInt(paymentMode), paymentList[paymentObject].transactionNumber, null, null)
                            detailsData.childDataList = detailsData.childDataList.concat(childDataList)
                        }
                    } else {
                        childDataList = this.prepareMoneyCollectChildFieldDataListDTO(splitPaymentModeMap[paymentMode].amount, fieldAttributeMaster.childObject[index], originalAmount, parseInt(paymentMode), null, null, null)
                        detailsData.childDataList = detailsData.childDataList.concat(childDataList)
                    }
                }
                moneyCollectFieldDataChildList.push(detailsData)
            }
        }
        return moneyCollectFieldDataChildList
    }

    /**
     * This function compares actual amount and total split amount
     * @param {*} actualAmount 
     * @param {*} splitPaymentModeMap 
     * @returns
     * boolean or error
     */
    checkSplitAmount(actualAmount, splitPaymentModeMap) {
        let totalSplitAmount = 0
        for (let index in splitPaymentModeMap) {
            //Check if amount is valid ie number or float
            if (!Number(splitPaymentModeMap[index].amount)) {
                break
            }
            let amount = parseFloat(splitPaymentModeMap[index].amount)
            totalSplitAmount += (parseFloat(amount) ? parseFloat(amount) : 0)
        }
        //Check if total split amount is equal to actual amount
        if (totalSplitAmount == actualAmount) {
            return true
        }

        throw new Error(SPLIT_AMOUNT_ERROR)
    }

    addPaymentObjectToDetailsArray(actualAmount, modeType, transactionNumber, receipt, remarks, formLayoutState) {
        let moneyCollectAttributeId = formLayoutState.paymentAtEnd.currentElement.fieldAttributeMasterId
        if (moneyCollectAttributeId && formLayoutState.formElement[moneyCollectAttributeId]) {
            let moneyCollectChildList = formLayoutState.formElement[moneyCollectAttributeId].childDataList
            for (let index in moneyCollectChildList) {
                if (moneyCollectChildList[index].childDataList && moneyCollectChildList[index].childDataList[0].childDataList) {
                    let detailsList = moneyCollectChildList[index].childDataList[0].childDataList
                    for (let index in detailsList) {
                        let childAttribute = detailsList[index]
                        if (childAttribute.key.toLocaleLowerCase() == MODE) {
                            childAttribute.value = this.getModeTypeFromModeTypeId(modeType)
                        } else if (childAttribute.key.toLocaleLowerCase() == TRANSACTION_NUMBER) {
                            childAttribute.value = transactionNumber
                        } else if (childAttribute.key.toLocaleLowerCase() == AMOUNT) {
                            childAttribute.value = actualAmount
                        } else if (childAttribute.key.toLocaleLowerCase() == RECEIPT) {
                            childAttribute.value = receipt
                        } else if (childAttribute.key.toLocaleLowerCase() == REMARKS) {
                            childAttribute.value = JSON.stringify(remarks)
                        }
                    }
                }
            }
        }
    }
}


export let paymentService = new Payment()