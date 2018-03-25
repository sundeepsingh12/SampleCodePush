'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    walletParameters: null,
    walletList: null,
    isModalVisible: 0,
    errorMessage: null,
    selectedWalletDetails: null,
    contactNumber: null,
    otpNumber: null,
    isLoaderRunning: false,
})

export default InitialState