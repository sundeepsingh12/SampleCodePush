'use strict'
import React from 'react'
import {
    BACKUP_ID,
    BLUETOOTH_ID,
    BULK_ID,
    EZE_TAP_ID,
    LIVE_ID,
    M_SWIPE_ID,
    OFFLINEDATASTORE_ID,
    PIECHART_ID,
    PROFILE_ID,
    STATISTIC_ID,
    START_ID,
    SEQUENCEMODULE_ID,
    SUMMARY_ID,
    SORTING_ID,
    CUSTOMAPP_ID,
    NEWJOB_ID,
    NEW_JOB,
    Piechart,
    JOB_ASSIGNMENT_ID,
    Start
} from '../../lib/AttributeConstants'
import {
    BACKUP,
    BLUETOOTH,
    BULK,
    EZETAP,
    LIVE,
    MSWIPE,
    OFFLINEDATASTORE,
    PIECHART,
    PROFILE,
    STATISTIC,
    START,
    SEQUENCEMODULE,
    SUMMARY,
    SORTING,
    CUSTOMAPP,
    JOB_ASSIGNMENT,
    MAIN_MENU
} from '../../lib/constants'
import _ from 'lodash'
import NewJobIcon from '../../../src/svg_components/icons/NewJobIcon'
import { UNTITLED } from '../../lib/ContainerConstants'
class ModuleCustomization {

    /**
     * @param {*} moduleCustomizationList 
     * @returns moduleCustomizationMap : {
     *                                      appModulesId : moduleCustomization
     *                                   }
     */
    getModuleCustomizationMapForAppModuleId(moduleCustomizationList) {
        let moduleCustomizationMap = {}
        for (let index in moduleCustomizationList) {
            moduleCustomizationMap[moduleCustomizationList[index].appModulesId] = moduleCustomizationList[index]
        }
        return moduleCustomizationMap
    }

    /**
     * @param {*} moduleCustomizationList 
     * @param {*} appModuleId 
     * @returns moduleCustomization
     */
    getModuleCustomizationForAppModuleId(moduleCustomizationList, appModuleId) {
        moduleCustomizationList = moduleCustomizationList ? moduleCustomizationList : []
        return moduleCustomizationList.filter(moduleCustomization => moduleCustomization.appModulesId == appModuleId)
    }

