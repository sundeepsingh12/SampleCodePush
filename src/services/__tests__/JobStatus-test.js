import {
  JOB_STATUS
} from '../../lib/constants'

import {
  keyValueDBService
} from '../classes/KeyValueDBService'

import {
  jobStatusService
} from '../classes/JobStatus'


describe('test cases for getAllIdsForCode', () => {

  it('should fetch job status ids from store ', () => {
    const jobStatusIds = [12],
      statusCode = 'UNSEEN'
    keyValueDBService.getValueFromStore = jest.fn()
    keyValueDBService.getValueFromStore.mockReturnValueOnce({
      value: [{
        id: 12,
        code: 'UNSEEN'
      }, {
        id: 13,
        code: 'PENDING'
      }]
    })
    return jobStatusService.getAllIdsForCode(statusCode).then(data => {
      expect(data).toEqual(jobStatusIds)
    })
  })

  it('should not fetch jobStatus ids', () => {
    const statusCode = 'UNSEEN'
    const message = 'Job status missing in store'
    keyValueDBService.getValueFromStore = jest.fn()
    keyValueDBService.getValueFromStore.mockReturnValue(null)

    return jobStatusService.getAllIdsForCode(statusCode).catch(error => {
      expect(error.message).toEqual(message)
    })

  })
})

describe('test cases for getStatusIdForJobMasterIdAndCode', () => {

  it('should get statusId on basis of job master and a code', () => {
    const jobStatusId = 12,
      statusCode = 'UNSEEN',
      jobMasterId = 930
    keyValueDBService.getValueFromStore = jest.fn()
    keyValueDBService.getValueFromStore.mockReturnValueOnce({
      value: [{
        id: 12,
        code: 'UNSEEN',
        jobMasterId: 930
      }, {
        id: 13,
        code: 'PENDING',
        jobMasterId: 930
      }]
    })
    return jobStatusService.getStatusIdForJobMasterIdAndCode(jobMasterId, statusCode).then(data => {
      expect(data).toEqual(jobStatusId)
    })
  })

  it('should not get status id', () => {
    const message = 'Job status missing in store'
    const jobStatusId = 12,
      statusCode = 'UNSEEN',
      jobMasterId = 930
    keyValueDBService.getValueFromStore = jest.fn()
    keyValueDBService.getValueFromStore.mockReturnValue(null)
    return jobStatusService.getStatusIdForJobMasterIdAndCode(jobMasterId, statusCode).catch(error => {
      expect(error.message).toEqual(message)
    })

  })
})

it('should return jobMasterId vs jobStatusIdMap', () => {
  const jobMasterIdJobStatusIdMap = {
    930: 12,
    897: 14
  },
    statusCode = 'UNSEEN',
    jobMasterIdList = [930, 897]
  keyValueDBService.getValueFromStore = jest.fn()
  keyValueDBService.getValueFromStore.mockReturnValueOnce({
    value: [{
      id: 12,
      code: 'UNSEEN',
      jobMasterId: 930
    }, {
      id: 13,
      code: 'PENDING',
      jobMasterId: 930
    }, {
      id: 14,
      code: 'UNSEEN',
      jobMasterId: 897
    }]
  })
  return jobStatusService.getjobMasterIdStatusIdMap(jobMasterIdList, statusCode).then(data => {
    expect(data).toEqual(jobMasterIdJobStatusIdMap)
  })
})

