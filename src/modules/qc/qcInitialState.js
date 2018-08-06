'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    qcLoading: false,
    qcAttributeMaster: null,
    qcDataArray: null,
    qcModal: false,
    qcModalLoading: false,
    qcReasonData: null
})

export default InitialState