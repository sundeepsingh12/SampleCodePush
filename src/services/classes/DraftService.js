'use strict'
import _ from 'lodash'
import {
    TABLE_DRAFT
} from '../../lib/constants'
import * as realm from '../../repositories/realmdb'

class DraftService {

    saveDraftInDb(formLayoutState, jobMasterId, navigationFormLayoutStates, jobTransaction) {
        let draftObject = this.setFormLayoutObjectForSaving(formLayoutState, jobMasterId, navigationFormLayoutStates, jobTransaction)
        if (draftObject && draftObject.jobTransactionId) {
            realm.save(TABLE_DRAFT, draftObject)
        }
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
            statusName: formLayoutState.statusName,
            referenceNumber: jobTransaction.referenceNumber,
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
        if (jobTransaction.length) {
            let transactionList = jobTransaction.map(transaction => transaction.jobTransactionId)
            realm.deleteRecordList(TABLE_DRAFT, transactionList, 'jobTransactionId')
        } else {
            if (jobTransaction.id < 0 && jobTransaction.jobId < 0) {
                realm.deleteSingleRecord(TABLE_DRAFT, -jobMasterId, 'jobTransactionId')
            } else {
                realm.deleteSingleRecord(TABLE_DRAFT, jobTransaction.id, 'jobTransactionId')
            }
        }
        // let allData = realm.getRecordListOnQuery(TABLE_DRAFT)
        // for (let index in allData) {
        //     let draft = { ...allData[index] }
        //     if (draft) {
        //         console.log('draft records', index, draft)
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