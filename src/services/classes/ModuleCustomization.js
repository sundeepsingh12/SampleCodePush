'use strict'

class ModuleCustomization {

    /**
     * 
     * @param {*} moduleCustomizationList 
     */
    getModuleCustomizationMapForAppModuleId(moduleCustomizationList) {
        let moduleCustomizationMap = {}
        for(let index in moduleCustomizationList) {
            moduleCustomizationMap[moduleCustomizationList[index].appModulesId] = moduleCustomizationList[index]
        }
        return moduleCustomizationMap
    }

    getModuleCustomizationForAppModuleId(moduleCustomizationList, appModuleId) {
        moduleCustomizationList = moduleCustomizationList ? moduleCustomizationList : []
        return moduleCustomizationList.filter(moduleCustomization => moduleCustomization.appModulesId == appModuleId)
    }
}

export let moduleCustomizationService = new ModuleCustomization()