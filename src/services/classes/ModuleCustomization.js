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