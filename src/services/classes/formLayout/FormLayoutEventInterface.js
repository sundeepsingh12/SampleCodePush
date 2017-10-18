import FormLayoutEventImpl from './formLayoutEventImpl.js'

class FormLayoutEventsInterface extends FormLayoutEventImpl {

    findNextFocusableAndEditableElement(attributeMasterId,formElement,nextEditable,isSaveDisabled,value,childDataList){
        return this.findNextFocusableAndEditableElements(attributeMasterId, formElement, nextEditable,isSaveDisabled,value,childDataList);
    }

    disableSaveIfRequired(attributeMasterId,isSaveDisabled,formLayoutObject,value){
        return this.disableSave(attributeMasterId,isSaveDisabled,formLayoutObject,value);
    }

    updateFieldData(attributeMasterId, value, formElement,calledFrom){
        return this.updateFieldInfo(attributeMasterId, value, formElement, calledFrom);
    }

    toogleHelpTextView(attributeMasterId, formElement){
        return this.toogleHelpText(attributeMasterId,formElement);
    }

    saveDataInDb(formElement,jobTransactionId,statusId){
        return this.saveData(formElement,jobTransactionId,statusId)
    }

    executeBeforeValidations(attributeMasterId){}

    executeAfterValidations(attributeMasterId){}


}

export let formLayoutEventsInterface = new FormLayoutEventsInterface()