    /**
     * This function enables modules for user
     * @param {*} moduleCustomizationList 
     * @param {*} user  
     * @param {*} modules
     * @param {*} pieChart
     * @param {*} menu
     */
    getActiveModules(moduleCustomizationList, user, modules, pieChart, menu, newJobModules) {
        let serialNumber = 0
        if (!user || !user.userType) {
            throw new Error(USER_NOT_FOUND)
        }
        let cloneNewJobModules = _.cloneDeep(newJobModules)
        let cloneModules = _.cloneDeep(modules)
        let clonePieChart = _.cloneDeep(pieChart)
        let cloneMenu = _.cloneDeep(menu)
        for (let index in moduleCustomizationList) {

            switch (moduleCustomizationList[index].appModulesId) {
                case BACKUP_ID:
                    {
                        cloneMenu[BACKUP] = this.setModuleDetails(cloneMenu[BACKUP], moduleCustomizationList[index], user, serialNumber++)
                        break
                    }
                case BLUETOOTH_ID:
                    {
                        cloneMenu[BLUETOOTH] = this.setModuleDetails(cloneMenu[BLUETOOTH], moduleCustomizationList[index], user, serialNumber++)
                        break
                    }
                case BULK_ID:
                    {
                        cloneModules[BULK] = this.setModuleDetails(cloneModules[BULK], moduleCustomizationList[index], user, serialNumber++)
                        break
                    }
                case EZE_TAP_ID:
                    {
                        cloneMenu[EZETAP] = this.setModuleDetails(cloneMenu[EZETAP], moduleCustomizationList[index], user, serialNumber++)
                        break
                    }
                case LIVE_ID:
                    {
                        cloneModules[LIVE] = this.setModuleDetails(cloneModules[LIVE], moduleCustomizationList[index], user, serialNumber++)
                        break
                    }
                case M_SWIPE_ID:
                    {
                        cloneMenu[MSWIPE] = this.setModuleDetails(cloneMenu[MSWIPE], moduleCustomizationList[index], user, serialNumber++)
                        break
                    }
                case OFFLINEDATASTORE_ID:
                    {
                        cloneMenu[OFFLINEDATASTORE] = this.setModuleDetails(cloneMenu[OFFLINEDATASTORE], moduleCustomizationList[index], user, serialNumber++)
                        break
                    }
                case PIECHART_ID:
                    {
                        clonePieChart[PIECHART] = this.setModuleDetails(clonePieChart[PIECHART], moduleCustomizationList[index], user, serialNumber++)
                        Piechart.enabled = clonePieChart[PIECHART].enabled
                        break
                    }
                case PROFILE_ID:
                    {
                        cloneMenu[PROFILE] = this.setModuleDetails(cloneMenu[PROFILE], moduleCustomizationList[index], user, serialNumber++)
                        break
                    }
                case START_ID:
                    {
                        cloneModules[START] = this.setModuleDetails(cloneModules[START], moduleCustomizationList[index], user, serialNumber++)
                        Start.landingTab = (cloneModules[START].remark) ? cloneModules[START].remark.landingTabAfterJobCompletion : false
                        break
                    }
                case STATISTIC_ID:
                    {
                        cloneMenu[STATISTIC] = this.setModuleDetails(cloneMenu[STATISTIC], moduleCustomizationList[index], user, serialNumber++)
                        break
                    }
                case SEQUENCEMODULE_ID:
                    {
                        cloneModules[SEQUENCEMODULE] = this.setModuleDetails(cloneModules[SEQUENCEMODULE], moduleCustomizationList[index], user, serialNumber++)
                        break
                    }
                case SUMMARY_ID:
                    {
                        clonePieChart[SUMMARY] = this.setModuleDetails(clonePieChart[SUMMARY], moduleCustomizationList[index], user, serialNumber++)
                        break
                    }

                case SORTING_ID:
                    {
                        cloneModules[SORTING] = this.setModuleDetails(cloneModules[SORTING], moduleCustomizationList[index], user, serialNumber++)
                        break
                    }

                case CUSTOMAPP_ID:
                    {
                        cloneModules[CUSTOMAPP] = this.setModuleDetails(cloneModules[CUSTOMAPP], moduleCustomizationList[index], user, serialNumber++)
                        break
                    }
                case NEWJOB_ID:
                    {
                        let newJobModuleParams = this.setModuleDetailsForNewJob(moduleCustomizationList[index], user, serialNumber)
                        serialNumber = newJobModuleParams.serialNumber
                        cloneNewJobModules = _.merge(cloneNewJobModules, newJobModuleParams.appModuleObject)
                        break
                    }
                case JOB_ASSIGNMENT_ID: {
                    cloneModules[JOB_ASSIGNMENT] = this.setModuleDetails(cloneModules[JOB_ASSIGNMENT], moduleCustomizationList[index], user, serialNumber++)
                    break
                }
            }
        }
        return {
            newJobModules: cloneNewJobModules,
            modules: cloneModules,
            pieChart: clonePieChart,
            menu: cloneMenu
        }
    }

    /**
    * This function enable module and sets display name
    * @param {*} appModule 
    * @param {*} moduleCustomization 
    * @param {*} user 
    * @param {*} serialNumber 
    */
    setModuleDetails(appModule, moduleCustomization, user, serialNumber) {
        if (!moduleCustomization) {
            return
        }
        let displayName = ''
        if (!moduleCustomization.selectedUserType || moduleCustomization.selectedUserType.length == 0 || (displayName = this.checkSelectedUserType(JSON.parse(moduleCustomization.selectedUserType), user))) {
            appModule.enabled = true
            appModule.serialNumber = serialNumber
            appModule.displayName = displayName.trim() ? displayName : moduleCustomization.displayName && (moduleCustomization.displayName + '').trim() ? moduleCustomization.displayName : appModule.displayName
            if ((appModule.appModuleId == START_ID || appModule.appModuleId == CUSTOMAPP_ID) && moduleCustomization.remark != undefined) {
                appModule.remark = JSON.parse(moduleCustomization.remark)
            }
        }
        return appModule
    }

