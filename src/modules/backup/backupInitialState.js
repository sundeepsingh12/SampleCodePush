'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    syncedFiles: {},
    unSyncedFiles: {},
    isLoading: false,
    backupView: 0,  //0 for files list,1 for uploading,2 for upload successful,3 for upload failure
    fileUploading: {}
})

export default InitialState