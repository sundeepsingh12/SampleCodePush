'use strict'

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

    /**
     * This function enables modules for user
     * @param {*} moduleCustomizationList 
     * @param {*} user 
     * 
     */
    getActiveModules(moduleCustomizationList, user) {
        for (let index in moduleCustomizationList) {
            switch (moduleCustomizationList[index].appModulesId) {
                case BACKUP.appModuleId: {
                    this.setModuleDetails(BACKUP, moduleCustomizationList[index], user)
                    break
                }
                case BLUETOOTH.appModuleId: {
                    this.setModuleDetails(BLUETOOTH, moduleCustomizationList[index], user)
                    break
                }
                case BULK.appModuleId: {
                    this.setModuleDetails(BULK, moduleCustomizationList[index], user)
                    break
                }
                case EZE_TAP.appModuleId: {
                    this.setModuleDetails(EZE_TAP, moduleCustomizationList[index], user)
                    break
                }
                case LIVE.appModuleId: {
                    this.setModuleDetails(LIVE, moduleCustomizationList[index], user)
                    break
                }
                case M_SWIPE.appModuleId: {
                    this.setModuleDetails(M_SWIPE, moduleCustomizationList[index], user)
                    break
                }
                case OFFLINEDATASTORE.appModuleId: {
                    this.setModuleDetails(OFFLINEDATASTORE, moduleCustomizationList[index], user)
                    break
                }
                case PIECHART.appModuleId: {
                    this.setModuleDetails(PIECHART, moduleCustomizationList[index], user)
                    break
                }
                case START.appModuleId: {
                    this.setModuleDetails(START, moduleCustomizationList[index], user)
                    break
                }
                case STATISTIC.appModuleId: {
                    this.setModuleDetails(STATISTIC, moduleCustomizationList[index], user)
                    break
                }
                case SEQUENCE.appModuleId: {
                    this.setModuleDetails(SEQUENCE, moduleCustomizationList[index], user)
                    break
                }
                case SUMMARY.appModuleId: {
                    this.setModuleDetails(SUMMARY, moduleCustomizationList[index], user)
                    break
                }
            }
        }
    }

    /**
     * This function enable module and sets display name
     * @param {*} appModule 
     * @param {*} moduleCustomization 
     * @param {*} user 
     */
    setModuleDetails(appModule, moduleCustomization, user) {
        let displayName = ''
        if (!moduleCustomization.selectedUserType || moduleCustomization.selectedUserType.length == 0 || JSON.parse(moduleCustomization.selectedUserType).length == 0 || (displayName = this.checkSelectedUserType(JSON.parse(moduleCustomization.selectedUserType), user))) {
            appModule.enabled = true
            appModule.displayName = displayName.trim() ? displayName : moduleCustomization.displayName && (moduleCustomization.displayName + '').trim() ? moduleCustomization.displayName : appModule.displayName
        }
    }

    /**
     * This function checks if a module is enabled for usertype
     * @param {*} selectedUserTypeList 
     * @param {*} user 
     * @returns
     * boolean
     */
    checkSelectedUserType(selectedUserTypeList, user) {
        for (let index in selectedUserTypeList) {
            if (selectedUserTypeList[index].userTypeId == user.userType.id) {
                return (selectedUserTypeList[index].displayText + ' ')
            }
        }
        return false
    }


}

export let moduleCustomizationService = new ModuleCustomization()