describe('test cases for getJobMasterIdStatusIdMap', () => {
  const jobAttributeStatusMap = {
    1: {
      10: {
        jobAttributeId: 10
      }
    },
    2: {
      10: {
        jobAttributeId: 10
      }
    },
    3: {
      10: {
        jobAttributeId: 10
      }
    },
    4: {
      10: {
        jobAttributeId: 10
      }
    },
    5: {
      10: {
        jobAttributeId: 10
      }
    }
  }
  const statusList = [{
    id: 1,
    jobMasterId: 1,
    nextStatusList: []
  },
  {
    id: 2,
    jobMasterId: 1,
  },
  {
    id: 3,
    jobMasterId: 2,
    nextStatusList: [{
      id: 4,
      jobMasterId: 2,
      nextStatusList: []
    }]
  },
  {
    id: 4,
    jobMasterId: 2,
    nextStatusList: []
  },
  {
    id: 5,
    jobMasterId: 2,
  }
  ]

  const jobMasterIdJobAttributeStatusMap = {
    1: {
      1: {
        10: {
          jobAttributeId: 10
        }
      },
      2: {
        10: {
          jobAttributeId: 10
        }
      }
    },
    2: {
      3: {
        10: {
          jobAttributeId: 10
        }
      },
      4: {
        10: {
          jobAttributeId: 10
        }
      },
      5: {
        10: {
          jobAttributeId: 10
        }
      }
    }
  }

  const statusIdStatusMap = {
    1: {
      id: 1,
      jobMasterId: 1,
      nextStatusList: []
    },
    2: {
      id: 2,
      jobMasterId: 1,
    },
    3: {
      id: 3,
      jobMasterId: 2,
      nextStatusList: [{
        id: 4,
        jobMasterId: 2,
        nextStatusList: []
      }]
    },
    4: {
      id: 4,
      jobMasterId: 2,
      nextStatusList: []
    },
    5: {
      id: 5,
      jobMasterId: 2,
    }
  }

  it('should return empty jobMasterIdJobAttributeStatusMap and empty statusIdNextStatusMap for undefined statusList', () => {
    expect(jobStatusService.getJobMasterIdStatusIdMap(undefined, {})).toEqual({
      jobMasterIdJobAttributeStatusMap: {},
      statusIdStatusMap: {}
    })
  })

  it('should return empty jobMasterIdJobAttributeStatusMap and statusIdNextStatusMap for statusList and empty jobAttributeStatusMap', () => {
    expect(jobStatusService.getJobMasterIdStatusIdMap(statusList, {})).toEqual({
      jobMasterIdJobAttributeStatusMap: {},
      statusIdStatusMap
    })
  })

  it('should return empty jobMasterIdJobAttributeStatusMap and statusIdNextStatusMap for statusList and jobAttributeStatusMap', () => {
    expect(jobStatusService.getJobMasterIdStatusIdMap(statusList, jobAttributeStatusMap)).toEqual({
      jobMasterIdJobAttributeStatusMap,
      statusIdStatusMap
    })
  })

})

describe('test cases for getNonUnseenStatusIdsForStatusCategory', () => {

  it('should throw error job status missing', () => {
    const statusCtegory = 1
    const message = 'Job status missing in store'
    keyValueDBService.getValueFromStore = jest.fn()
    keyValueDBService.getValueFromStore.mockReturnValue(null)
    return jobStatusService.getNonUnseenStatusIdsForStatusCategory(statusCtegory).catch(error => {
      expect(error.message).toEqual(message)
    })
  })

  it('should return status ids', () => {
    const statusCategory = 1
    keyValueDBService.getValueFromStore = jest.fn()
    keyValueDBService.getValueFromStore.mockReturnValue({
      value: [{
        id: 1,
        code: 'UNSEEN',
        statusCategory: 1
      }, {
        id: 1,
        code: 'PENDING',
        statusCategory: 2
      }, {
        id: 1,
        code: 'PENDING',
        statusCategory: 1
      }]
    })
    const filteredIds = [1]
    return jobStatusService.getNonUnseenStatusIdsForStatusCategory(statusCategory).then(data => {
      expect(data).toEqual(filteredIds)
    })
  })

})

describe('test cases for getStatusForJobMasterIdAndCode', () => {
  beforeEach(() => {
    keyValueDBService.getValueFromStore = jest.fn()
  })

  const jobMasterId = 1
  const jobStatusCode = 'UNSEEN'
  it('should return job status for jobMasterId and jobStatusCode', () => {
    keyValueDBService.getValueFromStore.mockReturnValue({
      value: [
        {
          id: 123,
          jobMasterId: 1,
          code: 'UNSEEN'
        },
        {
          id: 124,
          jobMasterId: 1,
          code: 'DEL'
        },
        {
          id: 125,
          jobMasterId: 1,
          code: 'PENDING'
        }
      ]
    })
    let jobStatus = {
      id: 123,
      jobMasterId: 1,
      code: 'UNSEEN'
    }
    return jobStatusService.getStatusForJobMasterIdAndCode(jobMasterId, jobStatusCode)
      .then((data) => {
        expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
        expect(data).toEqual(jobStatus)
      })
  })

  it('should return error for job status missing', () => {
    keyValueDBService.getValueFromStore.mockReturnValue(null)
    return jobStatusService.getStatusForJobMasterIdAndCode(jobMasterId, jobStatusCode)
      .catch((error) => {
        expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
        expect(error.message).toEqual('Job status missing in store')
      })
  })

  it('should return undefined for not containing job status', () => {
    keyValueDBService.getValueFromStore.mockReturnValue({
      value: [
        {
          id: 123,
          jobMasterId: 1,
          code: 'FAIL'
        },
        {
          id: 124,
          jobMasterId: 1,
          code: 'DEL'
        },
        {
          id: 125,
          jobMasterId: 1,
          code: 'PENDING'
        }
      ]
    })
    return jobStatusService.getStatusForJobMasterIdAndCode(jobMasterId, jobStatusCode)
      .then((data) => {
        expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
        expect(data).toEqual(undefined)
      })
  })
})