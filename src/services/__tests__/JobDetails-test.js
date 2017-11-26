'use strict'

import { jobDetailsService } from '../classes/JobDetails'
import { jobTransactionService } from '../classes/JobTransaction'
import * as realm from '../../repositories/realmdb'


describe('test cases for prepareDataObject', () => {
    const realmDBDataList = [
        {
            id: 0,
            jobAttributeMasterId: 1,
            jobId: 1,
            parentId: 0,
            positionId: 1,
            value: 'xyz',
        },
        {
            id: 0,
            jobAttributeMasterId: 2,
            jobId: 1,
            parentId: 0,
            positionId: 2,
            value: 91727217123,
        },
        {
            id: 0,
            jobAttributeMasterId: 3,
            jobId: 1,
            parentId: 0,
            positionId: 3,
            value: 62,
        },
        {
            id: 0,
            jobAttributeMasterId: 4,
            jobId: 1,
            parentId: 0,
            positionId: 4,
            value: 'address line 1',
        },
        {
            id: 0,
            jobAttributeMasterId: 5,
            jobId: 1,
            parentId: 0,
            positionId: 5,
            value: 'abc',
        },
        {
            id: 0,
            jobAttributeMasterId: 6,
            jobId: 1,
            parentId: 0,
            positionId: 6,
            value: 'ArraySarojFareye',
        },
        {
            id: 0,
            jobAttributeMasterId: 7,
            jobId: 1,
            parentId: 6,
            positionId: 7,
            value: 'ObjectSarojFareye',
        },
        {
            id: 0,
            jobAttributeMasterId: 8,
            jobId: 1,
            parentId: 7,
            positionId: 8,
            value: 'test11',
        },
        {
            id: 0,
            jobAttributeMasterId: 9,
            jobId: 1,
            parentId: 7,
            positionId: 9,
            value: 'test12',
        },
        {
            id: 0,
            jobAttributeMasterId: 10,
            jobId: 1,
            parentId: 7,
            positionId: 10,
            value: 'test13',
        },
        {
            id: 0,
            jobAttributeMasterId: 7,
            jobId: 1,
            parentId: 6,
            positionId: 11,
            value: 'ObjectSarojFareye',
        },
        {
            id: 0,
            jobAttributeMasterId: 8,
            jobId: 1,
            parentId: 11,
            positionId: 12,
            value: 'test21',
        },
        {
            id: 0,
            jobAttributeMasterId: 9,
            jobId: 1,
            parentId: 11,
            positionId: 13,
            value: 'test22',
        },
        {
            id: 0,
            jobAttributeMasterId: 10,
            jobId: 1,
            parentId: 11,
            positionId: 14,
            value: 'test23',
        },
    ]

    const attributeMasterMap = {
        1: {
            attributeTypeId: 1,
            hidden: false,
            id: 1,
            label: 'name',
        },
        2: {
            attributeTypeId,
            hidden: false,
            id: 2,
            label: 'number',
        },
        3: {
            attributeTypeId,
            hidden: true,
            id: 3,
            label: 'num',
        },
        4: {
            attributeTypeId,
            hidden: false,
            id: 4,
            label: 'address',
        },
        5: {
            attributeTypeId,
            hidden: true,
            id: 5,
            label: 'text',
        },
        6: {
            attributeTypeId,
            hidden: false,
            id: 6,
            label: 'array',
        },
        7: {
            attributeTypeId,
            hidden: false,
            id: 7,
            label: 'object',
        },
        8: {
            attributeTypeId,
            hidden: false,
            id: 8,
            label: 'text1',
        },
        9: {
            attributeTypeId,
            hidden: true,
            id: 9,
            label: 'text2',
        },
        10: {
            attributeTypeId,
            hidden: false,
            id: 10,
            label: 'text3',
        }
    }
    it('should return empty data list fo rempty data', () => {

    })
})


describe('test cases for checkEnableRestriction', () => {
    const jobMasterList = {
        value: [
            {
                id: 441,
                enableLocationMismatch: false,
                enableManualBroadcast: false,
                enableMultipartAssignment: false,
                enableOutForDelivery: false,
                enableResequenceRestriction: true
            },
            {
                id: 442,
                enableLocationMismatch: false,
                enableManualBroadcast: false,
                enableMultipartAssignment: false,
                enableOutForDelivery: false,
                enableResequenceRestriction: false
            }
        ]
    }

    const tabId = 251
    const seqSelected = 2
    const statusList = {
        value: [
            {
                code: "Success123",
                id: 2416,
                jobMasterId: 441,
                name: "Success",
                saveActivated: null,
                sequence: 3,
                statusCategory: 3,
                tabId: 251,
                transient: false,
            },
            {
                code: "UNSEEN",
                id: 1999,
                jobMasterId: 441,
                name: "Unseen",
                saveActivated: null,
                sequence: 23,
                statusCategory: 1,
                tabId: 251,
                transient: false,
            },
            {
                code: "PENDING",
                id: 1998,
                jobMasterId: 441,
                name: "Pending12",
                saveActivated: null,
                sequence: 23,
                statusCategory: 1,
                tabId: 251,
                transient: false,
            }
        ]
    }
    let firstEnableSequenceValue = 2
    it('should check enable resequence if sequence is before', () => {
        jobTransactionService.getFirstTransactionWithEnableSequence = jest.fn()
        jobTransactionService.getFirstTransactionWithEnableSequence.mockReturnValue(firstEnableSequenceValue)
        expect(jobDetailsService.checkEnableResequence(jobMasterList,tabId,seqSelected,statusList)).toEqual(true)
    })

    it('should check enable resequence if sequence is after', () => {
        firstEnableSequenceValue = 1
        jobTransactionService.getFirstTransactionWithEnableSequence = jest.fn()
        jobTransactionService.getFirstTransactionWithEnableSequence.mockReturnValue(firstEnableSequenceValue)
        expect(jobDetailsService.checkEnableResequence(jobMasterList,tabId,seqSelected,statusList)).toEqual(false)
    })
})

describe('test cases for check Latitude and longitude', () => {
    const angle  = "28.2554334",radianValue = 0.493150344407976
    let jobTransaction = {
        id: 4294602,
        latitude: 28.55542,
        longitude: 77.267463
    }
    let jobId = 3447,userLat="28.5551",userLong="77.26751"
     it('should convert angle to radians', () => {
       expect(jobDetailsService.toRadians(angle)).toEqual(radianValue)
     })
     it('should find aerial distance between user and job location', () => {
         const  dist  = 0.03587552758583335
       expect(jobDetailsService.distance(jobTransaction.latitude,jobTransaction.longitude,userLat,userLong)).toEqual(dist)
     })

     it('should check aerial distance between user and job location and return false', () => {
        realm.getRecordListOnQuery = jest.fn()
        userLat = null
        realm.getRecordListOnQuery.mockReturnValue(jobTransaction)
      expect(jobDetailsService.checkLatLong(jobId,userLat,userLong)).toEqual(false)
    })

    it('should not check aerial distance between user and job location', () => {
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue([{
            id: 4294602,
            latitude: 28.55542,
            longitude: 77.267463
        }])
        expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(0)
    })
   })