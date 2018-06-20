import FormLayoutEventImpl from './formLayoutEventImpl.js'

class FormLayoutEventsInterface extends FormLayoutEventImpl {

    findNextFocusableAndEditableElement(attributeMasterId, formElement, isSaveDisabled, value, fieldDataList, event, jobTransaction, fieldAttributeMasterParentIdMap, jobAndFieldAttributesList) {
        return this.findNextFocusableAndEditableElements(attributeMasterId, formElement, isSaveDisabled, value, fieldDataList, event, jobTransaction, fieldAttributeMasterParentIdMap, jobAndFieldAttributesList);
    }

    disableSaveIfRequired(attributeMasterId, isSaveDisabled, formLayoutObject, value) {
        return this.disableSave(attributeMasterId, isSaveDisabled, formLayoutObject, value);
    }

    updateFieldData(attributeMasterId, value, formElement, calledFrom, fieldDataList) {
        return this.updateFieldInfo(attributeMasterId, value, formElement, calledFrom, fieldDataList);
    }

    /**
     * 
     * @param {*} formElement 
     * @param {*} jobTransactionId 
     * @param {*} statusId 
     * @param {*} jobMasterId
     */
    saveDataInDb(formElement, jobTransactionId, statusId, jobMasterId, jobTransactionList) {
        return this.saveData(formElement, jobTransactionId, statusId, jobMasterId, jobTransactionList)
    }

    addTransactionsToSyncList(jobTransactionList) {
        return this.addToSyncList(jobTransactionList)
    }

    getSequenceData(sequenceMasterId) {
        return this.getSequenceAttrData(sequenceMasterId)
    }

}

export let formLayoutEventsInterface = new FormLayoutEventsInterface()