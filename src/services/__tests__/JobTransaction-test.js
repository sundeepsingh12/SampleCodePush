'use strict'
import { jobTransactionService } from '../classes/JobTransaction'
import { jobStatusService } from '../classes/JobStatus'
import { jobAttributeMasterService } from '../classes/JobAttributeMaster'
import { jobService } from '../classes/Job'
import { jobDataService } from '../classes/JobData'
import { fieldDataService } from '../classes/FieldData'
import { customerCareService } from '../classes/CustomerCare'
import { smsTemplateService } from '../classes/SMSTemplate'

import * as realm from '../../repositories/realmdb'

describe('test cases for getJobTransactionMapAndQuery', () => {

  it('should return jobTransaction map and query for job,job data ,field data table', () => {
    const jobTransactionList = [
      {
        id: '1',
        jobId: '1',
        jobMasterId: 1,
        jobStatusId: 1,
        referenceNumber: 'xyz',
        runsheetNo: 'xyz',
        seqSelected: 1,
        trackCallCount: 1,
        trackCallDuration: 1,
        trackHalt: 2,
        trackKm: 1,
        trackSmsCount: 1,
        trackTransactionTimeSpent: 1,
      },
      {
        id: '2',
        jobId: '2',
        jobMasterId: 1,
        jobStatusId: 1,
        referenceNumber: 'xyz',
        runsheetNo: 'xyz',
        seqSelected: 1,
        trackCallCount: 1,
        trackCallDuration: 1,
        trackHalt: 2,
        trackKm: 1,
        trackSmsCount: 1,
        trackTransactionTimeSpent: 1,
      },
      {
        id: '3',
        jobId: '4',
        jobMasterId: 1,
        jobStatusId: 1,
        referenceNumber: 'xyz',
        runsheetNo: 'xyz',
        seqSelected: 1,
        trackCallCount: 1,
        trackCallDuration: 1,
        trackHalt: 2,
        trackKm: 1,
        trackSmsCount: 1,
        trackTransactionTimeSpent: 1,
      },
      {
        id: '6',
        jobId: '10',
        jobMasterId: 1,
        jobStatusId: 1,
        referenceNumber: 'xyz',
        runsheetNo: 'xyz',
        seqSelected: 1,
        trackCallCount: 1,
        trackCallDuration: 1,
        trackHalt: 2,
        trackKm: 1,
        trackSmsCount: 1,
        trackTransactionTimeSpent: 1,
      }
    ]

    const jobTransactionMap = {
      1: {
        id: '1',
        jobId: '1',
        jobMasterId: 1,
        jobStatusId: 1,
        referenceNumber: 'xyz',
        runsheetNo: 'xyz',
        seqSelected: 1,
        trackCallCount: 1,
        trackCallDuration: 1,
        trackHalt: 2,
        trackKm: 1,
        trackSmsCount: 1,
        trackTransactionTimeSpent: 1,
      },
      2: {
        id: '2',
        jobId: '2',
        jobMasterId: 1,
        jobStatusId: 1,
        referenceNumber: 'xyz',
        runsheetNo: 'xyz',
        seqSelected: 1,
        trackCallCount: 1,
        trackCallDuration: 1,
        trackHalt: 2,
        trackKm: 1,
        trackSmsCount: 1,
        trackTransactionTimeSpent: 1,
      },
      3: {
        id: '3',
        jobId: '4',
        jobMasterId: 1,
        jobStatusId: 1,
        referenceNumber: 'xyz',
        runsheetNo: 'xyz',
        seqSelected: 1,
        trackCallCount: 1,
        trackCallDuration: 1,
        trackHalt: 2,
        trackKm: 1,
        trackSmsCount: 1,
        trackTransactionTimeSpent: 1,
      },
      6: {
        id: '6',
        jobId: '10',
        jobMasterId: 1,
        jobStatusId: 1,
        referenceNumber: 'xyz',
        runsheetNo: 'xyz',
        seqSelected: 1,
        trackCallCount: 1,
        trackCallDuration: 1,
        trackHalt: 2,
        trackKm: 1,
        trackSmsCount: 1,
        trackTransactionTimeSpent: 1,
      }
    }

    const jobQuery = 'id = 1 OR id = 2 OR id = 4 OR id = 10'
    const jobTransactionQuery = 'id = 1 OR id = 2 OR id = 3 OR id = 6'
    const jobDataQuery = 'jobId = 1 OR jobId = 2 OR jobId = 4 OR jobId = 10'
    const fieldDataQuery = 'jobTransactionId = 1 OR jobTransactionId = 2 OR jobTransactionId = 3 OR jobTransactionId = 6'

    const result = {
      jobTransactionMap,
      jobQuery,
      jobTransactionQuery,
      jobDataQuery,
      fieldDataQuery
    }

    expect(jobTransactionService.getJobTransactionMapAndQuery(jobTransactionList)).toEqual(result)
  })

  it('should return empty jobTransaction map and query for job,job data ,field data table', () => {
    const jobTransactionList = null

    const jobTransactionMap = {}

    const jobQuery = ''
    const jobTransactionQuery = ''
    const jobDataQuery = ''
    const fieldDataQuery = ''

    const result = {
      jobTransactionMap,
      jobQuery,
      jobTransactionQuery,
      jobDataQuery,
      fieldDataQuery
    }
    expect(jobTransactionService.getJobTransactionMapAndQuery(jobTransactionList)).toEqual(result)
  })
})

