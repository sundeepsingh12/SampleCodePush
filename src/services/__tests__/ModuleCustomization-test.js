'use strict'
import { moduleCustomizationService } from '../classes/ModuleCustomization'
import {
    BACKUP,
    BLUETOOTH,
    BULK,
    EZE_TAP,
    LIVE,
    M_SWIPE,
    OFFLINEDATASTORE,
    PIECHART,
    PROFILE,
    STATISTIC,
    START,
    SEQUENCEMODULE,
    SUMMARY,
    USER_NOT_FOUND,
} from '../../lib/AttributeConstants'
import React, { Component } from 'react'

import BulkIcon from '../../svg_components/icons/BulkIcon'
import LiveIcon from '../../svg_components/icons/LiveIcon'
import SequenceIcon from '../../svg_components/icons/SequenceIcon'
import TaskIcon from '../../svg_components/icons/TaskIcon'

describe('test cases for getModuleCustomizationMapForAppModuleId', () => {
    const moduleCustomizationList = [
        {
            appModulesId: 1,
            displayName: 'test'
        },
        {
            appModulesId: 2,
            displayName: 'test1'
        },
        {
            appModulesId: 3,
            displayName: 'test2'
        }
    ]

    const moduleCustomizationMap = {
        1: {
            appModulesId: 1,
            displayName: 'test'
        },
        2: {
            appModulesId: 2,
            displayName: 'test1'
        },
        3: {
            appModulesId: 3,
            displayName: 'test2'
        }
    }

    it('should return empty moduleCustomizationMap for undefined moduleCustomizationList', () => {
        expect(moduleCustomizationService.getModuleCustomizationMapForAppModuleId(undefined)).toEqual({})
    })

    it('should return empty moduleCustomizationMap for empty moduleCustomizationList', () => {
        expect(moduleCustomizationService.getModuleCustomizationMapForAppModuleId([])).toEqual({})
    })

    it('should return moduleCustomizationMap for moduleCustomizationList', () => {
        expect(moduleCustomizationService.getModuleCustomizationMapForAppModuleId(moduleCustomizationList)).toEqual(moduleCustomizationMap)
    })
})

describe('test cases for getModuleCustomizationForAppModuleId', () => {
    const moduleCustomizationList = [
        {
            appModulesId: 1,
            displayName: 'test'
        },
        {
            appModulesId: 2,
            displayName: 'test1'
        },
        {
            appModulesId: 3,
            displayName: 'test2'
        }
    ]

    const result = [
        {
            appModulesId: 1,
            displayName: 'test'
        }
    ]

    it('should return empty moduleCustomization for undefined moduleCustomizationList', () => {
        expect(moduleCustomizationService.getModuleCustomizationForAppModuleId(undefined,1)).toEqual([])
    })

    it('should return empty moduleCustomization for empty moduleCustomizationList', () => {
        expect(moduleCustomizationService.getModuleCustomizationForAppModuleId([],1)).toEqual([])
    })

    it('should return moduleCustomization for moduleCustomizationList', () => {
        expect(moduleCustomizationService.getModuleCustomizationForAppModuleId(moduleCustomizationList,1)).toEqual(result)
    })
})

