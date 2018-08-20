'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    qcLoading: false,
    qcAttributeMaster: null,
    qcDataArray: null,
    qcReasonLoading: false,
    qcReasonData: null,
    qcPassFailResult: null,
    qcImageData: null,
    qcRemarksData: '',
    qcImageURLDataArray: null,
    qcImageAndRemarksLoading: false
})

export default InitialState