describe('test cases for appendText', () => {
  it('should return empty text', () => {
    const condition = null
    const property = null
    const extraString = ''
    const seperator = ''
    const finalText = ''
    expect(jobTransactionService.appendText(condition, property, extraString, seperator, finalText)).toEqual('')
  })

  it('should return empty text', () => {
    const condition = undefined
    const property = null
    const extraString = ''
    const seperator = ''
    const finalText = ''
    expect(jobTransactionService.appendText(condition, property, extraString, seperator, finalText)).toEqual('')
  })

  it('should return empty text', () => {
    const condition = false
    const property = null
    const extraString = ''
    const seperator = ''
    const finalText = ''
    expect(jobTransactionService.appendText(condition, property, extraString, seperator, finalText)).toEqual('')
  })

  it('should return empty text', () => {
    const condition = true
    const property = null
    const extraString = ''
    const seperator = ''
    const finalText = ''
    expect(jobTransactionService.appendText(condition, property, extraString, seperator, finalText)).toEqual('')
  })

  it('should return empty text', () => {
    const condition = true
    const property = undefined
    const extraString = ''
    const seperator = ''
    const finalText = ''
    expect(jobTransactionService.appendText(condition, property, extraString, seperator, finalText)).toEqual('')
  })

  it('should return text without seperator', () => {
    const condition = true
    const property = 'xyz'
    const extraString = ''
    const seperator = null
    const finalText = 'xyz'
    expect(jobTransactionService.appendText(condition, property, extraString, seperator, finalText)).toEqual(property + extraString)
  })

  it('should return text without seperator', () => {
    const condition = true
    const property = 'xyz'
    const extraString = ''
    const seperator = '-'
    const finalText = ''
    expect(jobTransactionService.appendText(condition, property, extraString, seperator, finalText)).toEqual(property + extraString)
  })

  it('should return text with seperator', () => {
    const condition = true
    const property = 'xyz'
    const extraString = ''
    const seperator = '-'
    const finalText = 'xyz'
    expect(jobTransactionService.appendText(condition, property, extraString, seperator, finalText)).toEqual(seperator + property + extraString)
  })

})

describe('test cases for setTransactionCustomizationDynamicParameters', () => {

  beforeEach(() => {
    jobTransactionService.appendText = jest.fn()
    jobTransactionService.appendText.mockReturnValue('')
  })

  const jobTransaction = {}
  const job = {}
  const finalText = ''
  const customizationObject = {}
  it('should set dynamic parameters and return final text', () => {
    expect(jobTransactionService.setTransactionCustomizationDynamicParameters(customizationObject, jobTransaction, job, finalText)).toEqual('')
  })
})

