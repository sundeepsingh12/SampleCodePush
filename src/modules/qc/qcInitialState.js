'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    qcLoading: false,
    qcAttributeMaster: null,
    qcDataArray: null,
    qcModal: false,
    qcModalLoading: false,
    qcReasonData: null,
    qcPassFailResult: null,
    qcImageData: null,
    qcRemarksData: null
})

export default InitialState