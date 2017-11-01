import FormLayoutEventImpl from './formLayoutEventImpl.js'

class FormLayoutEventsInterface extends FormLayoutEventImpl {

    findNextFocusableAndEditableElement(attributeMasterId, formElement, nextEditable, isSaveDisabled, value, fieldDataList, event) {
        return this.findNextFocusableAndEditableElements(attributeMasterId, formElement, nextEditable, isSaveDisabled, value, fieldDataList, event);
    }

    disableSaveIfRequired(attributeMasterId, isSaveDisabled, formLayoutObject, value) {
        return this.disableSave(attributeMasterId, isSaveDisabled, formLayoutObject, value);
    }

    updateFieldData(attributeMasterId, value, formElement, calledFrom) {
        return this.updateFieldInfo(attributeMasterId, value, formElement, calledFrom);
    }

    toogleHelpTextView(attributeMasterId, formElement) {
        return this.toogleHelpText(attributeMasterId, formElement);
    }

    /**
     * 
     * @param {*} formElement 
     * @param {*} jobTransactionId 
     * @param {*} statusId 
     * @param {*} jobMasterId
     */
    saveDataInDb(formElement, jobTransactionId, statusId,jobMasterId) {
        return this.saveData(formElement, jobTransactionId, statusId, jobMasterId)
    }

    addTransactionsToSyncList(jobTransactionId) {
        return this.addToSyncList(jobTransactionId);
    }

    executeBeforeValidations(attributeMasterId) {}

    executeAfterValidations(attributeMasterId) {}


}

export let formLayoutEventsInterface = new FormLayoutEventsInterface()