describe('test cases for setTransactionCustomizationJobAttributes', () => {

  const jobDataForJobId = {
    1: {
      value: 'xyz'
    },
    2: {
      value: 'jkl'
    }
  }

  it('should return final text unchanged', () => {
    const customizationObject = {}
    const finalText = ''
    expect(jobTransactionService.setTransactionCustomizationJobAttributes(customizationObject, jobDataForJobId, finalText)).toEqual(finalText)
  })

  it('should return final text changed without seperator', () => {
    const customizationObject = {
      jobAttr: [
        {
          jobAttributeMasterId: 1
        },
        {
          jobAttributeMasterId: 2
        },
        {
          jobAttributeMasterId: 3
        }
      ],
      separator: null
    }
    const result = 'xyzjkl'
    const finalText = ''
    expect(jobTransactionService.setTransactionCustomizationJobAttributes(customizationObject, jobDataForJobId, finalText)).toEqual(result)
  })

  it('should return final text changed with seperator', () => {
    const customizationObject = {
      jobAttr: [
        {
          jobAttributeMasterId: 1
        },
        {
          jobAttributeMasterId: 2
        },
        {
          jobAttributeMasterId: 3
        }
      ],
      separator: '-'
    }
    const result = 'xyz-jkl'
    const finalText = ''
    expect(jobTransactionService.setTransactionCustomizationJobAttributes(customizationObject, jobDataForJobId, finalText)).toEqual(result)
  })

})

describe('test cases for setTransactionCustomizationFieldAttributes', () => {
  const fieldDataForJobTransactionId = {
    1: {
      value: 'xyz'
    },
    2: {
      value: 'jkl'
    }
  }
  const finalText = ''

  it('should return final text unchanged', () => {
    const customizationObject = {}
    expect(jobTransactionService.setTransactionCustomizationFieldAttributes(customizationObject, fieldDataForJobTransactionId, finalText)).toEqual(finalText)
  })

  it('should return final text changed without seperator', () => {
    const customizationObject = {
      fieldAttr: [
        {
          fieldAttributeMasterId: 1
        },
        {
          fieldAttributeMasterId: 2
        },
        {
          fieldAttributeMasterId: 3
        }
      ],
      separator: null
    }
    const result = 'xyzjkl'
    expect(jobTransactionService.setTransactionCustomizationFieldAttributes(customizationObject, fieldDataForJobTransactionId, finalText)).toEqual(result)
  })

  it('should return final text changed with seperator', () => {
    const customizationObject = {
      fieldAttr: [
        {
          fieldAttributeMasterId: 1
        },
        {
          fieldAttributeMasterId: 2
        },
        {
          fieldAttributeMasterId: 3
        }
      ],
      separator: '-'
    }
    const result = 'xyz-jkl'
    expect(jobTransactionService.setTransactionCustomizationFieldAttributes(customizationObject, fieldDataForJobTransactionId, finalText)).toEqual(result)
  })
})

describe('test cases for setTransactionDisplayDetails', () => {
  beforeEach(() => {
    jobTransactionService.setTransactionCustomizationDynamicParameters = jest.fn()
    jobTransactionService.setTransactionCustomizationDynamicParameters.mockReturnValue('dynamic parameters')
    jobTransactionService.setTransactionCustomizationJobAttributes = jest.fn()
    jobTransactionService.setTransactionCustomizationJobAttributes.mockReturnValue('job attributes')
    jobTransactionService.setTransactionCustomizationFieldAttributes = jest.fn()
    jobTransactionService.setTransactionCustomizationFieldAttributes.mockReturnValue('field attributes')
  })
  const customizationObject = null
  const jobTransaction = null
  const job = null
  const jobDataForJobId = null
  const fieldDataForJobTransactionId = null
  const finalText = null

  it('should set display details empty', () => {
    expect(jobTransactionService.setTransactionDisplayDetails(customizationObject, jobTransaction, job, finalText)).toEqual('')
  })

  it('should set display details ', () => {
    const customizationObject1 = {}
    const result = 'field attributes'
    expect(jobTransactionService.setTransactionDisplayDetails(customizationObject1, jobTransaction, job, finalText)).toEqual(result)
  })

})

