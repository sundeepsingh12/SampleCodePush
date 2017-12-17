    'use strict'

    import {Record} from 'immutable'
    var InitialState = Record({
        jobMasterList : [],
        statusList : [],
        negativeId : 0,
        newJobError: ''
    })
    
    export default InitialState    