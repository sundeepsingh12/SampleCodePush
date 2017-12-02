'use strict'

import {sortingService} from '../classes/Sorting'
import { restAPI } from '../../lib/RestAPI'

describe('sorting services', () => {
    let data = {
               firstName : 'MANUPRA',
               lastName : 'SINGH',
               jobsInRunsheet : '1',
               jobTransaction : {
               referenceNumber: 'NITESH-1510252533058',
               seqSelected: '1'
               },
               empHubCode : 'udyog12',
               empCode : '25511-manu',
               addressData : undefined
         }
   const referenceNo = 'NITESH-1510252533058';

    it('should get error from server', () => {
        const errorMessage = 'Searching failed, Please try again !'
        try {
            const referenceNo = 'NITESH-1510252533058'
            const token = null
            restAPI.initialize = jest.fn()
            restAPI.serviceCall = jest.fn((data) => {
                return data
            })
            sortingService.getSortingData(referenceNo,token)
        } catch (error) {
            expect(error.message).toEqual(errorMessage)
        }    
    })

    it('should get error from server when ref is not available', () => {
        const erroeMessage = 'Searching failed, Please try again !'
        try {
            const errorData = 'referenceNumber unavailable'
            const referenceNo = null
            const token = 'test1'
            restAPI.initialize = jest.fn()
            restAPI.serviceCall = jest.fn((data) => {
                return data
            })
            sortingService.getSortingData(referenceNo,token)
        } catch (error) {
            expect(error.message).toEqual(erroeMessage)
        }
    })
      it('it should set data for sorting flatlist', () => {
            const sortingList = {
                0:{id: 0, value: "NITESH-1510252533058", label: ""},
                1:{id: 1, value: "MANUPRA SINGH", label: "Name"},
                2:{id: 2, value: "25511-manu/udyog12", label: "Employee Code"},
                3:{id: 3, value: "1/1", label: "Sequence Number"},
                4:{id: 4, value: "N.A"}
               }
           expect(sortingService.setSortingData(data,referenceNo)).toEqual(sortingList)
        });
        it('it should throw error and not set data for flatList', () => {
            const erroeMessage = 'Searching failed, Please try again !'
            try {
                data.jobTransaction = null
                sortingService.setSortingData(data,referenceNo)
            } catch (error) {
                expect(error.message).toEqual(erroeMessage)
            }
        });
       
    
})