describe('test cases for setContactDetails', () => {

  it('should return empty contact data for empty jobAttributeMap,contactMap,job', () => {
    const jobDataDetailsForListing = {
      contactMap: {}
    }
    const jobAttributeMap = {}
    const job = {}
    expect(jobTransactionService.setContactDetails(jobDataDetailsForListing, jobAttributeMap, job)).toEqual([])
  })

  it('should return empty contact data for null jobAttributeMap', () => {
    const jobDataDetailsForListing = {
      contactMap: {
        1: [
          {
            jobAttributeMasterId: 10,
            value: 9288212
          },
          {
            jobAttributeMasterId: 11,
            value: 9723287
          }
        ]
      }
    }
    const jobAttributeMap = null
    const job = {
      id: 1
    }
    expect(jobTransactionService.setContactDetails(jobDataDetailsForListing, jobAttributeMap, job)).toEqual([])
  })

  it('should return empty contact data for empty jobAttributeMap', () => {
    const jobDataDetailsForListing = {
      contactMap: {
        1: [
          {
            jobAttributeMasterId: 10,
            value: 9288212
          },
          {
            jobAttributeMasterId: 11,
            value: 9723287
          }
        ]
      }
    }
    const jobAttributeMap = {}
    const job = {
      id: 1
    }
    expect(jobTransactionService.setContactDetails(jobDataDetailsForListing, jobAttributeMap, job)).toEqual([])
  })

  it('should return empty contact data for empty jobAttributeMap', () => {
    const jobDataDetailsForListing = {
      contactMap: {
        1: [
          {
            jobAttributeMasterId: 10,
            value: 9288212
          },
          {
            jobAttributeMasterId: 11,
            value: 9723287
          }
        ]
      }
    }
    const jobAttributeMap = {
      10: {}
    }
    const job = {
      id: 1
    }
    expect(jobTransactionService.setContactDetails(jobDataDetailsForListing, jobAttributeMap, job)).toEqual([9288212])
  })

})

describe('test cases for setAddressDetails', () => {

  beforeEach(() => {
    jobTransactionService.appendText = jest.fn()
    jobTransactionService.appendText.mockReturnValueOnce('xyz')
    jobTransactionService.appendText.mockReturnValue('')
  })

  const jobAttributeMasterMap = {
    10: {
      id: 10,
      attributeTypeId: 28
    },
    11: {
      id: 11,
      attributeTypeId: 29
    },
    12: {
      id: 12,
      attributeTypeId: 30
    },
    13: {
      id: 13,
      attributeTypeId: 31
    },
    14: {
      id: 14,
      attributeTypeId: 28
    },
    15: {
      id: 15,
      attributeTypeId: 29
    },
    16: {
      id: 16,
      attributeTypeId: 30
    },
    17: {
      id: 17,
      attributeTypeId: 31
    }
  }

  const jobAttributeMap = {
    12: {
      id: 12,
      attributeTypeId: 30
    },
    13: {
      id: 13,
      attributeTypeId: 31
    },
    14: {
      id: 14,
      attributeTypeId: 28
    },
    15: {
      id: 15,
      attributeTypeId: 29
    },
  }

  it('should return empty address data for empty jobAttributeMap,contactMap,job ', () => {
    const jobDataDetailsForListing = {
      addressMap: {}
    }
    const jobAttributeMap = {}
    const job = {}
    const jobAttributeMasterMap = {}
    expect(jobTransactionService.setAddressDetails(jobDataDetailsForListing, jobAttributeMasterMap, jobAttributeMap, job)).toEqual([])
    expect(jobTransactionService.appendText).not.toHaveBeenCalled()
  })

  it('should return address data without lat lng', () => {
    const jobDataDetailsForListing = {
      addressMap: {
        1: [
          {
            jobAttributeMasterId: 10,
            value: 'addressline1'
          },
          {
            jobAttributeMasterId: 11,
            value: 'addressline2'
          },
          {
            jobAttributeMasterId: 12,
            value: 'pincode'
          },
          {
            jobAttributeMasterId: 13,
            value: 'landmark'
          },
        ]
      }
    }
    const job = {
      id: 1
    }
    expect(jobTransactionService.setAddressDetails(jobDataDetailsForListing, jobAttributeMasterMap, jobAttributeMap, job)).toEqual(['xyz'])
    expect(jobTransactionService.appendText).toHaveBeenCalledTimes(4)
  })

  it('should return address data without lat lng', () => {
    const jobDataDetailsForListing = {
      addressMap: {
        1: [
          {
            jobAttributeMasterId: 10,
            value: 'addressline1'
          },
          {
            jobAttributeMasterId: 11,
            value: 'addressline2'
          },
          {
            jobAttributeMasterId: 12,
            value: 'pincode'
          },
          {
            jobAttributeMasterId: 13,
            value: 'landmark'
          },
        ]
      }
    }
    const job = {
      id: 1,
      latitude: 1,
      longitude: 1
    }
    expect(jobTransactionService.setAddressDetails(jobDataDetailsForListing, jobAttributeMasterMap, jobAttributeMap, job)).toEqual(['1,1', 'xyz'])
    expect(jobTransactionService.appendText).toHaveBeenCalledTimes(4)
  })
})

