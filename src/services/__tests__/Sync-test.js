import {
  sync
} from '../classes/Sync'

import {
  keyValueDBService
} from '../classes/KeyValueDBService'
import {
  restAPI
} from '../../lib/RestAPI'

import {
  jobSummaryService
} from '../classes/JobSummary'

import * as realm from '../../repositories/realmdb'

describe('test sync services', () => {

  it('should get sync ids', () => {
    const content = [{
      id: 23,
      companyId: 295,
      type: 'insert'
    }, {
      id: 24,
      companyId: 295,
      type: 'update'
    }]
    const syncIds = [23, 24]
    expect(sync.getSyncIdFromResponse(content)).toEqual(syncIds)
  })

  it('should get summary and transactionIdDTos', () => {

    const jobMasterIdJobStatusIdTransactionIdDtoMap = {
      930: {
        4814: {
          jobMasterId: 930,
          pendingStatusId: 4813,
          transactionId: "2560784",
          unSeenStatusId: 4814
        }
      }
    }

    const dataList = {
      jobSummaries: [{
        cityId: 744,
        companyId: 295,
        count: 0,
        date: "2017-06-19 00:00:00",
        hubId: 2757,
        id: 2229406,
        jobMasterId: 930,
        jobStatusId: 4814,
        userId: 4954
      }, {
        cityId: 744,
        companyId: 295,
        count: 1,
        date: "2017-06-19 00:00:00",
        hubId: 2757,
        id: 2229894,
        jobMasterId: 930,
        jobStatusId: 4813,
        userId: 4954
      }],
      transactionIdDtos: [{
        jobMasterId: 930,
        pendingStatusId: 4813,
        transactionId: "2560784",
        unSeenStatusId: 4814
      }]
    }
    jobSummaryService.getJobSummaryData = jest.fn()
    jobSummaryService.getJobSummaryData.mockReturnValueOnce({
      cityId: 744,
      companyId: 295,
      count: 0,
      date: "2017-06-19 00:00:00",
      hubId: 2757,
      id: 2229406,
      jobMasterId: 930,
      jobStatusId: 4814,
      userId: 4954
    }).mockReturnValueOnce({
      cityId: 744,
      companyId: 295,
      count: 0,
      date: "2017-06-19 00:00:00",
      hubId: 2757,
      id: 2229894,
      jobMasterId: 930,
      jobStatusId: 4813,
      userId: 4954
    })
    return sync.getSummaryAndTransactionIdDTO(jobMasterIdJobStatusIdTransactionIdDtoMap).then(data => {
      expect(data).toEqual(dataList)
      expect(jobSummaryService.getJobSummaryData).toHaveBeenCalledTimes(2)
    })
  })

  it('should not delete data from server and throw error', () => {
    const message = 'Token Missing'
    try {
      keyValueDBService.getValueFromStore = jest.fn()
      keyValueDBService.getValueFromStore.mockReturnValue(null)
      const syncIds = [],
        messageIdDTOs = [],
        transactionIdDTOs = [],
        jobSummaries = []
      sync.deleteDataFromServer(syncIds, messageIdDTOs, transactionIdDTOs, jobSummaries)
    } catch (error) {
      expect(error.message).toEqual(message)
    }
  })

  it('should delete data from server', () => {
    const syncIds = [1234],
      messageIdDTOs = [],
      transactionIdDTOs = [{
        jobMasterId: 930
      }],
      jobSummaries = [{
        "jobMasterId": 930
      }]
    keyValueDBService.getValueFromStore = jest.fn()
    keyValueDBService.getValueFromStore.mockReturnValueOnce({
      value: 'testtoken'
    })
    restAPI.initialize = jest.fn()
    restAPI.serviceCall = jest.fn((data) => {
      return "Success"
    })
    return sync.deleteDataFromServer(syncIds, messageIdDTOs, transactionIdDTOs, jobSummaries).then(data => {
      expect(data).toEqual("Success")
      expect(restAPI.initialize).toHaveBeenCalledTimes(1)
      expect(restAPI.serviceCall).toHaveBeenCalledTimes(1)
    })

  })

  it('should not download data from server and throw token error', () => {
    const message = 'Token Missing'
    try {
      keyValueDBService.getValueFromStore = jest.fn()
      keyValueDBService.getValueFromStore.mockReturnValue(null)
      sync.downloadDataFromServer()
    } catch (error) {
      expect(error.message).toEqual(message)
    }
  })

  it('should not download data from server and throw user missing error', () => {
    const message = 'Value of user missing'
    try {
      keyValueDBService.getValueFromStore = jest.fn()
      keyValueDBService.getValueFromStore.mockReturnValue({
        value: 'testtoken'
      })
      keyValueDBService.getValueFromStore = jest.fn()
      keyValueDBService.getValueFromStore.mockReturnValue(null)
      sync.downloadDataFromServer(0, 3)
    } catch (error) {
      expect(error.message).toEqual(message)
    }
  })

  it('should save data from server in Realm', async () => {
    const query = {
      "job": [{
        "id": 12
      }],
      "jobTransactions": [{
        "id": 13
      }],
      "jobData": [{
        "id": 23
      }],
      "fieldData": [ ],
      "runSheet": [{
        "id": 1
      }]
    }
    expect.assertions(1);
    realm.performBatchSave = jest.fn()
    let response = await sync.saveDataFromServerInDB(JSON.stringify(query));
    expect(realm.performBatchSave).toHaveBeenCalledTimes(1)
  })

  it('should update data in Db', async () => {
    const query = {
      "job": [{
        "id": 12
      }],
      "jobTransactions": [{
        "id": 13
      }],
      "jobData": [{
        "id": 23
      }],
      "fieldData": [ ],
      "runSheet": [{
        id: 1
      }]
    }
    realm.deleteRecordsInBatch = jest.fn()
    sync.saveDataFromServerInDB = jest.fn()
    await sync.updateDataInDB(JSON.stringify(query))
    expect(realm.deleteRecordsInBatch).toHaveBeenCalledTimes(1)
    expect(sync.saveDataFromServerInDB).toHaveBeenCalledTimes(1)
  })

})


  it('should process tdc response for insert query type', () => {
    const tdcContentArray = [{
      "id": 2326388,
      "userId": 4954,
      "type": "insert",
      "query": {
        "job": [

        ],
        "jobTransactions": [

        ],
        "jobData": [

        ],
        "fieldData": [

        ],
        "runSheet": [

        ]
      }
    }]

    sync.updateDataInDB = jest.fn()
    sync.saveDataFromServerInDB = jest.fn()
    sync.processTdcResponse(tdcContentArray)
    expect(sync.saveDataFromServerInDB).toHaveBeenCalledTimes(1)
    expect(sync.updateDataInDB).not.toHaveBeenCalled()
  })

  it('should process tdc response for update query type', () => {
    const tdcContentArray = [{
      "id": 2326388,
      "userId": 4954,
      "type": "update",
      "query": {
        "job": [

        ],
        "jobTransactions": [

        ],
        "jobData": [

        ],
        "fieldData": [

        ],
        "runSheet": [

        ]
      }
    }]

    sync.updateDataInDB = jest.fn()
    sync.saveDataFromServerInDB = jest.fn()

    sync.processTdcResponse(tdcContentArray)
    expect(sync.updateDataInDB).toHaveBeenCalledTimes(1)
    expect(sync.saveDataFromServerInDB).not.toHaveBeenCalled()
  })
