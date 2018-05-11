
import { draftService } from '../classes/DraftService'
import {

} from '../../lib/constants'
import RestAPIFactory from '../../lib/RestAPIFactory'
import * as realm from '../../repositories/realmdb'

describe('test saveDraftInDb', () => {
    it('should save draft in db', () => {
        const formLayoutState = 'test'
        const draftDbObject = 'test'
        realm.save = jest.fn()
        expect(draftService.saveDraftInDb(formLayoutState, 1))
    })
})
describe('test setFormLayoutObjectForSaving', () => {
    it('should return undefined for null form layout state', () => {
        expect(draftService.setFormLayoutObjectForSaving(undefined, 1)).toEqual(undefined)
    })
    it('should return undefined for null form element', () => {
        let formLayoutState = {
            formElement: undefined
        }
        expect(draftService.setFormLayoutObjectForSaving(formLayoutState, 1)).toEqual(undefined)
    })
    it('should return draft object for form element', () => {
        let formElement = {
            1: 'test'
        }
        let formLayoutState = {
            jobTransactionId: 1,
            statusId: 1,
            formElement
        }
        let cloneFormLayout = {
            jobTransactionId: 1,
            statusId: 1,
            formElement: JSON.stringify([...formElement])
        }
        let navigationFormLayoutStates
        let statusIdToFormLayoutMap = {}
        statusIdToFormLayoutMap[formLayoutState.statusId] = cloneFormLayout
        let jobMasterId = 2
        let jobTransaction = {
            id: 1,
            jobMasterId,
            jobId: 1
        }
        let draftObject = {
            jobTransactionId: formLayoutState.jobTransactionId,
            statusId: formLayoutState.statusId,
            formLayoutObject: JSON.stringify(statusIdToFormLayoutMap),
            jobMasterId
        }
        expect(draftService.setFormLayoutObjectForSaving(formLayoutState, jobMasterId, navigationFormLayoutStates, jobTransaction)).toEqual(draftObject)
    })

    it('should return draft object for form element', () => {
        let formElement = {
            1: 'test'
        }
        let formLayoutState = {
            jobTransactionId: 1,
            statusId: 1,
            formElement,
            statusName: 'a'
        }
        let cloneFormLayout = {
            jobTransactionId: 1,
            statusId: 1,
            formElement: JSON.stringify([...formElement]),
            statusName: 'a'
        }
        let navigationFormLayoutStates = {
            1: formLayoutState
        }
        let statusIdToFormLayoutMap = {}
        statusIdToFormLayoutMap[formLayoutState.statusId] = cloneFormLayout
        let jobMasterId = 2
        let jobTransaction = {
            id: 1,
            jobMasterId,
            jobId: 1
        }
        let draftObject = {
            jobTransactionId: formLayoutState.jobTransactionId,
            statusId: formLayoutState.statusId,
            formLayoutObject: JSON.stringify(statusIdToFormLayoutMap),
            jobMasterId,
            navigationFormLayoutStates: JSON.stringify(statusIdToFormLayoutMap),
            statusName: 'a'
        }
        expect(draftService.setFormLayoutObjectForSaving(formLayoutState, jobMasterId, navigationFormLayoutStates, jobTransaction)).toEqual(draftObject)
    })
})

describe('test getDraftFromDb', () => {
    it('should return draft from db for positive job transaction', () => {
        const draft = 'test'
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue(draft)
        expect(draftService.getDraftFromDb(1)).toEqual(draft)
    })
    it('should return draft from db for negative job transaction id', () => {
        const draft = 'test'
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue(draft)
        expect(draftService.getDraftFromDb(-1, 1)).toEqual(draft)
    })
})

describe('test deleteDraftFromDb', () => {
    it('should delete record in db', () => {
        let jobTransaction = {
            id: 1,
            jobId: 1
        }
        realm.deleteSingleRecord = jest.fn()
        expect(draftService.deleteDraftFromDb(jobTransaction, 1))
    })
    it('should delete record in db', () => {

        let jobTransaction = {
            id: -1,
            jobId: -1
        }
        realm.deleteSingleRecord = jest.fn()
        expect(draftService.deleteDraftFromDb(jobTransaction, 1))
    })
})

describe('test convertFormLayoutStateToString', () => {
    it('converts formelement map to string', () => {
        let formElement = new Map()
        formElement.set(1, { value: 1 })
        let formLayoutState = {
            formElement,
            isSaveDisabled: true
        }
        let cloneFormLayoutState = {
            formElement: JSON.stringify([...formLayoutState.formElement]),
            isSaveDisabled: true
        }
        expect(draftService.convertFormLayoutStateToString(formLayoutState)).toEqual(cloneFormLayoutState)
    })
})


describe('test getFormLayoutStateFromDraft', () => {
    it('converts draft formelement from string to map', () => {
        let formElement = new Map()
        formElement.set(1, {
            fieldAttributeMasterId: 1
        })
        let formLayoutState = {
            formElement,
            jobTransactionId: 1,
            statusId: 1
        }
        let formLayoutStateAsString = draftService.convertFormLayoutStateToString(formLayoutState)
        let draftObject = {
            jobTransactionId: 1,
            formLayoutObject: JSON.stringify({ 1: formLayoutStateAsString }),
            statusId: 1,
            navigationFormLayoutStates: null
        }
        let result = {
            formLayoutState,
            navigationFormLayoutStatesForRestore: {}
        }
        expect(draftService.getFormLayoutStateFromDraft(draftObject)).toEqual(result)
    })
    it('converts draft formelement from string to map and sets navigationFormLayoutState', () => {
        let formElement = new Map()
        formElement.set(1, {
            fieldAttributeMasterId: 1
        })
        let formLayoutState = {
            formElement,
            jobTransactionId: 1,
            statusId: 1
        }
        let formLayoutStateAsString = draftService.convertFormLayoutStateToString(formLayoutState)
        let draftObject = {
            jobTransactionId: 1,
            formLayoutObject: JSON.stringify({ 1: formLayoutStateAsString }),
            statusId: 1,
            navigationFormLayoutStates: JSON.stringify({ 1: formLayoutStateAsString }),
        }
        let result = {
            formLayoutState,
            navigationFormLayoutStatesForRestore: { 1: formLayoutState }
        }
        expect(draftService.getFormLayoutStateFromDraft(draftObject)).toEqual(result)
    })
})

describe('test getDraftForState', () => {
    it('gets draft object', () => {
        const draft = { formLayoutObject: {} }
        draftService.getDraftFromDb = jest.fn()
        draftService.getDraftFromDb.mockReturnValue([draft])
        expect(draftService.getDraftForState(1, 1)).toEqual(draft)
    })
})