describe('test cases for setCustomerCareDetails', () => {

  it('should return undefined list', () => {
    const customerCareMap = {}
    const job = {}
    expect(jobTransactionService.setCustomerCareDetails(customerCareMap,job)).toEqual(undefined)
  })

  it('should return customerCare list', () => {
    const customerCareMap = {
      1 : []
    }
    const job = {
      jobMasterId : 1
    }
    expect(jobTransactionService.setCustomerCareDetails(customerCareMap,job)).toEqual([])
  })

})

describe('test cases for setSMSDetails',() => {

  it('should return empty list for empty contact data list',() => {
    const smsTemplateMap = {}
    const job = {}
    const contactData = []
    expect(jobTransactionService.setSMSDetails(smsTemplateMap, job, contactData)).toEqual([])
  })

  it('should return undefined list for empty sms template',() => {
    const smsTemplateMap = {}
    const job = {}
    const contactData = ['989797987']
    expect(jobTransactionService.setSMSDetails(smsTemplateMap, job, contactData)).toEqual(undefined)
  })

  it('should return undefined list for empty sms template',() => {
    const smsTemplate = {
      id : 1
    }
    const smsTemplateMap = {
      1 : smsTemplate
    }
    const job = {
      jobMasterId : 1
    }
    const contactData = ['989797987']
    expect(jobTransactionService.setSMSDetails(smsTemplateMap, job, contactData)).toEqual(smsTemplate)
  })
})

describe('test cases for setJobSwipableDetails', () => {
  const jobDataDetailsForListing = {}
  const jobAttributeMasterMap = {}
  const jobAttributeStatusMap = {}
  const jobTransaction = {
    jobMasterId : 1,
    jobStatusId : 1
  }
  const job = {}
  const customerCareMap = {}
  const smsTemplateMap = {}
  let contactData = {}
  let addressData = {}
  let customerCareData = {}
  let smsTemplateData = {}

  it('should return swipable details', () => {
    jobTransactionService.setContactDetails = jest.fn()
    jobTransactionService.setContactDetails.mockReturnValue(contactData)
    jobTransactionService.setAddressDetails = jest.fn()
    jobTransactionService.setAddressDetails.mockReturnValue(addressData)
    jobTransactionService.setCustomerCareDetails = jest.fn()
    jobTransactionService.setCustomerCareDetails.mockReturnValue(customerCareData)
    jobTransactionService.setSMSDetails = jest.fn()
    jobTransactionService.setSMSDetails.mockReturnValue(smsTemplateData)
    expect(jobTransactionService.setJobSwipableDetails(jobDataDetailsForListing, jobAttributeMasterMap, jobAttributeStatusMap, jobTransaction, job, customerCareMap, smsTemplateMap)).toEqual(
      {
        contactData,
        addressData,
        customerCareData,
        smsTemplateData
      }
    )
  })
})

