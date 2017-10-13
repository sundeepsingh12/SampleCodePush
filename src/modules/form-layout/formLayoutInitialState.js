'use strict'

import {Record} from 'immutable'

var InitialState = Record({
    currentElement : 0,
    noOfElements : 0,
    nextElement : 0,
    latestPositionId : 0,
    isSaveDisabled : true,
    statusId : 0,
    jobTransactionId : 0,
    statusName : '',
    formElement : {},
    nextEditable : {},
    
    /*
    // this formElement contains basic fieldAttributeElements and it also contains
    // validationMaster array and inside validationMaster it contains validationConditions Array
    */
})

export default InitialState