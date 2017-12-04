import FormLayoutEventImpl from './formLayoutEventImpl.js'

class FormLayoutEventsInterface extends FormLayoutEventImpl {

    findNextFocusableAndEditableElement(attributeMasterId, formElement, isSaveDisabled, value, fieldDataList, event) {
        return this.findNextFocusableAndEditableElements(attributeMasterId, formElement, isSaveDisabled, value, fieldDataList, event);
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
    saveDataInDb(formElement, jobTransactionId, statusId,jobMasterId,jobTransactionIdList) {
        return this.saveData(formElement, jobTransactionId, statusId, jobMasterId,jobTransactionIdList)
    }

    addTransactionsToSyncList(jobTransactionList) {
        return this.addToSyncList(jobTransactionList)
    }

    getSequenceData(sequenceMasterId){
        return this.getSequenceAttrData(sequenceMasterId)
    }

    executeBeforeValidations(attributeMasterId) {}

    executeAfterValidations(attributeMasterId) {}

}

export let formLayoutEventsInterface = new FormLayoutEventsInterface()