describe('test cases for prepareJobCustomizationList', () => {

  beforeEach(() => {
    jobTransactionService.setTransactionDisplayDetails = jest.fn()
    jobTransactionService.setTransactionDisplayDetails.mockReturnValueOnce('xyz')
    jobTransactionService.setTransactionDisplayDetails.mockReturnValueOnce('abc')
    jobTransactionService.setTransactionDisplayDetails.mockReturnValueOnce('lmn')
    jobTransactionService.setTransactionDisplayDetails.mockReturnValueOnce('def')
    jobTransactionService.setTransactionDisplayDetails.mockReturnValue('test')
    jobTransactionService.setJobSwipableDetails = jest.fn()
    jobTransactionService.setJobSwipableDetails.mockReturnValueOnce('test1')
    jobTransactionService.setJobSwipableDetails.mockReturnValueOnce('test2')
  })

  const jobMap = {
    2: {
      id: 2,
      jobMasterId: 3
    },
    3: {
      id: 3,
      jobMasterId: 3
    }
  }

  const jobDataDetailsForListing = {
    jobDataMap: {
      2: {
        30: {
          jobId: 2,
          value: 'xyz',
          jobAttributeMasterId: 30
        },
        31: {
          jobId: 2,
          value: 'abc',
          jobAttributeMasterId: 31
        }
      },
      3: {
        30: {
          jobId: 3,
          value: 'xyz',
          jobAttributeMasterId: 30
        },
        31: {
          jobId: 3,
          value: 'abc',
          jobAttributeMasterId: 31
        }
      }
    }
  }

  const fieldDataMap = {
    1: {
      40: {
        jobTransactionId: 1,
        fieldAttributeMasterId: 40,
        value: 'jkl'
      },
      41: {
        jobTransactionId: 1,
        fieldAttributeMasterId: 41,
        value: 'iop'
      }
    },
    2: {
      40: {
        jobTransactionId: 2,
        fieldAttributeMasterId: 40,
        value: 'tyu'
      },
      41: {
        jobTransactionId: 2,
        fieldAttributeMasterId: 41,
        value: 'iot'
      }
    }
  }

  const jobMasterIdCustomizationMap = {
    3: {
      1: {
        jobMasterId: 3,
        appJobListMasterId: 1,
      },
      2: {
        jobMasterId: 3,
        appJobListMasterId: 2,
      },
      3: {
        jobMasterId: 3,
        appJobListMasterId: 3,
      },
    }
  }
  const jobAttributeMasterMap = {}
  const jobAttributeStatusMap = {}
  const customerCareMap = {}
  const smsTemplateMap = {}

  it('should prepare empty job customization list', () => {
    const jobTransactionMap = {}
    expect(jobTransactionService.prepareJobCustomizationList(jobTransactionMap, jobMap, jobDataDetailsForListing, fieldDataMap, jobMasterIdCustomizationMap, jobAttributeMasterMap, jobAttributeStatusMap, customerCareMap, smsTemplateMap)).toEqual([])
    expect(jobTransactionService.setTransactionDisplayDetails).not.toHaveBeenCalled()
    expect(jobTransactionService.setJobSwipableDetails).not.toHaveBeenCalled()
  })


  it('should prepare job customization list for both transaction', () => {
    const jobTransactionMap = {
      1: {
        id: 1,
        jobId: 2,
        jobMasterId: 3,
        seqSelected: 10,
        jobStatusId: 11,
        referenceNumber: 'refno'
      },
      2: {
        id: 2,
        jobId: 3,
        jobMasterId: 3,
        seqSelected: 12,
        jobStatusId: 11,
        referenceNumber: 'refno'
      }
    }

    const result = [
      {
        line1: 'xyz',
        line2: 'abc',
        circleLine1: 'lmn',
        circleLine2: 'def',
        id: 1,
        jobMasterId: 3,
        jobSwipableDetails: 'test1',
        seqSelected: 10,
        statusId: 11
      },
      {
        line1: 'test',
        line2: 'test',
        circleLine1: 'test',
        circleLine2: 'test',
        id: 2,
        jobMasterId: 3,
        jobSwipableDetails: 'test2',
        seqSelected: 12,
        statusId: 11
      }
    ]
    expect(jobTransactionService.prepareJobCustomizationList(jobTransactionMap, jobMap, jobDataDetailsForListing, fieldDataMap, jobMasterIdCustomizationMap, jobAttributeMasterMap, jobAttributeStatusMap, customerCareMap, smsTemplateMap)).toEqual(result)
    expect(jobTransactionService.setTransactionDisplayDetails).toHaveBeenCalledTimes(8)
    expect(jobTransactionService.setJobSwipableDetails).toHaveBeenCalledTimes(2)
  })

  it('should prepare job customization list for only one transaction', () => {
    const jobTransactionMap = {
      1: {
        id: 1,
        jobId: 2,
        jobMasterId: 3,
        seqSelected: 10,
        jobStatusId: 11,
        referenceNumber: 'refno'
      },
      2: {
        id: 2,
        jobId: 3,
        jobMasterId: 4,
        seqSelected: 12,
        jobStatusId: 11,
        referenceNumber: 'refno'
      }
    }
    const result = [
      {
        line1: 'xyz',
        line2: 'abc',
        circleLine1: 'lmn',
        circleLine2: 'def',
        id: 1,
        jobMasterId: 3,
        jobSwipableDetails: 'test1',
        seqSelected: 10,
        statusId: 11
      },
      {
        line1: 'refno',
        line2: '',
        circleLine1: '',
        circleLine2: '',
        id: 2,
        jobMasterId: 4,
        jobSwipableDetails: 'test2',
        seqSelected: 12,
        statusId: 11
      }
    ]
    expect(jobTransactionService.prepareJobCustomizationList(jobTransactionMap, jobMap, jobDataDetailsForListing, fieldDataMap, jobMasterIdCustomizationMap, jobAttributeMasterMap, jobAttributeStatusMap, customerCareMap, smsTemplateMap)).toEqual(result)
    expect(jobTransactionService.setTransactionDisplayDetails).toHaveBeenCalledTimes(4)
    expect(jobTransactionService.setJobSwipableDetails).toHaveBeenCalledTimes(2)
  })
})

