import FormLayoutEventImpl from './formLayoutEventImpl.js'

class FormLayoutEventsInterface extends FormLayoutEventImpl {

    findNextFocusableAndEditableElement(attributeMasterId, formElement, isSaveDisabled, value, fieldDataList, event, jobTransaction) {
        return this.findNextFocusableAndEditableElements(attributeMasterId, formElement, isSaveDisabled, value, fieldDataList, event, jobTransaction);
    }

    disableSaveIfRequired(attributeMasterId, isSaveDisabled, formLayoutObject, value) {
        return this.disableSave(attributeMasterId, isSaveDisabled, formLayoutObject, value);
    }

    updateFieldData(attributeMasterId, value, formElement, calledFrom) {
        return this.updateFieldInfo(attributeMasterId, value, formElement, calledFrom);
    }

    /**
     * 
     * @param {*} formElement 
     * @param {*} jobTransactionId 
     * @param {*} statusId 
     * @param {*} jobMasterId
     */
    saveDataInDb(formElement, jobTransactionId, statusId, jobMasterId, jobTransactionIdList, jobTransaction) {
        return this.saveData(formElement, jobTransactionId, statusId, jobMasterId, jobTransactionIdList, jobTransaction)
    }

    addTransactionsToSyncList(jobTransactionList) {
        return this.addToSyncList(jobTransactionList)
    }

    getSequenceData(sequenceMasterId) {
        return this.getSequenceAttrData(sequenceMasterId)
    }

    executeBeforeValidations(attributeMasterId) { }

    executeAfterValidations(attributeMasterId) { }

}

export let formLayoutEventsInterface = new FormLayoutEventsInterface()