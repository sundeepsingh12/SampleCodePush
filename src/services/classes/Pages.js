'use strict'

class Pages {

    getJobMasterIdListForScreenTypeId(pagesList, screenTypeId) {
        let jobMasterIdList = []
        for (let page in pagesList) {
            if (pagesList[page].screenTypeId == screenTypeId) {
                jobMasterIdList.push(JSON.parse(pagesList[page].jobMasterIds)[0])
            }
        }
        return jobMasterIdList
    }
}

export let pages = new Pages()