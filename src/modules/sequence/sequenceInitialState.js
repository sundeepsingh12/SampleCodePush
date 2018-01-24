'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    sequenceList: [],
    isSequenceScreenLoading: false,
    isResequencingDisabled: false,
    responseMessage: '',
    runsheetNumberList: [],
    searchText: '',
    currentSequenceListItemSeleceted: {},
    jobMasterSeperatorMap: {},
    transactionsWithChangedSeqeunceMap: {},// map having those transaction whose sequence is changed,
})

export default InitialState