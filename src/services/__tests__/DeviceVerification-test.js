'use strict'

import { deviceVerificationService } from '../classes/DeviceVerification'
import { keyValueDBService } from '../classes/KeyValueDBService'
import CONFIG from '../../lib/config'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { restAPI } from '../../lib/RestAPI'
import RestAPIFactory from '../../lib/RestAPIFactory'
let imei = require('../../wrapper/IMEI')

const {
    DEVICE_IMEI,
    DEVICE_SIM
} = require('../../lib/constants').default

describe('device verification', () => {

    it('is device verified on server', () => {
        const deviceSIM = {
            isVerified: true
        }
        expect(deviceVerificationService.checkIfSimValidOnServer(deviceSIM)).toEqual(true)
    })

    it('is device verified on server', () => {
        const deviceSIM = {
            isVerified: false
        }
        expect(deviceVerificationService.checkIfSimValidOnServer(deviceSIM)).toEqual(false)
    })

    it('should hit check asset api', () => {
        const deviceIMEI = {
            test: 'test'
        }
        const deviceSIM = {
            test: 'test'
        }
        const token = {
            value: null
        }
        restAPI.initialize = jest.fn()
        restAPI.serviceCall = jest.fn((data) => {
            return data
        })
        expect(deviceVerificationService.checkAssetAPI(deviceIMEI, deviceSIM, token)).toEqual('{\"deviceIMEI\":{\"test\":\"test\"},\"deviceSIM\":{\"test\":\"test\"}}')
        expect(restAPI.initialize).toHaveBeenCalledTimes(1)
        expect(restAPI.serviceCall).toHaveBeenCalledTimes(1)
    })

    it('should throw token error check asset api', () => {
        try {
            const deviceIMEI = {
                test: 'test'
            }
            const deviceSIM = {
                test: 'test'
            }
            const token = null
            restAPI.initialize = jest.fn()
            restAPI.serviceCall = jest.fn((data) => {
                return data
            })
            deviceVerificationService.checkAssetAPI(deviceIMEI, deviceSIM, token)
        } catch (error) {
            expect(restAPI.initialize).not.toHaveBeenCalled()
            expect(restAPI.serviceCall).not.toHaveBeenCalled()
            expect(error.message).toEqual('Token Missing')
        }
    })

    it('should hit check asset api with device imei null', () => {
        const deviceIMEI = null
        const deviceSIM = {
            test: 'test'
        }
        const token = {
            value: null
        }
        restAPI.initialize = jest.fn()
        restAPI.serviceCall = jest.fn((data) => {
            return data
        })
        expect(deviceVerificationService.checkAssetAPI(deviceIMEI, deviceSIM, token)).toEqual('{\"deviceIMEI\":{},\"deviceSIM\":{}}')
        expect(restAPI.initialize).toHaveBeenCalledTimes(1)
        expect(restAPI.serviceCall).toHaveBeenCalledTimes(1)
    })

    it('should hit generate OTP api', () => {
        const deviceSIM = {
            test: 'test'
        }
        const token = {
            value: null
        }
        restAPI.initialize = jest.fn()
        restAPI.serviceCall = jest.fn((data) => {
            return data
        })
        expect(deviceVerificationService.generateOTP(deviceSIM, token)).toEqual('{\"test\":\"test\"}')
        expect(restAPI.initialize).toHaveBeenCalledTimes(1)
        expect(restAPI.serviceCall).toHaveBeenCalledTimes(1)
    })

    it('should throw device sim null error on generate OTP api', () => {
        try {
            const deviceSIM = null
            const token = {
                value: null
            }
            restAPI.initialize = jest.fn()
            restAPI.serviceCall = jest.fn((data) => {
                return data
            })
            deviceVerificationService.generateOTP(deviceSIM, token)
        } catch (error) {
            expect(error.message).toEqual('Value of sim missing')
            expect(restAPI.initialize).not.toHaveBeenCalled()
            expect(restAPI.serviceCall).not.toHaveBeenCalled()
        }
    })

    it('should throw token missing error on generate OTP api', () => {
        try {
            const deviceSIM = {
                test: 'test'
            }
            const token = null
            restAPI.initialize = jest.fn()
            restAPI.serviceCall = jest.fn((data) => {
                return data
            })
            deviceVerificationService.generateOTP(deviceSIM, token)
        } catch (error) {
            expect(error.message).toEqual('Token Missing')
            expect(restAPI.initialize).not.toHaveBeenCalled()
            expect(restAPI.serviceCall).not.toHaveBeenCalled()
        }
    })

    it('should hit verify Sim api', () => {
        const deviceSIM = {
            test: 'test'
        }
        const token = {
            value: null
        }
        restAPI.initialize = jest.fn()
        restAPI.serviceCall = jest.fn((data) => {
            return data
        })
        expect(deviceVerificationService.verifySim(deviceSIM, token)).toEqual('{\"test\":\"test\"}')
        expect(restAPI.initialize).toHaveBeenCalledTimes(1)
        expect(restAPI.serviceCall).toHaveBeenCalledTimes(1)
    })

    it('should throw device sim null error on verify Sim api', () => {
        try {
            const deviceSIM = null
            const token = {
                value: null
            }
            restAPI.initialize = jest.fn()
            restAPI.serviceCall = jest.fn((data) => {
                return data
            })
            deviceVerificationService.verifySim(deviceSIM, token)
        } catch (error) {
            expect(error.message).toEqual('Value of sim missing')
            expect(restAPI.initialize).not.toHaveBeenCalled()
            expect(restAPI.serviceCall).not.toHaveBeenCalled()
        }
    })

    it('should throw token missing error on verify Sim api', () => {
        try {
            const deviceSIM = {
                test: 'test'
            }
            const token = null
            restAPI.initialize = jest.fn()
            restAPI.serviceCall = jest.fn((data) => {
                return data
            })
            deviceVerificationService.verifySim(deviceSIM, token)
        } catch (error) {
            expect(error.message).toEqual('Token Missing')
            expect(restAPI.initialize).not.toHaveBeenCalled()
            expect(restAPI.serviceCall).not.toHaveBeenCalled()
        }
    })

    it('should check asset and throw user value missing error', () => {
        try {
            const deviceIMEI = {
                test: 'test'
            }
            const deviceSIM = {
                test: 'test'
            }
            const user = null
            keyValueDBService.validateAndSaveData = jest.fn()
            deviceVerificationService.populateDeviceImeiAndDeviceSim = jest.fn()
            deviceVerificationService.checkAssetLocal(deviceIMEI, deviceSIM, user)
        } catch (error) {
            expect(error.message).toEqual('Value of user missing')
            expect(deviceVerificationService.populateDeviceImeiAndDeviceSim).not.toHaveBeenCalled()
            expect(keyValueDBService.validateAndSaveData).not.toHaveBeenCalled()
        }
    })

    it('should check asset,save hubId and return true', () => {
        const deviceIMEI = {
            value: {
                hubId: 13
            }
        }
        const deviceSIM = {
            value: {
                isVerified: true,
                companyId: 'test'
            }
        }
        const user = {
            value: {
                company: {
                    id: 'test'
                },
                hubId: 12
            }
        }
        keyValueDBService.validateAndSaveData = jest.fn()
        deviceVerificationService.populateDeviceImeiAndDeviceSim = jest.fn()
        return (deviceVerificationService.checkAssetLocal(deviceIMEI, deviceSIM, user))
            .then((data) => {
                expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(1)
                expect(deviceVerificationService.populateDeviceImeiAndDeviceSim).not.toHaveBeenCalled()
                expect(data).toEqual(true)
            })
    })

    it('should check asset,not save hubId and return true', () => {
        const deviceIMEI = {
            value: {
                hubId: 12
            }
        }
        const deviceSIM = {
            value: {
                isVerified: true,
                companyId: 'test'
            }
        }
        const user = {
            value: {
                company: {
                    id: 'test'
                },
                hubId: 12
            }
        }
        keyValueDBService.validateAndSaveData = jest.fn()
        deviceVerificationService.populateDeviceImeiAndDeviceSim = jest.fn()
        return (deviceVerificationService.checkAssetLocal(deviceIMEI, deviceSIM, user))
            .then((data) => {
                expect(keyValueDBService.validateAndSaveData).not.toHaveBeenCalledTimes(1)
                expect(deviceVerificationService.populateDeviceImeiAndDeviceSim).not.toHaveBeenCalled()
                expect(data).toEqual(true)
            })
    })

    it('should check asset,populate DeviceImei and DeviceSim and return false for isVerified false', () => {
        const deviceIMEI = {
            value: {
                hubId: 13
            }
        }
        const deviceSIM = {
            value: {
                isVerified: false,
                companyId: 'test'
            }
        }
        const user = {
            value: {
                company: {
                    id: 'test'
                },
                hubId: 12
            }
        }
        keyValueDBService.validateAndSaveData = jest.fn()
        deviceVerificationService.populateDeviceImeiAndDeviceSim = jest.fn()
        return (deviceVerificationService.checkAssetLocal(deviceIMEI, deviceSIM, user))
            .then((data) => {
                expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(1)
                expect(deviceVerificationService.populateDeviceImeiAndDeviceSim).toHaveBeenCalledTimes(1)
                expect(data).toEqual(false)
            })
    })

    it('should check asset,populate DeviceImei and DeviceSim and return false for different company ids', () => {
        const deviceIMEI = {
            value: {
                hubId: 13
            }
        }
        const deviceSIM = {
            value: {
                isVerified: true,
                companyId: 'test1'
            }
        }
        const user = {
            value: {
                company: {
                    id: 'test'
                },
                hubId: 12
            }
        }
        keyValueDBService.validateAndSaveData = jest.fn()
        deviceVerificationService.populateDeviceImeiAndDeviceSim = jest.fn()
        return (deviceVerificationService.checkAssetLocal(deviceIMEI, deviceSIM, user))
            .then((data) => {
                expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(1)
                expect(deviceVerificationService.populateDeviceImeiAndDeviceSim).toHaveBeenCalledTimes(1)
                expect(data).toEqual(false)
            })
    })

    it('should check asset,populate DeviceImei and DeviceSim and return false for device imei null', () => {
        const deviceIMEI = null
        const deviceSIM = {
            value: {
                isVerified: true,
                companyId: 'test1'
            }
        }
        const user = {
            value: {
                company: {
                    id: 'test'
                },
                hubId: 12
            }
        }
        keyValueDBService.validateAndSaveData = jest.fn()
        deviceVerificationService.populateDeviceImeiAndDeviceSim = jest.fn()
        return (deviceVerificationService.checkAssetLocal(deviceIMEI, deviceSIM, user))
            .then((data) => {
                expect(keyValueDBService.validateAndSaveData).not.toHaveBeenCalledTimes(1)
                expect(deviceVerificationService.populateDeviceImeiAndDeviceSim).toHaveBeenCalledTimes(1)
                expect(data).toEqual(false)
            })
    })

    it('should populate deviceIMEI',() => {
        const user = {
            value : {
                id : 1,
                hubId : 1,
                cityId : 1,
                company : {
                    id : 1
                }
            }
        }
        const imeiNumber = 'testimeinumber'
        keyValueDBService.validateAndSaveData = jest.fn()
        return deviceVerificationService.populateDeviceImei(user,imeiNumber)
        .then(() => {
            expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(1)
        })
    })

    it('should populate deviceSIM',() => {
        const user = {
            value : {
                id : 1,
                hubId : 1,
                cityId : 1,
                company : {
                    id : 1
                }
            }
        }
        const simNumber = 'testsimnumber'
        keyValueDBService.validateAndSaveData = jest.fn()
        return deviceVerificationService.populateDeviceSim(user,simNumber)
        .then(() => {
            expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(1)
        })
    })
})