describe('test cases for getAllJobTransactionsCustomizationList', () => {

  beforeEach(() => {
    jobAttributeMasterService.getJobAttributeMasterMap = jest.fn()
    jobAttributeMasterService.getJobAttributeStatusMap = jest.fn()
    jobAttributeMasterService.getAllJobAttributeStatusMap = jest.fn()
    customerCareService.getCustomerCareMap = jest.fn()
    smsTemplateService.getSMSTemplateMap = jest.fn()
    jobService.getJobMap = jest.fn()
    jobDataService.getJobDataDetailsForListing = jest.fn()
    fieldDataService.getFieldDataMap = jest.fn()
    jobTransactionService.getJobTransactionMapAndQuery = jest.fn()
    jobTransactionService.prepareJobCustomizationList = jest.fn()
    jobStatusService.getJobMasterIdStatusIdMap = jest.fn()
    jobStatusService.getJobMasterIdStatusIdMap.mockReturnValue({
      jobMasterIdJobAttributeStatusMap : {},
      statusIdNextStatusMap : {},
    })
    realm.getRecordListOnQuery = jest.fn()
    realm.getRecordListOnQuery.mockReturnValue([])
  })

  it('should return a empty job transaction customization list', () => {
    const jobMasterIdCustomizationMap = {}
    const jobAttributeMasterList = []
    const jobAttributeStatusList = []
    const customerCareList = []
    const smsTemplateList = []
    const statusList = []
    expect(jobTransactionService.getAllJobTransactionsCustomizationList(jobMasterIdCustomizationMap, jobAttributeMasterList, jobAttributeStatusList, customerCareList, smsTemplateList, statusList)).toEqual([])
    expect(jobAttributeMasterService.getJobAttributeMasterMap).toHaveBeenCalledTimes(1)
    expect(jobAttributeMasterService.getJobAttributeStatusMap).toHaveBeenCalledTimes(1)
    expect(jobStatusService.getJobMasterIdStatusIdMap).toHaveBeenCalledTimes(1)
    expect(customerCareService.getCustomerCareMap).toHaveBeenCalledTimes(1)
    expect(smsTemplateService.getSMSTemplateMap).toHaveBeenCalledTimes(1)
    expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(2)
    expect(jobTransactionService.getJobTransactionMapAndQuery).not.toHaveBeenCalled()
    expect(jobTransactionService.prepareJobCustomizationList).not.toHaveBeenCalled()
    expect(jobService.getJobMap).not.toHaveBeenCalled()
    expect(jobDataService.getJobDataDetailsForListing).not.toHaveBeenCalled()
    expect(fieldDataService.getFieldDataMap).not.toHaveBeenCalled()
  })

  it('should return a job transaction customization list', () => {
    const jobMasterIdCustomizationMap = {}
    const jobAttributeMasterList = []
    const jobAttributeStatusList = []
    const customerCareList = []
    const smsTemplateList = []
    const jobTransactionList = [
      {
        id: '1'
      }
    ]

    const jobTransactionObject = {
      jobTransactionMap: {}
    }

    const jobTransactionCustomizationList = [{
      line1: 'xyz',
      line2: 'abc',
      seqSelected: 1
    }]
    realm.getRecordListOnQuery.mockReturnValueOnce([])
                              .mockReturnValueOnce(jobTransactionList)
                              .mockReturnValue([])
    jobTransactionService.getJobTransactionMapAndQuery = jest.fn()
    jobTransactionService.getJobTransactionMapAndQuery.mockReturnValue(jobTransactionObject)
    jobTransactionService.prepareJobCustomizationList = jest.fn()
    jobTransactionService.prepareJobCustomizationList.mockReturnValue(jobTransactionCustomizationList)

    expect(jobTransactionService.getAllJobTransactionsCustomizationList(jobMasterIdCustomizationMap, jobAttributeMasterList, jobAttributeStatusList, customerCareList, smsTemplateList)).toEqual(jobTransactionCustomizationList)
    expect(jobAttributeMasterService.getJobAttributeMasterMap).toHaveBeenCalledTimes(1)
    expect(jobAttributeMasterService.getJobAttributeStatusMap).toHaveBeenCalledTimes(1)
    expect(jobStatusService.getJobMasterIdStatusIdMap).toHaveBeenCalledTimes(1)
    expect(customerCareService.getCustomerCareMap).toHaveBeenCalledTimes(1)
    expect(smsTemplateService.getSMSTemplateMap).toHaveBeenCalledTimes(1)
    expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(5)
    expect(jobTransactionService.getJobTransactionMapAndQuery).toHaveBeenCalledTimes(1)
    expect(jobTransactionService.prepareJobCustomizationList).toHaveBeenCalledTimes(1)
    expect(jobService.getJobMap).toHaveBeenCalledTimes(1)
    expect(jobDataService.getJobDataDetailsForListing).toHaveBeenCalledTimes(1)
    expect(fieldDataService.getFieldDataMap).toHaveBeenCalledTimes(1)
  })

})

