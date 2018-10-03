import FormLayoutEventImpl from './formLayoutEventImpl.js'

class FormLayoutEventsInterface extends FormLayoutEventImpl {

    findNextFocusableAndEditableElement(attributeMasterId, formLayoutState, value, fieldDataList, event) {
        return this.findNextFocusableAndEditableElements(attributeMasterId, formLayoutState, value, fieldDataList, event);
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
    saveDataInDb(formElement, jobTransactionId, statusId, jobMasterId, jobTransactionList, jobAndFieldAttributesList) {
        return this.saveData(formElement, jobTransactionId, statusId, jobMasterId, jobTransactionList, jobAndFieldAttributesList)
    }

    addTransactionsToSyncList(jobTransactionList, jobMasterId) {
        return this.addToSyncList(jobTransactionList, jobMasterId)
    }

    getSequenceData(sequenceMasterId) {
        return this.getSequenceAttrData(sequenceMasterId)
    }

}

export let formLayoutEventsInterface = new FormLayoutEventsInterface()