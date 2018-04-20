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
import React, { PureComponent } from 'react'

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

