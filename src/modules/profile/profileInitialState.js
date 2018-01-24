'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    name: '',
    contactNumber: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    isSaveResetButtonDisabled: true,
    isLoaderInProfile: false,
})

export default InitialState