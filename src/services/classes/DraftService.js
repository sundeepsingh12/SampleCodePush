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
        statusIdToFormLayoutMap[formLayoutState.statusId] = formLayoutState
        if (navigationFormLayoutStates) {
            for (let index in navigationFormLayoutStates) {
                navigationFormLayoutStatesForDb[navigationFormLayoutStates[index].statusId] = navigationFormLayoutStates[index]
            }
        }
        let draftObject = {
            jobTransactionId: (jobTransaction.id < 0 && jobTransaction.jobId < 0) ? -jobMasterId : jobTransaction.id,
            statusId: formLayoutState.statusId,
            referenceNumber: jobTransaction.referenceNumber,
            formLayoutObject: JSON.stringify(statusIdToFormLayoutMap),
            jobMasterId,
            navigationFormLayoutStates: JSON.stringify(navigationFormLayoutStatesForDb),
            statusName: formLayoutState.statusName,
        }
        let draftObjectCopy = {}
        if (_.isEmpty(navigationFormLayoutStates)) {
            draftObjectCopy = _.omit(draftObject, ['navigationFormLayoutStates'])
            return draftObjectCopy
        }
        return draftObject
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
    }
    getFormLayoutStateFromDraft(draft) {
        let statusIdToFormLayoutMap = JSON.parse(draft.formLayoutObject)
        let formLayoutState = statusIdToFormLayoutMap[draft.statusId]
        let navigationFormLayoutStates = {}, navigationFormLayoutStatesForRestore = {}
        navigationFormLayoutStates = JSON.parse(draft.navigationFormLayoutStates)
        for (let index in navigationFormLayoutStates) {
            navigationFormLayoutStatesForRestore[navigationFormLayoutStates[index].statusId] = navigationFormLayoutStates[index]
        }
        return { formLayoutState, navigationFormLayoutStatesForRestore }
    }
}

export let draftService = new DraftService()