describe('test cases for getActiveModules', () => {
    const user = {
        userType: {
            id: 1
        }
    }

    it('should throw error for undefined user', () => {
        try {
            moduleCustomizationService.getActiveModules([], undefined)
        } catch (error) {
            expect(error.message).toEqual(USER_NOT_FOUND)
        }
    })

    it('should throw error for undefined user type', () => {
        try {
            const user = {
                id: 123
            }
            moduleCustomizationService.getActiveModules([], user)
        } catch (error) {
            expect(error.message).toEqual(USER_NOT_FOUND)
        }
    })

    it('should not enable module for undefined moduleCustomizationList', () => {
        const BACKUPRESULT = {
            appModuleId: 17,
            displayName: 'Backup',
            enabled: false,
        }
        const BLUETOOTHRESULT = {
            appModuleId: 16,
            displayName: 'Pair Bluetooth Device',
            enabled: false,
        }
        const BULKRESULT = {
            appModuleId: 1,
            displayName: 'Bulk Update',
            enabled: false,
            icon: <BulkIcon />,
        }
        const LIVERESULT = {
            appModuleId: 13,
            displayName: 'Live',
            enabled: false,
            icon: <LiveIcon />,
        }
        const OFFLINEDATASTORERESULT = {
            appModuleId: 15,
            displayName: 'Sync Datastore',
            enabled: false,
        }
        const PIECHARTRESULT = {
            appModuleId: 5,
            displayName: 'Pie Chart',
            enabled: false,
        }
        const PROFILERESULT = {
            appModuleId: 14,
            displayName: 'Profile',
            enabled: false,
            icon: 'md-person',
        }
        const STATISTICRESULT = {
            appModuleId: 7,
            displayName: 'My Stats',
            enabled: false,
            icon: 'md-trending-up',
        }
        const SEQUENCEMODULERESULT = {
            appModuleId: 2,
            displayName: 'Sequence',
            enabled: false,
            icon: <SequenceIcon />,
        }
        const STARTRESULT = {
            appModuleId: 4,
            displayName: 'All Tasks',
            enabled: false,
            icon: <TaskIcon />
        }
        const SUMMARYRESULT = {
            appModuleId: 8,
            displayName: '',
            enabled: false,
        }
        moduleCustomizationService.getActiveModules(undefined, user)
        expect(BACKUP).toEqual(BACKUPRESULT)
        expect(BLUETOOTH).toEqual(BLUETOOTHRESULT)
        expect(BULK).toEqual(BULKRESULT)
        expect(LIVE).toEqual(LIVERESULT)
        expect(OFFLINEDATASTORE).toEqual(OFFLINEDATASTORERESULT)
        expect(PIECHART).toEqual(PIECHARTRESULT)
        expect(PROFILE).toEqual(PROFILERESULT)
        expect(STATISTIC).toEqual(STATISTICRESULT)
        expect(SEQUENCEMODULE).toEqual(SEQUENCEMODULERESULT)
        expect(START).toEqual(STARTRESULT)
        expect(SUMMARY).toEqual(SUMMARYRESULT)
    })

    it('should enable specific module for given moduleCustomizationList', () => {
        const moduleCustomizationList = [
            {
                appModulesId: 17,
                selectedUserType: '[{ "userTypeId" : 4,"displayText" : "TestDisplay"},{"userTypeId" : 2,"displayText" : "TestDisplay1"}]'
            },
            {
                appModulesId: 16,
                selectedUserType: '[{ "userTypeId" : 1,"displayText" : "Bluetooth Display"},{"userTypeId" : 2,"displayText" : "TestDisplay1"}]'
            },
            {
                appModulesId: 1,
                displayName: 'Bulk Module Display',
                selectedUserType: '[{ "userTypeId" : 1,"displayText" : "  "},{"userTypeId" : 2,"displayText" : "TestDisplay1"}]'
            },
            {
                appModulesId: 13,
                displayName: 'Live Module Display'
            },
            {
                appModulesId: 15,
                displayName: '  '
            },
            {
                appModulesId: 5,
            },
            {
                appModulesId: 14,
                selectedUserType: '[{ "userTypeId" : 4,"displayText" : "TestDisplay"},{"userTypeId" : 2,"displayText" : "TestDisplay1"}]'
            },
            {
                appModulesId: 7,
            },
            {
                appModulesId: 2,
            },
            {
                appModulesId: 4,
            },
            {
                appModulesId: 8,
            }
        ]
        const BACKUPRESULT = {
            appModuleId: 17,
            displayName: 'Backup',
            enabled: false,
        }
        const BLUETOOTHRESULT = {
            appModuleId: 16,
            displayName: 'Bluetooth Display ',
            enabled: true,
        }
        const BULKRESULT = {
            appModuleId: 1,
            displayName: 'Bulk Module Display',
            enabled: true,
            icon: <BulkIcon />,
        }
        const LIVERESULT = {
            appModuleId: 13,
            displayName: 'Live Module Display',
            enabled: true,
            icon: <LiveIcon />,
        }
        const OFFLINEDATASTORERESULT = {
            appModuleId: 15,
            displayName: 'Sync Datastore',
            enabled: true,
        }
        const PIECHARTRESULT = {
            appModuleId: 5,
            displayName: 'Pie Chart',
            enabled: true,
        }
        const PROFILERESULT = {
            appModuleId: 14,
            displayName: 'Profile',
            enabled: false,
            icon: 'md-person',
        }
        const STATISTICRESULT = {
            appModuleId: 7,
            displayName: 'My Stats',
            enabled: true,
            icon: 'md-trending-up',
        }
        const SEQUENCEMODULERESULT = {
            appModuleId: 2,
            displayName: 'Sequence',
            enabled: true,
            icon: <SequenceIcon />,
        }
        const STARTRESULT = {
            appModuleId: 4,
            displayName: 'All Tasks',
            enabled: true,
            icon: <TaskIcon />
        }
        const SUMMARYRESULT = {
            appModuleId: 8,
            displayName: '',
            enabled: true,
        }
        moduleCustomizationService.getActiveModules(moduleCustomizationList, user)
        expect(BACKUP).toEqual(BACKUPRESULT)
        expect(BLUETOOTH).toEqual(BLUETOOTHRESULT)
        expect(BULK).toEqual(BULKRESULT)
        expect(LIVE).toEqual(LIVERESULT)
        expect(OFFLINEDATASTORE).toEqual(OFFLINEDATASTORERESULT)
        expect(PIECHART).toEqual(PIECHARTRESULT)
        expect(PROFILE).toEqual(PROFILERESULT)
        expect(STATISTIC).toEqual(STATISTICRESULT)
        expect(SEQUENCEMODULE).toEqual(SEQUENCEMODULERESULT)
        expect(START).toEqual(STARTRESULT)
        expect(SUMMARY).toEqual(SUMMARYRESULT)
    })
})

