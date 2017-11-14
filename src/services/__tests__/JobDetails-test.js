'use strict'

import { jobDetailsService } from '../classes/JobDetails'

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

describe('test cases for check Latitude and longitude', () => {
    const angle  = "28.2554334",radianValue = 0.493150344407976
    let jobLat = "28.555",jobLong="77.2675",userLat="28.5551",userLong="77.26751"
     it('should convert angle to radians', () => {
       expect(jobDetailsService.toRadians(angle)).toEqual(radianValue)
     })
     it('should find aerial distance between user and job location', () => {
         const  dist  = 0.011161528835910397
       expect(jobDetailsService.distance(jobLat,jobLong,userLat,userLong)).toEqual(dist)
     })

     it('should check aerial distance between user and job location and return false', () => {
        jobLat = null
      expect(jobDetailsService.checkLatLong(jobLat,jobLong,userLat,userLong)).toEqual(false)
    })

    it('should check aerial distance between user and job location and return true', () => {
        jobLat = "30.3143"
      expect(jobDetailsService.checkLatLong(jobLat,jobLong,userLat,userLong)).toEqual(true)
    })
    it('should check aerial distance between user and job location and return false', () => {
        jobLat = "28.555"
      expect(jobDetailsService.checkLatLong(jobLat,jobLong,userLat,userLong)).toEqual(false)
    })
   })