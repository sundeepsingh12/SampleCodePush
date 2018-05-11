'use strict'

import { Record } from 'immutable'

/**
 * Initial state of formLayout
 * It contains formElement which is an es6 map containing masterId wise fieldAttributeDto, elements of dto are as follows
 *          label,
            subLabel,
            helpText,
            key,
            required,
            hidden,
            attributeTypeId,
            fieldAttributeMasterId,
            positionId,
            parentId,
            showHelpText,
            editable,
            focus,
            validation // it is an array containing all nested validation and validation conditions object
    
    nextEditable is an object containing attributeMasterId wise array of next required and non required elements 
            1:[2,3,'required$$4']

    other elements are as per their names
 */
var InitialState = Record({
        currentElement: 0,
        latestPositionId: 0,
        isSaveDisabled: true,
        statusId: 0,
        jobTransactionId: 0,
        statusName: '',
        formElement: {},
        isLoading: false,
        errorMessage: '',
        paymentAtEnd: {},
        updateDraft: true,
        isFormValid: true,
        dataStoreFilterReverseMap: {},
        fieldAttributeMasterParentIdMap: {},
        modalFieldAttributeMasterId: null,
        noFieldAttributeMappedWithStatus: false,
        arrayReverseDataStoreFilterMap: {}, // used in array when it has DSF or DataStore as child attribute and they also have mapping with other DSF
        jobAndFieldAttributesList: {}
})

export default InitialState