describe('test cases for setModuleDetails', () => {
    const user = {
        userType: {
            id: 1
        }
    }

    it('should not set app module for undefined moduleCustomization', () => {
        let appModule = {
            appModuleId: 8,
            displayName: 'Test',
            enabled: false,
        }

        let result = {
            appModuleId: 8,
            displayName: 'Test',
            enabled: false,
        }
        moduleCustomizationService.setModuleDetails(appModule, undefined, user)
        expect(appModule).toEqual(result)
    })

    it('should set app module enable for moduleCustomization not having selectedUserType ', () => {
        let appModule = {
            appModuleId: 8,
            displayName: 'Test',
            enabled: false,
        }

        let result = {
            appModuleId: 8,
            displayName: 'Test',
            enabled: true,
        }
        const moduleCustomization = {
            appModulesId: 8
        }
        moduleCustomizationService.setModuleDetails(appModule, moduleCustomization, user)
        expect(appModule).toEqual(result)
    })

    it('should set app module enable for moduleCustomization having selectedUserType ', () => {
        let appModule = {
            appModuleId: 8,
            displayName: 'Test',
            enabled: false,
        }

        let result = {
            appModuleId: 8,
            displayName: 'TestDisplay ',
            enabled: true,
        }

        const moduleCustomization = {
            appModulesId: 8,
            selectedUserType: '[{ "userTypeId" : 1,"displayText" : "TestDisplay"},{"userTypeId" : 2,"displayText" : "TestDisplay1"}]'
        }

        moduleCustomizationService.setModuleDetails(appModule, moduleCustomization, user)
        expect(appModule).toEqual(result)
    })

    it('should not set app module enable for moduleCustomization having selectedUserType ', () => {
        let appModule = {
            appModuleId: 8,
            displayName: 'Test',
            enabled: false,
        }

        let result = {
            appModuleId: 8,
            displayName: 'Test',
            enabled: false,
        }

        const moduleCustomization = {
            appModulesId: 8,
            selectedUserType: '[{ "userTypeId" : 4,"displayText" : "TestDisplay"},{"userTypeId" : 2,"displayText" : "TestDisplay1"}]'
        }

        moduleCustomizationService.setModuleDetails(appModule, moduleCustomization, user)
        expect(appModule).toEqual(result)
    })

    it('should set app module enable and display name of moduleCustomization for moduleCustomization having selectedUserType ', () => {
        let appModule = {
            appModuleId: 8,
            displayName: 'Test',
            enabled: false,
        }

        let result = {
            appModuleId: 8,
            displayName: 'TestModule',
            enabled: true,
        }

        const moduleCustomization = {
            appModulesId: 8,
            displayName: 'TestModule',
            selectedUserType: '[{ "userTypeId" : 1,"displayText" : "  "},{"userTypeId" : 2,"displayText" : "TestDisplay1"}]'
        }

        moduleCustomizationService.setModuleDetails(appModule, moduleCustomization, user)
        expect(appModule).toEqual(result)
    })

    it('should set app module enable but not display name of moduleCustomization for moduleCustomization having selectedUserType ', () => {
        let appModule = {
            appModuleId: 8,
            displayName: 'Test',
            enabled: false,
        }

        let result = {
            appModuleId: 8,
            displayName: 'Test',
            enabled: true,
        }

        const moduleCustomization = {
            appModulesId: 8,
            displayName: ' ',
            selectedUserType: '[{ "userTypeId" : 1,"displayText" : "  "},{"userTypeId" : 2,"displayText" : "TestDisplay1"}]'
        }

        moduleCustomizationService.setModuleDetails(appModule, moduleCustomization, user)
        expect(appModule).toEqual(result)
    })
})

describe('test cases for checkSelectedUserType', () => {
    const user = {
        userType: {
            id: 1
        }
    }

    it('should return true for empty selectedUserTypeList', () => {
        expect(moduleCustomizationService.checkSelectedUserType([], user)).toBeTruthy()
    })

    it('should return displayText for selectedUserTypeList containig user', () => {
        const selectedUserTypeList = [
            {
                userTypeId: 1,
                displayText: 'TestDisplay'
            },
            {
                userTypeId: 2,
                displayText: 'TestDisplay1'
            },
        ]
        expect(moduleCustomizationService.checkSelectedUserType(selectedUserTypeList, user)).toEqual('TestDisplay ')
    })

    it('should return false for selectedUserTypeList not containig user', () => {
        const selectedUserTypeList = [
            {
                userTypeId: 4,
                displayText: 'TestDisplay'
            },
            {
                userTypeId: 2,
                displayText: 'TestDisplay1'
            },
        ]
        expect(moduleCustomizationService.checkSelectedUserType(selectedUserTypeList, user)).toBeFalsy()
    })
})