describe('test Job Transaction services', () => {
  it('should get unseen transaction job master ids ', () => {
    const unseenTransactions = [{
      id: 1,
      jobMasterId: 12
    }, {
      id: 2,
      jobMasterId: 13
    }]
    const jobMasterIds = [12, 13]
    expect(jobTransactionService.getUnseenTransactionsJobMasterIds(unseenTransactions)).toEqual(jobMasterIds)
  })

  it('should get job transactions on basis of status ids', () => {
    const allJobTransactions = [{
      id: 1,
      jobStatusId: 12
    }, {
      id: 2,
      jobStatusId: 13
    }, {
      id: 3,
      jobStatusId: 14
    }]
    const jobStatusIds = [12, 13]
    const filteredJobTransactions = [{
      id: 1,
      jobStatusId: 12
    }, {
      id: 2,
      jobStatusId: 13
    }]
    expect(jobTransactionService.getJobTransactionsForStatusIds(allJobTransactions, jobStatusIds)).toEqual(filteredJobTransactions)
  })

  it('should get JobMasterIdJobStatusIdTransactionIdDtoMap', () => {
    const unseenTransactions = [{
      id: 2560784,
      jobStatusId: 4814,
      jobMasterId: 930
    }]

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
    jobTransactionService.getUnseenTransactionsJobMasterIds = jest.fn()
    jobTransactionService.getUnseenTransactionsJobMasterIds.mockReturnValueOnce(
      [930]
    )
    jobStatusService.getjobMasterIdStatusIdMap = jest.fn()
    jobStatusService.getjobMasterIdStatusIdMap.mockReturnValueOnce({
      930: 4813
    })
    return jobTransactionService.getJobMasterIdJobStatusIdTransactionIdDtoMap(unseenTransactions).then(data => {
      expect(data).toEqual(jobMasterIdJobStatusIdTransactionIdDtoMap)
      expect(jobTransactionService.getUnseenTransactionsJobMasterIds).toHaveBeenCalledTimes(1)
      expect(jobStatusService.getjobMasterIdStatusIdMap).toHaveBeenCalledTimes(1)
    })
  })

  it('should return an empty map for no unseen transaction', () => {
    const unseenTransactions = {},
      jobMasterIdJobStatusIdTransactionIdDtoMap = {}
    jobTransactionService.getUnseenTransactionsJobMasterIds = jest.fn()
    jobStatusService.getjobMasterIdStatusIdMap = jest.fn()
    return jobTransactionService.getJobMasterIdJobStatusIdTransactionIdDtoMap(unseenTransactions).then(data => {
      expect(data).toEqual(jobMasterIdJobStatusIdTransactionIdDtoMap)
      expect(jobTransactionService.getUnseenTransactionsJobMasterIds).not.toHaveBeenCalled()
      expect(jobStatusService.getjobMasterIdStatusIdMap).not.toHaveBeenCalled()
    })

  })

  it('should update job transaction status id', () => {
    const jobMasterIdTransactionDtoMap = [{
      jobMasterId: 930,
      pendingStatusId: 4813,
      transactionId: "2426803",
      unSeenStatusId: 4814
    }]
    realm.updateTableRecordOnProperty = jest.fn()
    jobTransactionService.updateJobTransactionStatusId(jobMasterIdTransactionDtoMap)
    expect(realm.updateTableRecordOnProperty).toHaveBeenCalledTimes(1)
  })
})
