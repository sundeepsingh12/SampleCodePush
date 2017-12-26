
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
    it('should return undefined for null form element', () => {
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
        let statusIdToFormLayoutMap = {}
        statusIdToFormLayoutMap[formLayoutState.statusId] = cloneFormLayout
        let jobMasterId = 2
        let draftObject = {
            jobTransactionId: formLayoutState.jobTransactionId,
            statusId: formLayoutState.statusId,
            formLayoutObject: JSON.stringify(statusIdToFormLayoutMap),
            jobMasterId
        }
        expect(draftService.setFormLayoutObjectForSaving(formLayoutState, jobMasterId)).toEqual(draftObject)
    })
})

describe('test checkIfDraftExistsAndGetStatusId', () => {
    it('should return undefined for no drafts in db', () => {
        draftService.getDraftFromDb = jest.fn()
        draftService.getDraftFromDb.mockReturnValue(null)
        expect(draftService.checkIfDraftExistsAndGetStatusId(1, 1, 1, false, null)).toEqual(undefined)
    })
    it('should return status id', () => {
        let draftDb = [{
            jobTransactionId: 1,
            statusId: 1,
            formElement: {}
        }]
        draftService.getDraftFromDb = jest.fn()
        draftService.getDraftFromDb.mockReturnValue(draftDb)
        expect(draftService.checkIfDraftExistsAndGetStatusId(1, 1, 1, false, null)).toEqual(1)
    })
    it('should return undefined for null status list', () => {
        let draftDb = [{
            jobTransactionId: 1,
            statusId: 1,
            formElement: {}
        }]
        draftService.getDraftFromDb = jest.fn()
        draftService.getDraftFromDb.mockReturnValue(draftDb)
        expect(draftService.checkIfDraftExistsAndGetStatusId(1, 1, 1, true, null)).toEqual(undefined)
    })
    it('should return undefined for empty status list', () => {
        let draftDb = [{
            jobTransactionId: 1,
            statusId: 1,
            formElement: {}
        }]
        draftService.getDraftFromDb = jest.fn()
        draftService.getDraftFromDb.mockReturnValue(draftDb)
        expect(draftService.checkIfDraftExistsAndGetStatusId(1, 1, 1, true, [])).toEqual(undefined)
    })
    it('should return undefined for empty status list', () => {
        const statusList = { value: [] }
        let draftDb = [{
            jobTransactionId: 1,
            statusId: 1,
            formElement: {}
        }]
        draftService.getDraftFromDb = jest.fn()
        draftService.getDraftFromDb.mockReturnValue(draftDb)
        expect(draftService.checkIfDraftExistsAndGetStatusId(1, 1, 1, true, statusList)).toEqual(undefined)
    })
    it('should return status id and name', () => {
        const statusList = {
            value: [
                {
                    name: 'delivered',
                    id: 1
                }
            ]
        }
        let draftDb = [{
            jobTransactionId: 1,
            statusId: 1,
            formElement: {}
        }]
        draftService.getDraftFromDb = jest.fn()
        draftService.getDraftFromDb.mockReturnValue(draftDb)
        expect(draftService.checkIfDraftExistsAndGetStatusId(1, 1, 1, true, statusList)).toEqual({

            name: 'delivered',
            id: 1

        })
    })
})

describe('test restoreDraftFromDb', () => {
    it('should return undefined for no drafts in db', () => {
        draftService.getDraftFromDb = jest.fn()
        draftService.getDraftFromDb.mockReturnValue(null)
        expect(draftService.restoreDraftFromDb(1, 1, 1)).toEqual(undefined)
    })
    it('should return draft object', () => {
        let formElement = new Map()
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
        let statusIdToFormLayoutMap = {}
        statusIdToFormLayoutMap[formLayoutState.statusId] = cloneFormLayout
        let jobMasterId = 2
        let draftObject = {
            jobTransactionId: formLayoutState.jobTransactionId,
            statusId: formLayoutState.statusId,
            formLayoutObject: JSON.stringify(statusIdToFormLayoutMap),
            jobMasterId
        }
        let draftDb = [
            draftObject
        ]
        draftService.getDraftFromDb = jest.fn()
        draftService.getDraftFromDb.mockReturnValue(draftDb)
        expect(draftService.restoreDraftFromDb(1, 1, 1)).toEqual(formLayoutState)
    })
})
// describe('test getDraftFromDb', () => {
//     it('should return draft from db for positive job transaction', () => {
//         const draft = 'test'
//         realm.getRecordListOnQuery = jest.fn()
//         realm.getRecordListOnQuery.mockReturnValue(draft)
//         expect(draftService.getDraftFromDb(1, 1, 1)).toEqual(draft)
//     })
//     it('should return draft from db for negative job transaction id', () => {
//         const draft = 'test'
//         realm.getRecordListOnQuery = jest.fn()
//         realm.getRecordListOnQuery.mockReturnValue(draft)
//         expect(draftService.getDraftFromDb(-1, 1, 1)).toEqual(draft)
//     })
// })
describe('test deleteDraftFromDb', () => {
    it('should delete record in db', () => {

        realm.deleteSingleRecord = jest.fn()
        //realm.getRecordListOnQuery.mockReturnValue(draft)
        expect(draftService.deleteDraftFromDb(1, 1))
    })
})