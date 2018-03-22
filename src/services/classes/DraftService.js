'use strict'
import _ from 'lodash'
import {
    TABLE_DRAFT
} from '../../lib/constants'
import * as realm from '../../repositories/realmdb'

class DraftService {

    saveDraftInDb(formLayoutState, jobMasterId, navigationFormLayoutStates, jobTransaction) {
        //  console.log('formLayout state', formLayoutState)
        // if (formLayoutState.jobTransactionId < 0) {
        //     await realm.deleteSingleRecord(TABLE_DRAFT, jobMasterId, 'jobMasterId')
        // }
        let draftObject = this.setFormLayoutObjectForSaving(formLayoutState, jobMasterId, navigationFormLayoutStates, jobTransaction)
        if (draftObject && draftObject.jobTransactionId) {
            realm.save(TABLE_DRAFT, draftObject)
        }
        // let allData = realm.getRecordListOnQuery(TABLE_DRAFT)
        // for (let index in allData) {
        //     let draft = { ...allData[index] }
        // }
    }
    setFormLayoutObjectForSaving(formLayoutState, jobMasterId, navigationFormLayoutStates, jobTransaction) {
        if (!formLayoutState || !formLayoutState.formElement) return
        let statusIdToFormLayoutMap = {}
        let navigationFormLayoutStatesForDb = {}
        statusIdToFormLayoutMap[formLayoutState.statusId] = this.convertFormLayoutStateToString(formLayoutState)
        if (navigationFormLayoutStates) {
            for (let index in navigationFormLayoutStates) {
                navigationFormLayoutStatesForDb[navigationFormLayoutStates[index].statusId] = this.convertFormLayoutStateToString(navigationFormLayoutStates[index])
            }
        }
        let draftObject = {
            jobTransactionId: (jobTransaction.id < 0 && jobTransaction.jobId < 0) ? -jobMasterId : formLayoutState.jobTransactionId,
            statusId: formLayoutState.statusId,
            formLayoutObject: JSON.stringify(statusIdToFormLayoutMap),
            jobMasterId,
            navigationFormLayoutStates: JSON.stringify(navigationFormLayoutStatesForDb),
            statusName: formLayoutState.statusName
        }
        let draftObjectCopy = {}
        if (_.isEmpty(navigationFormLayoutStates)) {
            draftObjectCopy = _.omit(draftObject, ['navigationFormLayoutStates'])
            return draftObjectCopy
        }
        return draftObject
    }
    convertFormLayoutStateToString(formLayoutState) {
        let cloneFormLayoutState = JSON.parse(JSON.stringify(formLayoutState))
        let formElement = formLayoutState.formElement
        let formElementAsArray = JSON.stringify([...formElement])
        cloneFormLayoutState.formElement = formElementAsArray
        return cloneFormLayoutState
    }
    getDraftForState(jobTransaction, jobMasterId) {
        let draftDbObject = this.getDraftFromDb(jobTransaction, jobMasterId)
        for (let index in draftDbObject) {
            let draft = { ...draftDbObject[index] }
            return draft
        }
    }
    getDraftFromDb(jobTransaction, jobMasterId) {
        let draftQuery, draftDbObject
        let allData = realm.getRecordListOnQuery(TABLE_DRAFT)
        // for (let index in allData) {
        //     let draft = { ...allData[index] }
        //     console.logs('draft', draft)
        // }
        if (jobMasterId) {
            draftQuery = `jobTransactionId =  ${-jobMasterId}`
            draftDbObject = realm.getRecordListOnQuery(TABLE_DRAFT, draftQuery)
        } else {
            draftQuery = `jobTransactionId =  ${jobTransaction.id}`
            draftDbObject = realm.getRecordListOnQuery(TABLE_DRAFT, draftQuery)
        }
        return draftDbObject
    }

    deleteDraftFromDb(jobTransaction, jobMasterId) {
        if (jobTransaction.id < 0 && jobTransaction.jobId < 0) {
            realm.deleteSingleRecord(TABLE_DRAFT, jobMasterId, 'jobMasterId')
        } else {
            realm.deleteSingleRecord(TABLE_DRAFT, jobTransaction.id, 'jobTransactionId')
        }
        // let allData = realm.getRecordListOnQuery(TABLE_DRAFT)
        // for (let index in allData) {
        //     let draft = { ...allData[index] }
        //     if (draft) {
        //         console.logs('draft records', index, draft)
        //     }
        // }
    }
    getFormLayoutStateFromDraft(draft) {
        let statusIdToFormLayoutMap = JSON.parse(draft.formLayoutObject)
        let formLayoutState = statusIdToFormLayoutMap[draft.statusId]
        let formElementAsMap = new Map(JSON.parse(formLayoutState.formElement))
        formLayoutState.formElement = formElementAsMap
        let navigationFormLayoutStates = {}, navigationFormLayoutStatesForRestore = {}
        navigationFormLayoutStates = JSON.parse(draft.navigationFormLayoutStates)
        for (let index in navigationFormLayoutStates) {
            let formLayout = navigationFormLayoutStates[index]
            let formElementAsMap = new Map(JSON.parse(formLayout.formElement))
            formLayout.formElement = formElementAsMap
            navigationFormLayoutStatesForRestore[navigationFormLayoutStates[index].statusId] = formLayout
        }
        return { formLayoutState, navigationFormLayoutStatesForRestore }
    }
}

export let draftService = new DraftService()