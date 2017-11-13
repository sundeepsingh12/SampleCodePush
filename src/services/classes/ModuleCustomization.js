'use strict'

import {
    BULK,
    LIVE,
    OFFLINEDATASTORE,
    PIECHART,
    STATISTIC,
    START,
    SEQUENCE,
    SUMMARY,
} from '../../lib/AttributeConstants'

class ModuleCustomization {

    /**
     * 
     * @param {*} moduleCustomizationList 
     */
    getModuleCustomizationMapForAppModuleId(moduleCustomizationList) {
        let moduleCustomizationMap = {}
        for (let index in moduleCustomizationList) {
            moduleCustomizationMap[moduleCustomizationList[index].appModulesId] = moduleCustomizationList[index]
        }
        return moduleCustomizationMap
    }

    getModuleCustomizationForAppModuleId(moduleCustomizationList, appModuleId) {
        moduleCustomizationList = moduleCustomizationList ? moduleCustomizationList : []
        return moduleCustomizationList.filter(moduleCustomization => moduleCustomization.appModulesId == appModuleId)
    }

    getActiveModules(moduleCustomizationList) {
        for (let index in moduleCustomizationList) {
            switch (moduleCustomizationList[index].appModuleId) {
                case BULK.appModuleId: {
                    console.log('bulk',moduleCustomizationList[index])
                }
                case LIVE.appModuleId:
                case OFFLINEDATASTORE.appModuleId:
                case PIECHART.appModuleId:
                case START.appModuleId:{
                    console.log('start',moduleCustomizationList[index])
                }
                case STATISTIC.appModuleId:
                case SEQUENCE.appModuleId:
                case SUMMARY.appModuleId:
            }
        }
    }
}

export let moduleCustomizationService = new ModuleCustomization()