    /**
      * This function enable module and sets display name in case of new job
      * @param {*} moduleCustomization 
      * @param {*} user 
      * @param {*} serialNumber
      * @returns appModuleObject:{
      *                          'displayText':{  
      *                                           appModuleId
      *                                           displayText:'displayText',
      *                                           enabled:true,
      *                                           jobMasterList:[123,234],
      *                                           serialNumber,
                                                  icon
                                                 }
      *                           }
      */
    setModuleDetailsForNewJob(moduleCustomization, user, serialNumber) {
        if (!moduleCustomization) {
            return
        }
        let appModuleObject = {}
        let appModule = {
            enabled: true,
            icon: <NewJobIcon />,
            appModuleId: moduleCustomization.appModulesId
        }
        if (moduleCustomization.remark != undefined && moduleCustomization.remark != null && moduleCustomization.remark != '[]') {
            let remarkList = JSON.parse(moduleCustomization.remark)
            for (let remark of remarkList) {
                if (user.userType.id == remark.userTypeId) {
                    if (appModuleObject[remark.displayText]) {
                        appModule.jobMasterIdList.push(remark.jobMasterId)
                    } else {
                        appModule.jobMasterIdList = []
                        appModule.jobMasterIdList.push(remark.jobMasterId)
                        appModule.displayName = remark.displayText
                    }
                    appModule.serialNumber = serialNumber++
                    appModuleObject[remark.displayText] = _.cloneDeep(appModule)
                }
            }
        } else if (moduleCustomization.displayName) {
            appModule.serialNumber = serialNumber++
            appModule.displayName = moduleCustomization.displayName
            appModuleObject[appModule.displayName] = appModule
        } else {
            appModule.displayName = NEW_JOB
            appModule.serialNumber = serialNumber++
            appModuleObject[appModule.displayName] = appModule
        }
        return {
            appModuleObject,
            serialNumber
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
        if (selectedUserTypeList.length == 0) {
            return ' '
        }
        for (let index in selectedUserTypeList) {
            if (selectedUserTypeList[index].userTypeId == user.userType.id) {
                return (selectedUserTypeList[index].displayText ? selectedUserTypeList[index].displayText + ' ' : '  ')
            }
        }
        return false
    }


    getPagesMainMenuAndSubMenuObject(pageList, user) {
        let mainMenuObject = {}, subMenuObject = {};
        for (let page in pageList) {
            if (pageList[page].userType != user.userType.id) {
                continue
            }
            pageList[page].groupName = pageList[page].groupName ? pageList[page].groupName : UNTITLED
            if (pageList[page].menuLocation == MAIN_MENU) {
                mainMenuObject[pageList[page].groupName] = mainMenuObject[pageList[page].groupName] ? mainMenuObject[pageList[page].groupName] : {};
                mainMenuObject[pageList[page].groupName].pageList = mainMenuObject[pageList[page].groupName].pageList ? mainMenuObject[pageList[page].groupName].pageList : [];
                mainMenuObject[pageList[page].groupName].pageList.push(pageList[page]);
                mainMenuObject[pageList[page].groupName].sequence = mainMenuObject[pageList[page].groupName].sequence ? mainMenuObject[pageList[page].groupName].sequence < pageList[page].sequenceNumber ? mainMenuObject[pageList[page].groupName].sequence : pageList[page].sequenceNumber : pageList[page].sequenceNumber;
                mainMenuObject[pageList[page].groupName].groupName = pageList[page].groupName;
            } else {
                subMenuObject[pageList[page].groupName] = subMenuObject[pageList[page].groupName] ? subMenuObject[pageList[page].groupName] : {};
                subMenuObject[pageList[page].groupName].pageList = subMenuObject[pageList[page].groupName].pageList ? subMenuObject[pageList[page].groupName].pageList : []
                subMenuObject[pageList[page].groupName].pageList.push(pageList[page])
                subMenuObject[pageList[page].groupName].sequence = subMenuObject[pageList[page].groupName].sequence ? subMenuObject[pageList[page].groupName].sequence < pageList[page].sequenceNumber ? subMenuObject[pageList[page].groupName].sequence : pageList[page].sequenceNumber : pageList[page].sequenceNumber
                subMenuObject[pageList[page].groupName].groupName = pageList[page].groupName;
            }
        }
        return {
            mainMenuObject,
            subMenuObject
        }
    }

    sortMenuAndSubMenuGroupList(mainMenuObject, subMenuObject) {
        mainMenuObject = _.sortBy(mainMenuObject, function (option) { return option.sequence });
        subMenuObject = _.sortBy(subMenuObject, function (option) { return option.sequence });
        let mainMenuSectionList = this.createSectionListDataAndSortPages(mainMenuObject);
        let subMenuSectionList = this.createSectionListDataAndSortPages(subMenuObject);
        return {
            mainMenuSectionList,
            subMenuSectionList
        }
    }

    createSectionListDataAndSortPages(menuObject) {
        let menuList = []
        for (let group in menuObject) {
            let data = _.sortBy(menuObject[group].pageList, function (option) { return option.sequenceNumber })
            let title = menuObject[group].groupName
            menuList.push({ data, title });
        }
        return menuList
    }


}

export let moduleCustomizationService = new ModuleCustomization()