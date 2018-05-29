'use strict'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { jobMasterService } from '../../../services/classes/JobMaster'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { authenticationService } from '../../../services/classes/Authentication'
import { deviceVerificationService } from '../../../services/classes/DeviceVerification'
import { trackingService } from '../../../services/classes/Tracking'
import { logoutService } from '../../../services/classes/Logout'
import { backupService } from '../../../services/classes/BackupService'


var actions = require('../preloaderActions')
import {
    SHOW_MOBILE_SCREEN,
    SHOW_OTP
} from '../../../lib/ContainerConstants'
import {

    ON_LOGIN_PASSWORD_CHANGE,
    ON_LOGIN_USERNAME_CHANGE,

    MASTER_DOWNLOAD_START,
    MASTER_DOWNLOAD_SUCCESS,
    MASTER_DOWNLOAD_FAILURE,

    MASTER_SAVING_START,
    MASTER_SAVING_SUCCESS,
    MASTER_SAVING_FAILURE,

    CHECK_ASSET_START,
    CHECK_ASSET_FAILURE,

    OTP_GENERATION_START,
    OTP_GENERATION_SUCCESS,
    OTP_GENERATION_FAILURE,

    OTP_VALIDATION_START,
    OTP_VALIDATION_SUCCESS,
    OTP_VALIDATION_FAILURE,

    SESSION_TOKEN_REQUEST,
    SESSION_TOKEN_SUCCESS,
    SESSION_TOKEN_FAILURE,

    SERVICE_PENDING,
    SERVICE_RUNNING,
    SERVICE_SUCCESS,
    SERVICE_FAILED,

    SHOW_OTP_SCREEN,
    SHOW_MOBILE_NUMBER_SCREEN,

    DEVICE_IMEI,
    DEVICE_SIM,
    USER,
    IS_PRELOADER_COMPLETE,

    PRE_LOGOUT_START,
    PRE_LOGOUT_SUCCESS,

    ERROR_400_403_LOGOUT,
    ON_MOBILE_NO_CHANGE,
    ON_OTP_CHANGE,
    PRELOADER_SUCCESS,
    ERROR_LOGOUT,
    DOWNLOAD_LATEST_APP,
    OTP_SUCCESS,
    SET_UNSYNC_TRANSACTION_PRESENT,
    SET_APP_UPDATE_BY_CODEPUSH
} from '../../../lib/constants'
import { MAJOR_VERSION_OUTDATED, MINOR_PATCH_OUTDATED } from '../../../lib/AttributeConstants'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Preloader Actions', () => {
    beforeEach(() => {
        authenticationService.logout = jest.fn()
        keyValueDBService.getValueFromStore = jest.fn()
        trackingService.inValidateStoreVariables = jest.fn()
        logoutService.deleteDataBase = jest.fn()
        backupService.checkForUnsyncBackup = jest.fn()
        deviceVerificationService.checkAssetApiAndSimVerificationOnServer = jest.fn()
        deviceVerificationService.checkAssetLocal = jest.fn()
        jobMasterService.matchServerTimeWithMobileTime = jest.fn()
        jobMasterService.saveJobMaster = jest.fn()
        deviceVerificationService.checkAssetAPI = jest.fn()
        deviceVerificationService.generateOTP = jest.fn()
        deviceVerificationService.verifySim = jest.fn()
        logoutService.checkForUnsyncTransactions = jest.fn()
        keyValueDBService.deleteValueFromStore = jest.fn()
    })
    it('should not logout on preLoader button press', () => {
        const expectedActions = [
            { type: PRE_LOGOUT_START },
            { type: ERROR_400_403_LOGOUT, payload: 'error' },
        ]
        authenticationService.logout = jest.fn(() => {
            throw new Error('error')
        })
        const store = mockStore({})

        return store.dispatch(actions.invalidateUserSession(true))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(authenticationService.logout).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('should logout on preLoader button press', () => {
        const expectedActions = [
            { type: PRE_LOGOUT_START },
            { type: PRE_LOGOUT_SUCCESS },
        ]
        const store = mockStore({})

        authenticationService.logout.mockReturnValueOnce({})
        return store.dispatch(actions.invalidateUserSession(true))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(authenticationService.logout).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
            })
    })


    it('should logout on autoLogout action', () => {
        const expectedActions = [
            { type: PRE_LOGOUT_START },
            { type: PRE_LOGOUT_SUCCESS },
        ]
        const store = mockStore({})

        return store.dispatch(actions.invalidateUserSession(false, true, true))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(authenticationService.logout).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
            })
    })

    it('should logout on autoLogout action after error occur', () => {
        const expectedActions = [
            { type: PRE_LOGOUT_START },
            { type: PRE_LOGOUT_SUCCESS },
        ]
        const store = mockStore({})
        authenticationService.logout = jest.fn(() => {
            throw new Error('error')
        })
        return store.dispatch(actions.invalidateUserSession(false, true, true))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(authenticationService.logout).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
            })
    })

    it('should not logout on menu logout button', () => {
        const expectedActions = [
            { type: PRE_LOGOUT_START },
            { type: ERROR_LOGOUT },
        ]
        const store = mockStore({})
        authenticationService.logout = jest.fn(() => {
            throw new Error('error')
        })
        return store.dispatch(actions.invalidateUserSession(false, true, false))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(authenticationService.logout).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
            })
    })

    it('should start home screen, if server returns 500 for Logout', () => {
        const expectedActions = [
            {
                type: PRE_LOGOUT_SUCCESS
            }
        ]
        const store = mockStore({})
        return store.dispatch(actions.startLoginScreenWithoutLogout())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(logoutService.deleteDataBase).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
            })
    })

    it('should dispatch otp screen', () => {
        const expectedActions = [
            {
                type: SHOW_OTP_SCREEN,
                payload: SHOW_OTP
            }
        ]
        const store = mockStore({})
        return store.dispatch(actions.saveSettingsAndValidateDevice(SERVICE_SUCCESS, SERVICE_SUCCESS, SERVICE_PENDING, SHOW_OTP))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('should dispatch mobile screen', () => {
        const expectedActions = [
            {
                type: SHOW_MOBILE_NUMBER_SCREEN,
                payload: SHOW_MOBILE_SCREEN
            }
        ]
        const store = mockStore({})
        return store.dispatch(actions.saveSettingsAndValidateDevice(SERVICE_SUCCESS, SERVICE_SUCCESS, SERVICE_PENDING, SHOW_MOBILE_SCREEN))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    //not completed
    it('should dispatch download job master', () => {
        const expectedActions = [
            {
                type: MASTER_DOWNLOAD_START,
            },
            {
                type: MASTER_DOWNLOAD_FAILURE,
            }
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce(null)
            .mockReturnValueOnce(null)
            .mockReturnValueOnce(null)
            .mockReturnValueOnce(null)
        const store = mockStore({})
        return store.dispatch(actions.saveSettingsAndValidateDevice(SERVICE_PENDING, SERVICE_PENDING, SERVICE_PENDING))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
            })
    })

    //not completed
    it('should dispatch check asset', () => {
        const expectedActions = [
            {
                type: CHECK_ASSET_START,
            },
            {
                type: SHOW_MOBILE_NUMBER_SCREEN,
            }
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce(null)
            .mockReturnValueOnce(null)
            .mockReturnValueOnce(null)
            .mockReturnValueOnce(null)

        const store = mockStore({})
        return store.dispatch(actions.saveSettingsAndValidateDevice(SERVICE_SUCCESS, SERVICE_SUCCESS, SERVICE_FAILED))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
            })
    })

    //not completed
    it('should download job master', () => {
        const expectedActions = [
            { type: MASTER_DOWNLOAD_START },
            { type: MASTER_DOWNLOAD_SUCCESS },
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        jobMasterService.downloadJobMaster = jest.fn()
        jobMasterService.downloadJobMaster.mockReturnValue({
            json: {
                jobMaster: null
            }
        })
        const store = mockStore({})
        return store.dispatch(actions.downloadJobMaster())
            .then(() => {
                expect(jobMasterService.downloadJobMaster).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
            })
    })

    it('should throw job master response null', () => {
        const error = 'No response returned from server'
        const expectedActions = [
            { type: MASTER_DOWNLOAD_START },
            {
                type: MASTER_DOWNLOAD_FAILURE,
                payload: error
            },
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        jobMasterService.downloadJobMaster = jest.fn()
        jobMasterService.downloadJobMaster.mockReturnValue(null)
        const store = mockStore({})
        return store.dispatch(actions.downloadJobMaster())
            .then(() => {
                expect(jobMasterService.downloadJobMaster).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('should not download job master', () => {
        const error = 'test'
        const expectedActions = [
            { type: MASTER_DOWNLOAD_START },
            {
                type: MASTER_DOWNLOAD_FAILURE,
                payload: error
            },
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        jobMasterService.downloadJobMaster = jest.fn(() => {
            throw new Error(error)
        })
        const store = mockStore({})
        return store.dispatch(actions.downloadJobMaster())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(jobMasterService.downloadJobMaster).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('download job master should throw error and show Unauthorized device alert for 403', () => {
        const error = {
            code: 403,
            message: 'test error'
        }
        const expectedActions = [
            { type: MASTER_DOWNLOAD_START },
            {
                type: ERROR_400_403_LOGOUT,
                payload: error.message
            }
        ]

        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({
            value: {}
        })
        keyValueDBService.validateAndSaveData = jest.fn()
        keyValueDBService.validateAndSaveData.mockReturnValue(true)
        jobMasterService.downloadJobMaster = jest.fn(() => {
            throw error
        })
        const store = mockStore({})
        return store.dispatch(actions.downloadJobMaster())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(jobMasterService.downloadJobMaster).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('download job master should throw error and show Unauthorized device alert for 400', () => {
        const error = {
            code: 400,
            message: 'test error'
        }
        const expectedActions = [
            { type: MASTER_DOWNLOAD_START },
            {
                type: ERROR_400_403_LOGOUT,
                payload: error.message
            }
        ]

        keyValueDBService.getValueFromStore.mockReturnValue({
            value: {}
        })
        keyValueDBService.validateAndSaveData = jest.fn()
        keyValueDBService.validateAndSaveData.mockReturnValue(true)
        jobMasterService.downloadJobMaster = jest.fn(() => {
            throw error
        })
        const store = mockStore({})
        return store.dispatch(actions.downloadJobMaster())
            .then(() => {
                expect(jobMasterService.downloadJobMaster).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('should check device locally and login success', () => {
        const expectedActions = [
            { type: CHECK_ASSET_START },
            { type: PRELOADER_SUCCESS },
        ]
        deviceVerificationService.checkAssetLocal.mockReturnValue(true)
        const store = mockStore({})
        return store.dispatch(actions.checkAsset(null))
            .then(() => {
                expect(backupService.checkForUnsyncBackup).toHaveBeenCalled()
                expect(deviceVerificationService.checkAssetLocal).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
            })
    })
    it('should fail to check device asset', () => {
        const expectedActions = [
            { type: CHECK_ASSET_START },
            { type: CHECK_ASSET_FAILURE, payload: 'error' },
        ]
        deviceVerificationService.checkAssetLocal = jest.fn(() => {
            throw new Error('error')
        })
        const store = mockStore({})
        return store.dispatch(actions.checkAsset(null))
            .then(() => {
                expect(deviceVerificationService.checkAssetLocal).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('should check device locally and hit check asset api', () => {
        const expectedActions = [
            { type: CHECK_ASSET_START },
            { type: PRELOADER_SUCCESS }
        ]
        deviceVerificationService.checkAssetLocal.mockReturnValue(false)
        deviceVerificationService.checkAssetApiAndSimVerificationOnServer.mockReturnValueOnce(true)
        const store = mockStore({})
        return store.dispatch(actions.checkAsset(null))
            .then(() => {
                expect(deviceVerificationService.checkAssetLocal).toHaveBeenCalledTimes(1)
                expect(deviceVerificationService.checkAssetApiAndSimVerificationOnServer).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
            })
    })

    //not completed
    it('should validate and save job master', () => {
        const response = {
            serverTime: null
        }
        const expectedActions = [
            { type: MASTER_SAVING_START },
            { type: MASTER_SAVING_SUCCESS },
            { type: CHECK_ASSET_START }
        ]
        const userObject = {
            value: {
                username: 'abhishek_div001'
            }
        }
        jobMasterService.matchServerTimeWithMobileTime.mockReturnValue(true)
        jobMasterService.saveJobMaster.mockReturnValue(true)
        keyValueDBService.getValueFromStore.mockReturnValue(userObject)
        const store = mockStore({})
        return store.dispatch(actions.validateAndSaveJobMaster(null, null, null, response))
            .then(() => {
                expect(jobMasterService.matchServerTimeWithMobileTime).toHaveBeenCalled()
                expect(jobMasterService.saveJobMaster).toHaveBeenCalled()
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[2].type).toEqual(expectedActions[2].type)
            })
    })

    it('should throw job master response null', () => {
        const response = {
            serverTime: null
        }
        const error = { errorCode: MAJOR_VERSION_OUTDATED }
        const expectedActions = [
            {
                type: MASTER_SAVING_FAILURE,
            }
        ]
        jobMasterService.matchServerTimeWithMobileTime = jest.fn(() => {
            throw new Error(error)
        })
        jobMasterService.saveJobMaster.mockReturnValue(true)
        const store = mockStore({})
        return store.dispatch(actions.validateAndSaveJobMaster(null, null, null, response))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
            })
    })

    it('should not validate and save job master', () => {
        const error = 'test error'
        const response = {
            serverTime: null
        }
        const expectedActions = [
            {
                type: MASTER_SAVING_FAILURE,
                payload: error
            },
        ]
        jobMasterService.matchServerTimeWithMobileTime = jest.fn(() => {
            throw new Error(error)
        })
        jobMasterService.saveJobMaster.mockReturnValue(true)
        const store = mockStore({})
        return store.dispatch(actions.validateAndSaveJobMaster(null, null, null, response))
            .then(() => {
                expect(jobMasterService.saveJobMaster).not.toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('check sim valid on server and success login', () => {
        const expectedActions = [
            { type: PRELOADER_SUCCESS },
        ]
        deviceVerificationService.checkAssetApiAndSimVerificationOnServer.mockReturnValue(true)
        const store = mockStore({})
        return store.dispatch(actions.checkIfSimValidOnServer())
            .then(() => {
                expect(backupService.checkForUnsyncBackup).toHaveBeenCalled()
                expect(deviceVerificationService.checkAssetApiAndSimVerificationOnServer).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
            })
    })

    it('check sim valid on server and throw no response', () => {
        const error = 'No response returned from server'
        const expectedActions = [
            {
                type: CHECK_ASSET_FAILURE,
                payload: error
            },
        ]
        deviceVerificationService.checkAssetApiAndSimVerificationOnServer = jest.fn(() => {
            throw new Error(error)
        })

        const store = mockStore({})
        return store.dispatch(actions.checkIfSimValidOnServer())
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('check sim valid on server and open mobileOtpScreen', () => {
        const error = 'No response returned from server'
        const expectedActions = [
            {
                type: SHOW_MOBILE_NUMBER_SCREEN,
                payload: SHOW_MOBILE_SCREEN
            },
        ]
        deviceVerificationService.checkAssetApiAndSimVerificationOnServer.mockReturnValue(false)
        const store = mockStore({})
        return store.dispatch(actions.checkIfSimValidOnServer())
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('check sim valid on server and logout for 403', () => {
        const error = {
            code: 403,
            message: 'test error'
        }
        const expectedActions = [
            {
                type: ERROR_400_403_LOGOUT,
                payload: error.message
            }
        ]
        deviceVerificationService.checkAssetApiAndSimVerificationOnServer = jest.fn(() => {
            throw error
        })
        const store = mockStore({})
        return store.dispatch(actions.checkIfSimValidOnServer())
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('check sim valid on server and logout for 400', () => {
        const error = {
            code: 400,
            message: 'test error'
        }
        const expectedActions = [
            {
                type: ERROR_400_403_LOGOUT,
                payload: error.message
            }
        ]

        deviceVerificationService.checkAssetApiAndSimVerificationOnServer = jest.fn(() => {
            throw error
        })
        const store = mockStore({})
        return store.dispatch(actions.checkIfSimValidOnServer())
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('generate otp successfully', () => {
        const expectedActions = [
            { type: OTP_GENERATION_START, payload: false },
            { type: SHOW_OTP_SCREEN, payload: SHOW_OTP },
        ]
        deviceVerificationService.generateOTP.mockReturnValue({
            json: {}
        })
        const store = mockStore({})
        return store.dispatch(actions.generateOtp())
            .then(() => {
                expect(deviceVerificationService.generateOTP).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)

            })
    })

    it('generate otp failure', () => {
        const error = 'test error'
        const expectedActions = [
            { type: OTP_GENERATION_START },
            {
                type: OTP_GENERATION_FAILURE,
                payload: error
            },
        ]
        deviceVerificationService.generateOTP = jest.fn(() => {
            throw new Error(error)
        })
        const store = mockStore({})
        return store.dispatch(actions.generateOtp())
            .then(() => {
                expect(deviceVerificationService.generateOTP).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('validate otp successfully', () => {
        const otp = 988128
        const expectedActions = [
            { type: OTP_VALIDATION_START, payload: false },
            { type: OTP_SUCCESS }
        ]
        keyValueDBService.getValueFromStore.mockReturnValue({})
        deviceVerificationService.verifySim.mockReturnValue(otp)
        const store = mockStore({})
        return store.dispatch(actions.validateOtp(otp))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(deviceVerificationService.verifySim).toHaveBeenCalled()
                expect(backupService.checkForUnsyncBackup).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
            })
    })

    it('validate otp fail', () => {
        const otp = 98812
        const error = 'Please enter valid OTP'
        const expectedActions = [
            { type: OTP_VALIDATION_START },
            {
                type: OTP_VALIDATION_FAILURE,
                payload: error
            },
        ]
        keyValueDBService.getValueFromStore.mockReturnValue({
            value: {
                id: '981'
            }
        })
        deviceVerificationService.verifySim = jest.fn(() => {
            throw new Error(error)
        })
        const store = mockStore({})
        return store.dispatch(actions.validateOtp(otp))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('should check for unsync transaction and not  logout', () => {
        const expectedActions = [
            { type: SET_UNSYNC_TRANSACTION_PRESENT }]
        keyValueDBService.getValueFromStore.mockReturnValue({
            value: [{ id: '981' },
            { id: '981' },
            { id: '981' },
            { id: '981' },
            { id: '981' },
            ],
        })
        logoutService.checkForUnsyncTransactions.mockReturnValueOnce(true)
        const store = mockStore({})
        return store.dispatch(actions.checkForUnsyncTransactionAndLogout())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(logoutService.checkForUnsyncTransactions).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
            })
    })
    it('should check for unsync transaction and   logout', () => {
        const expectedActions = [
            { type: PRE_LOGOUT_START },
            { type: PRE_LOGOUT_SUCCESS }
        ]
        keyValueDBService.getValueFromStore.mockReturnValue({
            value: [{ id: '981' },
            { id: '981' },
            { id: '981' },
            { id: '981' },
            { id: '981' },
            ],
        })
        logoutService.checkForUnsyncTransactions.mockReturnValueOnce(false)
        const store = mockStore({})
        return store.dispatch(actions.checkForUnsyncTransactionAndLogout())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(logoutService.checkForUnsyncTransactions).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
            })
    })
    it('should check for unsync transaction and throw error', () => {
        const expectedActions = [
            { type: ERROR_400_403_LOGOUT, payload: 'error' },
        ]
        keyValueDBService.getValueFromStore.mockReturnValue({
            value: [{ id: '981' },
            { id: '981' },
            { id: '981' },
            { id: '981' },
            { id: '981' },
            ],
        })
        logoutService.checkForUnsyncTransactions = jest.fn(() => {
            throw new Error('error')
        })
        const store = mockStore({})
        return store.dispatch(actions.checkForUnsyncTransactionAndLogout())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('should check for App is OutDated for error code MAJOR_VERSION_OUTDATED', () => {
        const expectedActions = [
            { type: DOWNLOAD_LATEST_APP, payload: { displayMessage: 1, downloadUrl: 'downloadUrl' } },
        ]
        const error = { errorCode: 1, downloadUrl: 'downloadUrl' }
        const store = mockStore({})
        return store.dispatch(actions.checkIfAppIsOutdated(error))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
    it('should check for App is OutDated for error code MINOR_PATCH_OUTDATED', () => {
        const expectedActions = [
            { type: SET_APP_UPDATE_BY_CODEPUSH, payload: { isCodePushUpdate: true } }
        ]
        const error = { errorCode: 2, downloadUrl: 'downloadUrl' }
        const store = mockStore({})
        return store.dispatch(actions.checkIfAppIsOutdated(error))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
    it('should check for App is OutDated for error code MINOR_PATCH_OUTDATED', () => {
        const expectedActions = [
            { type: MASTER_SAVING_FAILURE, payload: 'test' }
        ]
        const error = { errorCode: 3, message: 'test' }
        const store = mockStore({})
        return store.dispatch(actions.checkIfAppIsOutdated(error))
            .then(() => {
                expect(keyValueDBService.deleteValueFromStore).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})




