'use strict'
import _ from 'lodash'
import {

} from '../../lib/AttributeConstants'
import {
    TABLE_DRAFT
} from '../../lib/constants'
import * as realm from '../../repositories/realmdb'

class DraftService {

    saveDraftInDb(formLayoutState, jobMasterId) {
        //  console.log('formLayout state', formLayoutState)
        // if (formLayoutState.jobTransactionId < 0) {
        //     await realm.deleteSingleRecord(TABLE_DRAFT, jobMasterId, 'jobMasterId')
        // }
        let draftObject = this.setFormLayoutObjectForSaving(formLayoutState, jobMasterId)
        if (draftObject) {
            realm.save(TABLE_DRAFT, draftObject)
        }
        // let allData = realm.getAll(TABLE_DRAFT)
        // for (let index in allData) {
        //     let draft = { ...allData[index] }
        //     if (draft) {
        //         console.log('draft records', index, draft)
        //     }
        // }
    }
    setFormLayoutObjectForSaving(formLayoutState, jobMasterId) {
        if (!formLayoutState || !formLayoutState.formElement) return
        let statusIdToFormLayoutMap = {}
        let cloneFormLayoutState = JSON.parse(JSON.stringify(formLayoutState))
        let formElement = formLayoutState.formElement
        let formElementAsArray = JSON.stringify([...formElement])
        cloneFormLayoutState.formElement = formElementAsArray
        statusIdToFormLayoutMap[formLayoutState.statusId] = cloneFormLayoutState
        let draftObject = {
            jobTransactionId: formLayoutState.jobTransactionId,
            statusId: formLayoutState.statusId,
            formLayoutObject: JSON.stringify(statusIdToFormLayoutMap),
            jobMasterId
        }
        return draftObject
    }
    checkIfDraftExistsAndGetStatusId(jobTransactionId, jobMasterId, statusId) {
        let draftDbObject = this.getDraftFromDb(jobTransactionId, jobMasterId, statusId)
        for (let index in draftDbObject) {
            let draft = { ...draftDbObject[index] }
            if (draft.statusId)
                return draft.statusId
        }
    }
    restoreDraftFromDb(jobTransactionId, statusId, jobMasterId) {
        let draftDbObject = this.getDraftFromDb(jobTransactionId, jobMasterId, statusId)
        for (let index in draftDbObject) {
            let draft = { ...draftDbObject[index] }
            if (draft) {
                let statusIdToFormLayoutMap = JSON.parse(draft.formLayoutObject)
                let formLayoutState = statusIdToFormLayoutMap[statusId]
                let formElementAsMap = new Map(JSON.parse(formLayoutState.formElement))
                formLayoutState.formElement = formElementAsMap
                return formLayoutState
            }
        }
    }
    getDraftFromDb(jobTransactionId, jobMasterId, statusId) {
        let draftQuery, draftDbObject
        if (jobTransactionId > 0) {
            draftQuery = `jobTransactionId =  ${jobTransactionId}`
            draftDbObject = realm.getRecordListOnQuery(TABLE_DRAFT, draftQuery)
        } else {
            draftQuery = `jobMasterId =  ${jobMasterId} AND jobTransactionId < 0 AND statusId = ${statusId}`
            draftDbObject = realm.getRecordListOnQuery(TABLE_DRAFT, draftQuery)
        }
        return draftDbObject
    }
    deleteDraftFromDb(jobTransactionId, jobMasterId) {
        realm.deleteSingleRecord(TABLE_DRAFT, jobTransactionId, 'jobTransactionId')
        // let allData = realm.getAll(TABLE_DRAFT)
        // for (let index in allData) {
        //     let draft = { ...allData[index] }
        //     if (draft) {
        //         console.log('draft records', index, draft)
        //     }
        // }
    }
}

export let draftService = new DraftService()