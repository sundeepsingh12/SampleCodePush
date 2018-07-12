"use strict";

import sha256 from "sha256";
import { restAPI } from "../../lib/RestAPI";
import {
  ON_BLUR,
  TABLE_FIELD_DATA,
  TABLE_RUNSHEET,
  NEXT_FOCUS,
  TABLE_JOB
} from "../../lib/constants";
import * as realm from "../../repositories/realmdb";
import { jobStatusService } from "../classes/JobStatus";
import { keyValueDBService } from "../classes/KeyValueDBService";
import { formLayoutEventsInterface } from "../classes/formLayout/FormLayoutEventInterface";
import FormLayoutEventImpl from "../classes/formLayout/formLayoutEventImpl";
import RestAPIFactory from "../../lib/RestAPIFactory";
import { fieldValidationService } from "../classes/FieldValidation";
import { runSheetService } from "../classes/RunSheet";
import { addServerSmsService } from "../classes/AddServerSms";
import moment from "moment";

describe("save events implementation", () => {
  let formLayoutMap = {};
  formLayoutMap = {
    1: {
      label: "rr",
      subLabel: "d",
      helpText: "d",
      key: "d",
      required: true,
      hidden: false,
      attributeTypeId: 1,
      fieldAttributeMasterId: 1,
      positionId: 0,
      parentId: 0,
      showHelpText: false,
      editable: false,
      focus: true,
      validation: []
    },
    2: {
      label: "ds",
      subLabel: "d",
      helpText: "w",
      key: "dd",
      required: false,
      hidden: true,
      attributeTypeId: 1,
      fieldAttributeMasterId: 1,
      positionId: 0,
      parentId: 0,
      showHelpText: true,
      editable: false,
      focus: false,
      validation: []
    }
  };
  it("should disable save if required with save disabled", () => {
    expect(
      formLayoutEventsInterface.disableSaveIfRequired(
        1,
        true,
        formLayoutMap,
        "dd"
      )
    ).toEqual(true);
  });

  it("should disable save if required without save disabled", () => {
    expect(
      formLayoutEventsInterface.disableSaveIfRequired(
        1,
        false,
        formLayoutMap,
        "dd"
      )
    ).toEqual(true);
  });

  it("should disable save if required without save disabled and not required element", () => {
    expect(
      formLayoutEventsInterface.disableSaveIfRequired(
        2,
        false,
        formLayoutMap,
        "dd"
      )
    ).toEqual(false);
  });

  it("should disable save if required with save disabled and not required element", () => {
    expect(
      formLayoutEventsInterface.disableSaveIfRequired(
        2,
        true,
        formLayoutMap,
        "dd"
      )
    ).toEqual(true);
  });
});

describe("test for _setJobTransactionValues", () => {
  let id = 1,
    status = { id: 1, code: 1 },
    jobMaster = { id: 1, code: 1 },
    user = { id: 1, cityId: 1, employeeCode: 1, company: { id: 1 } },
    hub = { id: 1, code: 1 },
    imei = {
      imeiNumber: 1
    },
    currentTime = "12:10:10",
    lastTrackLog = {
      latitude: 0,
      longitude: 0
    },
    trackBattery = {
      value: 1
    };
  it("should return job transaction", () => {
    let time = moment().valueOf();
    let jobTransactionList = {};
    let jobTransaction = {};
    jobTransaction.id = 1;
    jobTransaction.jobId = 1;
    jobTransaction.referenceNumber = 1;
    jobTransaction.jobType = jobMaster.code;
    jobTransaction.jobStatusId = status.id;
    jobTransaction.statusCode = status.code;
    jobTransaction.employeeCode = user.employeeCode;
    jobTransaction.hubCode = hub.code;
    jobTransaction.lastTransactionTimeOnMobile = currentTime;
    jobTransaction.imeiNumber = imei.imeiNumber;
    jobTransaction.latitude = lastTrackLog.latitude;
    jobTransaction.longitude = lastTrackLog.longitude;
    jobTransaction.trackKm = 1;
    jobTransaction.trackTransactionTimeSpent = 1 * 1000;
    jobTransaction.trackBattery =
      trackBattery && trackBattery.value ? trackBattery.value : 0;
    jobTransaction.npsFeedBack = 1;
    jobTransaction.originalAmount = 0;
    jobTransaction.actualAmount = 0;
    jobTransaction.moneyTransactionType = undefined;
    let jobTransactionArray = [];
    jobTransactionArray.push(jobTransaction);
    jobTransactionList[1] = {
      id: jobTransaction.id,
      referenceNumber: jobTransaction.referenceNumber,
      jobId: jobTransaction.jobId,
      syncTime: moment().format("YYYY-MM-DD HH:mm:ss")
    };
    let result = {
      tableName: "TABLE_JOB_TRANSACTION",
      value: jobTransactionArray,
      jobTransactionDTOMap: jobTransactionList
    };
    expect(
      formLayoutEventsInterface._setJobTransactionValues(
        jobTransaction,
        status,
        jobMaster,
        user,
        hub,
        imei,
        currentTime,
        lastTrackLog,
        1,
        1,
        trackBattery,
        1,
        {}
      )
    ).toEqual(result);
  });
});

describe("test for _setBulkJobTransactionValues", () => {
  let id = 1,
    status = { id: 1, code: 1 },
    jobMaster = { id: 1, code: 1 },
    user = { id: 1, cityId: 1, employeeCode: 1, company: { id: 1 } },
    hub = { id: 1, code: 1 },
    imei = {
      imeiNumber: 1
    },
    currentTime = "12:10:10",
    lastTrackLog = {
      latitude: 0,
      longitude: 0
    },
    trackBattery = {
      value: 1
    };
  it("should return bulk job transaction", () => {
    let time = moment().valueOf();
    let jobTransactionList = [
      {
        id: 1,
        referenceNumber: 1,
        jobId: 1
      }
    ];
    let jobTransaction = {},
      jobTransactionDTOMap = {};
    jobTransaction.id = 1;
    jobTransaction.jobId = 1;
    jobTransaction.referenceNumber = 1;
    jobTransaction.jobType = jobMaster.code;
    jobTransaction.jobStatusId = status.id;
    jobTransaction.statusCode = status.code;
    jobTransaction.employeeCode = user.employeeCode;
    jobTransaction.hubCode = hub.code;
    jobTransaction.lastTransactionTimeOnMobile = currentTime;
    jobTransaction.imeiNumber = imei.imeiNumber;
    jobTransaction.latitude = lastTrackLog.latitude;
    jobTransaction.longitude = lastTrackLog.longitude;
    jobTransaction.trackKm = 1;
    jobTransaction.trackTransactionTimeSpent = 1 * 1000;
    jobTransaction.trackBattery =
      trackBattery && trackBattery.value ? trackBattery.value : 0;
    jobTransaction.npsFeedBack = 1;
    jobTransaction.originalAmount = 0;
    jobTransaction.actualAmount = 0;
    jobTransaction.moneyTransactionType = undefined;
    let jobTransactionArray = [];
    jobTransactionArray.push(jobTransaction);
    jobTransactionDTOMap[1] = {
      id: jobTransaction.id,
      referenceNumber: jobTransaction.referenceNumber,
      jobId: jobTransaction.jobId,
      syncTime: moment().format("YYYY-MM-DD HH:mm:ss")
    };
    let result = {
      tableName: "TABLE_JOB_TRANSACTION",
      value: jobTransactionArray,
      jobTransactionDTOMap
    };
    expect(
      formLayoutEventsInterface._setBulkJobTransactionValues(
        jobTransactionList,
        status,
        jobMaster,
        user,
        hub,
        imei,
        currentTime,
        lastTrackLog,
        1,
        1,
        trackBattery,
        1,
        {}
      )
    ).toEqual(result);
  });
});
describe("test for update field info", () => {
  it("should set display value to value", () => {
    let formElement = {};
    formElement[1] = {
      label: "rr",
      subLabel: "d",
      helpText: "d",
      key: "d",
      required: true,
      hidden: false,
      attributeTypeId: 1,
      fieldAttributeMasterId: 1,
      positionId: 0,
      parentId: 0,
      showHelpText: false,
      editable: false,
      focus: true,
      validation: []
    };
    let result = {};
    result[1] = {
      label: "rr",
      subLabel: "d",
      helpText: "d",
      key: "d",
      required: true,
      hidden: false,
      attributeTypeId: 1,
      fieldAttributeMasterId: 1,
      positionId: 0,
      parentId: 0,
      showHelpText: false,
      editable: false,
      focus: true,
      validation: [],
      displayValue: "test"
    };
    expect(
      formLayoutEventsInterface.updateFieldData(
        1,
        "test",
        formElement,
        NEXT_FOCUS
      )
    ).toEqual(result);
  });
  it("should set alert message to null", () => {
    let formElement = {};
    formElement[1] = {
      label: "rr",
      subLabel: "d",
      helpText: "d",
      key: "d",
      required: true,
      hidden: false,
      attributeTypeId: 1,
      fieldAttributeMasterId: 1,
      positionId: 0,
      parentId: 0,
      showHelpText: false,
      editable: false,
      focus: true,
      validation: [],
      alertMessage: "alert"
    };
    let result = {};
    result[1] = {
      label: "rr",
      subLabel: "d",
      helpText: "d",
      key: "d",
      required: true,
      hidden: false,
      attributeTypeId: 1,
      fieldAttributeMasterId: 1,
      positionId: 0,
      parentId: 0,
      showHelpText: false,
      editable: false,
      focus: true,
      validation: [],
      displayValue: "test",
      alertMessage: null,
      childDataList: []
    };
    expect(
      formLayoutEventsInterface.updateFieldData(
        1,
        "test",
        formElement,
        null,
        []
      )
    ).toEqual(result);
  });
});

describe("get sequence field data", () => {
  it("should not get data from server if id is null and throw error", () => {
    const message = "masterId unavailable";
    try {
      keyValueDBService.getValueFromStore = jest.fn();
      keyValueDBService.getValueFromStore.mockReturnValue("test");
      const sequenceId = null;
      formLayoutEventsInterface.getSequenceAttrData(sequenceId);
    } catch (error) {
      expect(error.message).toEqual(message);
    }
  });
  it("should not get data from server if id is undefined and throw error", () => {
    const message = "masterId unavailable";
    try {
      keyValueDBService.getValueFromStore = jest.fn();
      keyValueDBService.getValueFromStore.mockReturnValue("test");
      const sequenceId = undefined;
      formLayoutEventsInterface.getSequenceAttrData(sequenceId);
    } catch (error) {
      expect(error.message).toEqual(message);
    }
  });
  it("should not get data from server if token value is null and throw token error", () => {
    const message = "Token Missing";
    try {
      keyValueDBService.getValueFromStore = jest.fn();
      keyValueDBService.getValueFromStore.mockReturnValue(null);
      formLayoutEventsInterface.getSequenceAttrData(4);
    } catch (error) {
      expect(error.message).toEqual(message);
    }
  });

  it("should not get data from server if token value is undefined and throw token error", () => {
    const message = "Token Missing";
    try {
      keyValueDBService.getValueFromStore = jest.fn();
      keyValueDBService.getValueFromStore.mockReturnValue(undefined);
      formLayoutEventsInterface.getSequenceData();
    } catch (error) {
      expect(error.message).toEqual(message);
    }
  });
  it("should not get data from server and throw error", () => {
    const message = "masterId unavailable";
    try {
      keyValueDBService.getValueFromStore = jest.fn();
      keyValueDBService.getValueFromStore.mockReturnValue("test");
      const sequenceId = null;
      formLayoutEventsInterface.getSequenceAttrData(sequenceId);
    } catch (error) {
      expect(error.message).toEqual(message);
    }
  });
  it("should get sequence  data without error", () => {
    keyValueDBService.getValueFromStore = jest.fn();
    keyValueDBService.getValueFromStore.mockReturnValueOnce({
      value: "testtoken"
    });
    RestAPIFactory().serviceCall = jest.fn();
    RestAPIFactory().serviceCall.mockReturnValue({ json: [1] });
    const sequenceId = "4";
    return formLayoutEventsInterface
      .getSequenceAttrData(sequenceId)
      .then(data => {
        expect(data).toEqual(null);
        expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
      });
  });
});

describe("add transaction to sync list", () => {
  it("should return null", () => {
    formLayoutEventsInterface.addTransactionsToSyncList([]).then(idList => {
      expect(idList).toEqual(null);
    });
  });
  it("should create pending sync list", () => {
    let transactionIdsToSync = [1];
    keyValueDBService.getValueFromStore = jest.fn();
    keyValueDBService.getValueFromStore.mockReturnValue(null);
    keyValueDBService.validateAndSaveData = jest.fn();
    formLayoutEventsInterface.addToSyncList([1]).then(idList => {
      expect(idList).toEqual(transactionIdsToSync);
      expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1);
      expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(1);
    });
  });
});

describe("set MoneyCollectFieldData For Bulk", () => {
  let childDataList = [
    {
      value: 3,
      jobTransactionId: 5,
      positionId: 3,
      parentId: 0,
      fieldAttributeMasterId: 1,
      key: 1,
      attributeTypeId: 25
    },
    {
      value: 9,
      jobTransactionId: 5,
      positionId: 8,
      parentId: 0,
      fieldAttributeMasterId: 10,
      key: 1,
      attributeTypeId: 26
    },
    {
      childDataList: [
        {
          value: 4,
          jobTransactionId: 5,
          positionId: 4,
          parentId: 0,
          fieldAttributeMasterId: 2,
          key: 1,
          attributeTypeId: 26
        }
        // {
        //     value: 5,
        //     jobTransactionId: 5,
        //     positionId: 5,
        //     parentId: 0,
        //     fieldAttributeMasterId: 3,
        //     key: 1,
        //     attributeTypeId: 1,
        //     childDataList: [
        //         {
        //             value: 6,
        //             jobTransactionId: 5,
        //             positionId: 6,
        //             parentId: 5,
        //             fieldAttributeMasterId: 4,
        //             key: 1,
        //             attributeTypeId: 1,
        //         },
        //         {
        //             value: 7,
        //             jobTransactionId: 5,
        //             positionId: 7,
        //             parentId: 5,
        //             fieldAttributeMasterId: 5,
        //             key: 1,
        //             attributeTypeId: 4,
        //             childDataList: []
        //         }
        //     ]
        // }
      ]
    },
    {
      value: 8,
      jobTransactionId: 5,
      positionId: 9,
      parentId: 0,
      fieldAttributeMasterId: 6,
      key: "amount",
      attributeTypeId: 10
    },
    {
      value: 8,
      jobTransactionId: 5,
      positionId: 9,
      parentId: 0,
      fieldAttributeMasterId: 6,
      key: "12",
      attributeTypeId: 7
    }
  ];
  let formLayoutObject = {
    fieldDataArray: [
      {
        attributeTypeId: 25,
        dateTime: "12:10:10",
        fieldAttributeMasterId: 1,
        id: 2,
        jobTransactionId: 1,
        key: 1,
        parentId: 0,
        positionId: 3,
        value: "10"
      },
      {
        attributeTypeId: 26,
        dateTime: "12:10:10",
        fieldAttributeMasterId: 10,
        id: 3,
        jobTransactionId: 1,
        key: 1,
        parentId: 0,
        positionId: 8,
        value: "10"
      },
      {
        attributeTypeId: undefined,
        dateTime: "12:10:10",
        fieldAttributeMasterId: undefined,
        id: 4,
        jobTransactionId: 1,
        key: undefined,
        parentId: undefined,
        positionId: undefined,
        value: null
      },
      {
        attributeTypeId: 26,
        dateTime: "12:10:10",
        fieldAttributeMasterId: 2,
        id: 5,
        jobTransactionId: 1,
        key: 1,
        parentId: 0,
        positionId: 4,
        value: "10"
      },
      {
        attributeTypeId: 10,
        dateTime: "12:10:10",
        fieldAttributeMasterId: 6,
        id: 6,
        jobTransactionId: 1,
        key: "amount",
        parentId: 0,
        positionId: 9,
        value: "10"
      },
      {
        attributeTypeId: 7,
        dateTime: "12:10:10",
        fieldAttributeMasterId: 6,
        id: 7,
        jobTransactionId: 1,
        key: "12",
        parentId: 0,
        positionId: 9,
        value: "8"
      }
    ],
    lastId: 7
  };

  let currentTime = "12:10:10";
  const fieldData = {
    attributeTypeId: 6,
    dateTime: "12:10:10",
    fieldAttributeMasterId: 123,
    id: 1,
    jobTransactionId: 1,
    key: "ac",
    parentId: 0,
    positionId: 1,
    value: "1"
  };
  let jobTransactionIdAmountMap = {
    1: {
      actualAmount: 10,
      originalAmount: 10
    }
  };
  it("should set moneyCollectFieldData for bulk", () => {
    expect(
      formLayoutEventsInterface.setMoneyCollectFieldDataForBulk(
        childDataList,
        { jobTransactionId: 1 },
        1,
        jobTransactionIdAmountMap,
        currentTime
      )
    ).toEqual(formLayoutObject);
  });
});
describe("convert formLayout to fieldData", () => {
  let formLayoutObject = {
    value: "1",
    positionId: 1,
    parentId: 0,
    fieldAttributeMasterId: 123,
    attributeTypeId: 6,
    key: "ac"
  };
  let currentTime = "12:10:10";
  const fieldData = {
    attributeTypeId: 6,
    dateTime: "12:10:10",
    fieldAttributeMasterId: 123,
    id: 1,
    jobTransactionId: 1,
    key: "ac",
    parentId: 0,
    positionId: 1,
    value: "1"
  };
  it("should cconvert formLayout to fieldData", () => {
    expect(
      formLayoutEventsInterface._convertFormLayoutToFieldData(
        formLayoutObject,
        1,
        1,
        currentTime
      )
    ).toEqual(fieldData);
  });
});
describe("convert _recursivelyFindChildData", () => {
  let childDataList = [
    {
      value: 3,
      jobTransactionId: 5,
      positionId: 3,
      parentId: 0,
      fieldAttributeMasterId: 1,
      key: 1,
      attributeTypeId: 1,
      childDataList: [
        {
          value: 4,
          jobTransactionId: 5,
          positionId: 4,
          parentId: 0,
          fieldAttributeMasterId: 1,
          key: 1,
          attributeTypeId: 1
        },
        {
          value: 5,
          jobTransactionId: 5,
          positionId: 5,
          parentId: 0,
          fieldAttributeMasterId: 1,
          key: 1,
          attributeTypeId: 1,
          childDataList: [
            {
              value: 6,
              jobTransactionId: 5,
              positionId: 6,
              parentId: 0,
              fieldAttributeMasterId: 1,
              key: 1,
              attributeTypeId: 1
            },
            {
              value: 7,
              jobTransactionId: 5,
              positionId: 7,
              parentId: 0,
              fieldAttributeMasterId: 1,
              key: 1,
              attributeTypeId: 1,
              childDataList: []
            }
          ]
        }
      ]
    },
    {
      value: 8,
      jobTransactionId: 5,
      positionId: 8,
      parentId: 0,
      fieldAttributeMasterId: 1,
      key: 1,
      attributeTypeId: 1
    }
  ];
  let formLayoutObject = {
    value: "1",
    positionId: 1,
    parentId: 0,
    fieldAttributeMasterId: 123,
    attributeTypeId: 6,
    key: "ac"
  };
  let currentTime = "12:10:10";
  const fieldData = {
    attributeTypeId: 6,
    dateTime: "12:10:10",
    fieldAttributeMasterId: 123,
    id: 1,
    jobTransactionId: 1,
    key: "ac",
    parentId: 0,
    positionId: 1,
    value: "1"
  };
  it("should find recursively childData and convert to fieldData ", () => {
    formLayoutEventsInterface._convertFormLayoutToFieldData = jest.fn();
    expect(
      formLayoutEventsInterface._recursivelyFindChildData(
        childDataList,
        [],
        { currentFieldDataId: 1 },
        currentTime
      )
    ).toEqual(7);
    expect(
      formLayoutEventsInterface._convertFormLayoutToFieldData
    ).toHaveBeenCalledTimes(6);
  });
});
describe("save FieldData For SkuArray In Bulk", () => {
  beforeEach(() => {
    formLayoutEventsInterface._convertFormLayoutToFieldData = jest.fn();
    formLayoutEventsInterface._recursivelyFindChildData = jest.fn();
  });

  let formLayoutObject = {
    value: "1",
    positionId: 1,
    parentId: 0,
    fieldAttributeMasterId: 123,
    attributeTypeId: 6,
    key: "ac"
  };
  let currentTime = "12:10:10";
  const fieldData = {
    attributeTypeId: 6,
    dateTime: "12:10:10",
    fieldAttributeMasterId: 123,
    id: 1,
    jobTransactionId: 1,
    key: "ac",
    parentId: 0,
    positionId: 1,
    value: "1",
    childDataList: {
      5: {
        value: 4,
        jobTransactionId: 5,
        positionId: 4,
        parentId: 0,
        fieldAttributeMasterId: 15,
        key: 2,
        attributeTypeId: 5,
        childDataList: [
          {
            value: 4,
            jobTransactionId: 5,
            positionId: 4,
            parentId: 0,
            fieldAttributeMasterId: 3,
            key: 4,
            attributeTypeId: 10
          }
        ]
      }
    }
  };
  it("should save fieldData for SkuArray in bulk", () => {
    let data = {
      currentFieldDataObject: { currentFieldDataId: 5 },
      skuArrayFieldData: [
        {
          attributeTypeId: 10,
          fieldAttributeMasterId: 3,
          jobTransactionId: 5,
          key: 4,
          parentId: 0,
          positionId: 4,
          value: 4
        }
      ]
    };

    formLayoutEventsInterface._convertFormLayoutToFieldData.mockReturnValueOnce(
      {
        value: 4,
        jobTransactionId: 5,
        positionId: 4,
        parentId: 0,
        fieldAttributeMasterId: 3,
        key: 4,
        attributeTypeId: 10
      }
    );
    formLayoutEventsInterface._recursivelyFindChildData.mockReturnValueOnce(5);
    expect(
      formLayoutEventsInterface._saveFieldDataForSkuArrayInBulk(
        fieldData,
        5,
        1,
        currentTime
      )
    ).toEqual(data);
  });
});
describe("test for _getDefaultValuesForJobTransaction", () => {
  let id = 1,
    status = { id: 1, code: 1 },
    jobMaster = { id: 1, code: 1 },
    user = { id: 1, cityId: 1, employeeCode: 1, company: { id: 1 } },
    hub = { id: 1, code: 1 },
    imei = {
      imeiNumber: 1
    },
    currentTime = "12:10:10",
    referenceNumber = user.id + "/" + hub.id + "/" + moment().valueOf();
  it("should return job transaction", () => {
    let jobTransaction = {
      id,
      runsheetNo: "AUTO-GEN",
      syncErp: false,
      userId: user.id,
      jobId: id,
      jobStatusId: status.id,
      companyId: user.company.id,
      actualAmount: 0.0,
      originalAmount: 0.0,
      moneyTransactionType: "",
      referenceNumber,
      runsheetId: null,
      hubId: hub.id,
      cityId: user.cityId,
      trackKm: 0.0,
      trackHalt: 0.0,
      trackCallCount: 0,
      trackCallDuration: 0,
      trackSmsCount: 0,
      trackTransactionTimeSpent: 0.0,
      jobCreatedAt: currentTime,
      erpSyncTime: currentTime,
      androidPushTime: currentTime,
      lastUpdatedAtServer: currentTime,
      lastTransactionTimeOnMobile: currentTime,
      deleteFlag: 0,
      attemptCount: 1,
      jobType: jobMaster.code,
      jobMasterId: jobMaster.id,
      employeeCode: user.employeeCode,
      hubCode: hub.code,
      statusCode: status.code,
      startTime: "00:00",
      endTime: "00:00",
      merchantCode: null,
      seqSelected: 0,
      seqAssigned: 0,
      seqActual: 0,
      latitude: 0.0,
      longitude: 0.0,
      trackBattery: 0,
      imeiNumber: imei.imeiNumber
    };
    expect(
      formLayoutEventsInterface._getDefaultValuesForJobTransaction(
        id,
        status,
        jobMaster,
        user,
        hub,
        imei,
        currentTime,
        referenceNumber
      )
    ).toEqual(jobTransaction);
  });
});

describe("test cases for _getDbObjects", () => {
  beforeEach(() => {
    keyValueDBService.getValueFromStore = jest.fn();
    realm.getRecordListOnQuery = jest.fn();
    formLayoutEventsInterface._getDefaultValuesForJobTransaction = jest.fn();
  });
  let status = { value: [{ id: 1, code: 1 }] },
    jobMaster = { value: [{ id: 1, code: 1 }] },
    user = { value: { id: 1, cityId: 1, employeeCode: 1, company: { id: 1 } } },
    hub = { value: { id: 1, code: 1 } },
    referenceNumber = 1,
    currentTime = "12:10:10",
    imei = { value: { imeiNumber: 1 } };
  it("returns job transaction array for single transaction form positive id", () => {
    keyValueDBService.getValueFromStore.mockReturnValueOnce(hub);
    keyValueDBService.getValueFromStore.mockReturnValueOnce(imei);
    keyValueDBService.getValueFromStore.mockReturnValueOnce(status);
    keyValueDBService.getValueFromStore.mockReturnValueOnce(jobMaster);
    realm.getRecordListOnQuery.mockReturnValue([{ id: 1 }]);
    let resultObject = {
      jobTransaction: { id: 1 },
      user,
      hub,
      imei,
      status: [{ id: 1, code: 1 }],
      jobMaster: [{ id: 1, code: 1 }]
    };
    return formLayoutEventsInterface
      ._getDbObjects(1, 1, 1, currentTime, user, { referenceNumber: 1 })
      .then(result => {
        expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(4);
        expect(result).toEqual(resultObject);
      });
  });
  it("returns job transaction array for single transaction in case of negative id", () => {
    keyValueDBService.getValueFromStore.mockReturnValueOnce(hub);
    keyValueDBService.getValueFromStore.mockReturnValueOnce(imei);
    keyValueDBService.getValueFromStore.mockReturnValueOnce(status);
    keyValueDBService.getValueFromStore.mockReturnValueOnce(jobMaster);
    formLayoutEventsInterface._getDefaultValuesForJobTransaction.mockReturnValue(
      [{ id: -1 }]
    );
    let resultObject = {
      jobTransaction: { 0: { id: -1 } },
      user,
      hub,
      imei,
      status: [{ id: 1, code: 1 }],
      jobMaster: [{ id: 1, code: 1 }]
    };
    return formLayoutEventsInterface
      ._getDbObjects(-1, 1, 1, currentTime, user, { referenceNumber: 1 })
      .then(result => {
        expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(4);
        expect(result).toEqual(resultObject);
      });
  });

  it("returns job transaction array for bulk", () => {
    keyValueDBService.getValueFromStore.mockReturnValueOnce(hub);
    keyValueDBService.getValueFromStore.mockReturnValueOnce(imei);
    keyValueDBService.getValueFromStore.mockReturnValueOnce(status);
    keyValueDBService.getValueFromStore.mockReturnValueOnce(jobMaster);
    realm.getRecordListOnQuery.mockReturnValue([{ id: 1 }]);
    let resultObject = {
      jobTransaction: [{ id: 1 }],
      user,
      hub,
      imei,
      status: [{ id: 1, code: 1 }],
      jobMaster: [{ id: 1, code: 1 }]
    };
    return formLayoutEventsInterface
      ._getDbObjects(1, 1, 1, currentTime, user, [{ jobTransactionId: 1 }])
      .then(result => {
        expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(4);
        expect(result).toEqual(resultObject);
      });
  });
});
describe("update jobSummary data ", () => {
  const jobSummary = {
    value: [
      {
        id: 2260120,
        userId: 4957,
        hubId: 2759,
        cityId: 744,
        companyId: 295,
        jobStatusId: 4814,
        count: 1
      },
      {
        id: 2260121,
        userId: 4957,
        hubId: 2759,
        cityId: 744,
        companyId: 295,
        jobStatusId: 4815,
        count: 2
      }
    ]
  };

  let jobTransaction = {
    id: 1,
    jobId: 2,
    jobMasterId: 3,
    jobStatusId: 4814,
    referenceNumber: "abc123",
    runsheetNo: "aks",
    runsheetId: 1234,
    seqSelected: 2
  };
  let nextStatusId = 4815;

  let newJobSummary = {
    value: [
      {
        id: 2260120,
        userId: 4957,
        hubId: 2759,
        cityId: 744,
        companyId: 295,
        jobStatusId: 4814,
        count: 0
      },
      {
        id: 2260121,
        userId: 4957,
        hubId: 2759,
        cityId: 744,
        companyId: 295,
        jobStatusId: 4815,
        count: 3
      }
    ]
  };

  it("should update job summary", () => {
    keyValueDBService.getValueFromStore = jest.fn();
    keyValueDBService.getValueFromStore.mockReturnValue(jobSummary);
    keyValueDBService.validateAndUpdateData = jest.fn();
    formLayoutEventsInterface
      ._updateJobSummary(jobTransaction, nextStatusId, null)
      .then(idList => {
        expect(idList).toEqual(newJobSummary);
        expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1);
        expect(keyValueDBService.validateAndUpdateData).toHaveBeenCalledTimes(
          1
        );
      });
  });
});

describe("update Runsheet Summary data ", () => {
  beforeEach(() => {
    runSheetService.filterTransactionOnRunsheetIdPresentAndPrepareTransactionQuery = jest.fn();
    jobStatusService.getStatusCategoryOnStatusId = jest.fn();
    realm.getRecordListOnQuery = jest.fn();
  });
  const runsheetSummary = [
    {
      id: 1,
      userId: 4957,
      hubId: 2759,
      runsheetNumber: "1",
      pendingCount: 0,
      successCount: 2,
      failCount: 0,
      cashCollected: 0
    },
    {
      id: 2,
      userId: 4957,
      hubId: 2759,
      runsheetNumber: "2",
      pendingCount: 1,
      successCount: 0,
      failCount: 0,
      cashCollected: 0
    }
  ];

  const jobTransactionList = [
    {
      id: 2521299,
      jobMasterId: 3,
      jobStatusId: 11,
      runsheetId: 1
    },
    {
      id: 2521219,
      jobMasterId: 4,
      jobStatusId: 12,
      runsheetId: 2
    },
    {
      id: 2521229,
      jobMasterId: 3,
      jobStatusId: 11,
      runsheetId: 2
    },
    {
      id: 2521239,
      jobMasterId: 3,
      jobStatusId: 13,
      runsheetId: 2
    }
  ];
  let nextStatusCategory = 3,
    prevStatusCategory = 1;

  const newRunsheetList = [
    {
      id: 2260,
      userId: 4957,
      hubId: 2759,
      runsheetNumber: "1",
      pendingCount: 0,
      successCount: 2,
      failCount: 0
    },
    {
      id: 2261,
      userId: 4957,
      hubId: 2759,
      runsheetNumber: "2",
      pendingCount: 0,
      successCount: 1,
      failCount: 0
    }
  ];

  let data = {
    tableName: TABLE_RUNSHEET,
    value: newRunsheetList
  };
  it("should not update runsheet summary", () => {
    let transactionWithRunsheetObject = {
      jobTransactionListWithRunsheetId: [],
      jobTransactionListWithRunsheetIdQuery: ""
    };
    runSheetService.filterTransactionOnRunsheetIdPresentAndPrepareTransactionQuery.mockReturnValue(
      transactionWithRunsheetObject
    );
    formLayoutEventsInterface
      ._updateRunsheetSummary(12, 3, jobTransactionList)
      .then(idList => {
        expect(idList).toEqual([]);
        expect(
          runSheetService.filterTransactionOnRunsheetIdPresentAndPrepareTransactionQuery
        ).toHaveBeenCalledTimes(1);
      });
  });

  it("should update runsheet summary", () => {
    let transactionWithRunsheetObject = {
      jobTransactionListWithRunsheetId: [
        {
          id: 2521299,
          jobMasterId: 3,
          jobStatusId: 11,
          runsheetId: 1,
          moneyTransactionType: "Collection-Cash",
          actualAmount: 20
        },
        {
          id: 2521219,
          jobMasterId: 4,
          jobStatusId: 12,
          runsheetId: 2,
          moneyTransactionType: "Collection-Cash",
          actualAmount: 20
        },
        {
          id: 2521229,
          jobMasterId: 3,
          jobStatusId: 11,
          runsheetId: 2,
          actualAmount: 20
        },
        {
          id: 2521239,
          jobMasterId: 3,
          jobStatusId: 13,
          runsheetId: 3,
          actualAmount: 20
        }
      ],
      jobTransactionListWithRunsheetIdQuery:
        "id = 2521299 OR id = 2521219 OR id = 2521229 OR id = 2521239"
    };
    runSheetService.filterTransactionOnRunsheetIdPresentAndPrepareTransactionQuery.mockReturnValue(
      transactionWithRunsheetObject
    );
    jobStatusService.getStatusCategoryOnStatusId.mockReturnValue(
      prevStatusCategory
    );
    realm.getRecordListOnQuery
      .mockReturnValueOnce(runsheetSummary)
      .mockReturnValueOnce([
        {
          id: 2521299,
          runsheetId: 1,
          moneyTransactionType: "Collection-Cash",
          actualAmount: 30
        }
      ]);
    formLayoutEventsInterface
      ._updateRunsheetSummary(12, 3, jobTransactionList)
      .then(idList => {
        expect(idList).toEqual([]);
        expect(
          runSheetService.filterTransactionOnRunsheetIdPresentAndPrepareTransactionQuery
        ).toHaveBeenCalledTimes(1);
        expect(
          jobStatusService.getStatusCategoryOnStatusId
        ).toHaveBeenCalledTimes(1);
        expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(2);
      });
  });
});

describe("update user summary after completing transactions", () => {
  // _updateUserSummary(jobTransaction, statusCategory, jobTransactionIdList,userSummary,jobTransactionValue)

  beforeEach(() => {
    jobStatusService.getStatusCategoryOnStatusId = jest.fn();
    keyValueDBService.validateAndSaveData = jest.fn();
  });
  const jobTransaction = [
    {
      id: 2521299,
      jobMasterId: 3,
      jobStatusId: 11,
      runsheetId: 1,
      lastUpdatedAtServer: "2018-12-10 12:12:12",
      moneyTransactionType: "Collection-Cash",
      actualAmount: 10
    }
  ];
  const jobTransactionValue = {
    lastTransactionTimeOnMobile: "2018-12-10 12:12:12",
    referenceNumber: "123"
  };
  let userSummary = {
    hubId: 24629,
    id: 233438,
    lastBattery: 54,
    lastCashCollected: 0,
    cashCollected: 0,
    lastLat: 28.5555772,
    lastLng: 77.2675903,
    pendingCount: 1,
    failCount: 0,
    successCount: 0,
    lastOrderTime: null,
    lastOrderNumber: null
  };
  it("should not update user summary db", () => {
    return formLayoutEventsInterface
      ._updateUserSummary(12, 3, null, userSummary, 11)
      .then(count => {
        expect(count).toEqual(undefined);
      });
  });
  it("should set update user summary db", () => {
    jobStatusService.getStatusCategoryOnStatusId.mockReturnValueOnce(1);
    return formLayoutEventsInterface
      ._updateUserSummary(12, 3, jobTransaction, userSummary, 11)
      .then(count => {
        expect(
          jobStatusService.getStatusCategoryOnStatusId
        ).toHaveBeenCalledTimes(1);
        expect(keyValueDBService.validateAndSaveData).toHaveBeenCalled();
      });
  });
});

describe("update job summary after completing transactions", () => {
  // _updateJobSummary(jobTransaction, statusId, jobTransactionIdList)

  beforeEach(() => {
    keyValueDBService.getValueFromStore = jest.fn();
    keyValueDBService.validateAndUpdateData = jest.fn();
  });
  const jobTransaction = {
    id: 2521299,
    jobMasterId: 3,
    jobStatusId: 11,
    runsheetId: 1,
    lastUpdatedAtServer: "2018-12-10 12:12:12"
  };
  const jobTransactionValue = {
    lastTransactionTimeOnMobile: "2018-12-10 12:12:12",
    referenceNumber: "123"
  };

  let jobSummary = {
    value: [
      {
        hubId: 24629,
        id: 1,
        userId: 54,
        jobMasterId: 123,
        jobStatusId: 11,
        count: 0,
        updatedTime: null
      },
      {
        hubId: 24629,
        id: 2,
        userId: 54,
        jobMasterId: 124,
        jobStatusId: 11,
        count: 1,
        updatedTime: null
      },
      {
        hubId: 24629,
        id: 3,
        userId: 54,
        jobMasterId: 125,
        jobStatusId: 3,
        count: 2,
        updatedTime: null
      }
    ]
  };
  it("should set update user summary db", () => {
    keyValueDBService.getValueFromStore.mockReturnValueOnce(jobSummary);
    formLayoutEventsInterface
      ._updateJobSummary(jobTransaction, 3, null)
      .then(() => {
        expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1);
        expect(keyValueDBService.validateAndUpdateData).toHaveBeenCalledTimes(
          1
        );
      });
  });
});

describe("save data to db", () => {
  let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

  let formLayoutMap = {
    1: {
      attributeTypeId: 61,
      fieldAttributeMasterId: 1,
      value: 1
    },
    2: {
      attributeTypeId: 23,
      fieldAttributeMasterId: 2,
      value: 2
    },
    3: {
      attributeTypeId: 58,
      fieldAttributeMasterId: 3,
      value: 3,
      childDataList: []
    },
    4: {
      attributeTypeId: 33,
      fieldAttributeMasterId: 4,
      value: 4
    },
    5: {
      attributeTypeId: 18,
      fieldAttributeMasterId: 5,
      jobTransactionIdAmountMap: {
        actualAmount: 10,
        originalAmount: 10,
        moneyTransactionType: "cash"
      },
      value: 5,
      childDataList: []
    },
    6: {
      attributeTypeId: 17,
      fieldAttributeMasterId: 6,
      value: 6,
      childDataList: { 5: { childDataList: [] } }
    }
  };
  let fieldDataArray = [
    {
      id: 2,
      jobTransactionId: 5,
      key: "d",
      parentId: 0,
      positionId: 0,
      value: "dd",
      fieldAttributeMasterId: 1,
      attributeTypeId: 1,
      dateTime: currentTime
    },
    {
      id: 3,
      value: "3",
      jobTransactionId: 5,
      positionId: 3,
      parentId: 0,
      fieldAttributeMasterId: 1,
      key: 1,
      attributeTypeId: 1,
      dateTime: currentTime
    },
    undefined,
    undefined,
    undefined
  ];
  it("should save field data", () => {
    let childDataList = [
      {
        value: 3,
        jobTransactionId: 5,
        positionId: 3,
        parentId: 0,
        fieldAttributeMasterId: 1,
        key: 1,
        attributeTypeId: 1,
        childDataList: [
          {
            value: 4,
            jobTransactionId: 5,
            positionId: 4,
            parentId: 0,
            fieldAttributeMasterId: 1,
            key: 1,
            attributeTypeId: 1
          },
          {
            value: 5,
            jobTransactionId: 5,
            positionId: 5,
            parentId: 0,
            fieldAttributeMasterId: 1,
            key: 1,
            attributeTypeId: 1,
            childDataList: [
              {
                value: 6,
                jobTransactionId: 5,
                positionId: 6,
                parentId: 0,
                fieldAttributeMasterId: 1,
                key: 1,
                attributeTypeId: 1
              },
              {
                value: 7,
                jobTransactionId: 5,
                positionId: 7,
                parentId: 0,
                fieldAttributeMasterId: 1,
                key: 1,
                attributeTypeId: 1,
                childDataList: []
              }
            ]
          }
        ]
      },
      {
        value: 8,
        jobTransactionId: 5,
        positionId: 8,
        parentId: 0,
        fieldAttributeMasterId: 1,
        key: 1,
        attributeTypeId: 1
      }
    ];

    formLayoutMap[4].childDataList = childDataList;
    formLayoutMap[1].value = "dd";
    realm.getRecordListOnQuery = jest.fn();
    formLayoutEventsInterface._convertFormLayoutToFieldData = jest.fn();
    formLayoutEventsInterface._convertFormLayoutToFieldData
      .mockReturnValueOnce(fieldDataArray[0])
      .mockReturnValueOnce(fieldDataArray[1]);
    realm.getRecordListOnQuery.mockReturnValue([1]);
    expect(
      formLayoutEventsInterface._saveFieldData(
        formLayoutMap,
        5,
        null,
        currentTime
      )
    ).toEqual({
      tableName: TABLE_FIELD_DATA,
      value: fieldDataArray,
      npsFeedbackValue: null,
      reAttemptDate: 4,
      moneyCollectObject: null,
      skuArrayObject: null,
      amountMap: {
        originalAmount: 10,
        actualAmount: 10,
        moneyTransactionType: "cash"
      }
    });
  });
  it("should save data in db in case of bulk ", () => {
    let data = {
      amountMap: {
        actualAmount: null,
        moneyTransactionType: null,
        originalAmount: null
      },
      moneyCollectObject: {
        attributeTypeId: 18,
        childDataList: [],
        fieldAttributeMasterId: 5,
        jobTransactionIdAmountMap: {
          actualAmount: 10,
          moneyTransactionType: "cash",
          originalAmount: 10
        },
        value: 5
      },
      npsFeedbackValue: null,
      reAttemptDate: 4,
      skuArrayObject: {
        attributeTypeId: 17,
        childDataList: [],
        fieldAttributeMasterId: 6,
        value: 6
      },
      tableName: "TABLE_FIELD_DATA",
      value: [
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: 2,
          jobTransactionId: 5,
          key: "d",
          parentId: 0,
          positionId: 0,
          value: "dd"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: 3,
          jobTransactionId: 5,
          key: 1,
          parentId: 0,
          positionId: 3,
          value: "3"
        },
        undefined
      ]
    };

    realm.getRecordListOnQuery = jest.fn();
    formLayoutEventsInterface._convertFormLayoutToFieldData = jest.fn();
    formLayoutEventsInterface._convertFormLayoutToFieldData
      .mockReturnValueOnce(fieldDataArray[0])
      .mockReturnValueOnce(fieldDataArray[1]);
    realm.getRecordListOnQuery.mockReturnValue([1]);
    expect(
      formLayoutEventsInterface._saveFieldData(
        formLayoutMap,
        5,
        true,
        currentTime
      )
    ).toEqual(data);
  });

  it("should save data in db", () => {
    formLayoutEventsInterface._getDbObjects = jest.fn();
    formLayoutEventsInterface._getDbObjects.mockReturnValue({
      jobTransaction: {
        jobId: 1
      },
      user: {
        employeeCode: 1234
      },
      hub: {
        code: 1
      },
      imei: {
        imeiNumber: 12345
      },
      jobMaster: [
        {
          code: "jobMaster"
        }
      ],
      status: [
        {
          id: 1,
          code: "success",
          actionOnStatus: 3
        }
      ]
    });

    realm.getRecordListOnQuery = jest.fn();
    realm.getRecordListOnQuery.mockReturnValue({
      job: {}
    });
    formLayoutEventsInterface._setJobTransactionValues = jest.fn();
    formLayoutEventsInterface._setJobTransactionValues.mockReturnValue({
      tableName: "TABLE_JOB_TRANSACTION",
      value: [],
      jobTransactionDTOList: []
    });
    formLayoutEventsInterface._updateRunsheetSummary = jest.fn();
    formLayoutEventsInterface._updateUserSummary = jest.fn();
    formLayoutEventsInterface._updateJobSummary = jest.fn();

    formLayoutEventsInterface._updateRunsheetSummary.mockReturnValue({});
    realm.performBatchSave = jest.fn();
    formLayoutEventsInterface.saveDataInDb(formLayoutMap, 5, 1);
  });
});

describe("save fieldData for bulk", () => {
  beforeEach(() => {
    formLayoutEventsInterface._saveFieldData = jest.fn();
    formLayoutEventsInterface.setMoneyCollectFieldDataForBulk = jest.fn();
    formLayoutEventsInterface._convertFormLayoutToFieldData = jest.fn();
    formLayoutEventsInterface._saveFieldDataForSkuArrayInBulk = jest.fn();
  });
  let formLayoutMap = {};
  formLayoutMap[1] = {
    label: "rr",
    subLabel: "d",
    helpText: "d",
    key: "d",
    required: true,
    hidden: false,
    attributeTypeId: 1,
    fieldAttributeMasterId: 1,
    positionId: 0,
    parentId: 0,
    showHelpText: false,
    editable: false,
    focus: true,
    validation: []
  };
  formLayoutMap[2] = {
    label: "ds",
    subLabel: "d",
    helpText: "w",
    key: "dd",
    required: false,
    hidden: true,
    attributeTypeId: 1,
    fieldAttributeMasterId: 1,
    positionId: 0,
    parentId: 0,
    showHelpText: true,
    editable: false,
    focus: false,
    validation: []
  };
  let jobTransactionList = [{ jobTransactionId: 5 }, { jobTransactionId: 6 }];
  let moneyCollectObject = {
    jobTransactionIdAmountMap: { 5: { actualAmount: 10, originalAmount: 10 } }
  };
  let skuArrayObject = {};
  let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

  let fieldDataArray = [
    {
      id: 2,
      jobTransactionId: 5,
      key: "d",
      parentId: 0,
      positionId: 0,
      value: "dd",
      fieldAttributeMasterId: 1,
      attributeTypeId: 1,
      dateTime: currentTime
    },
    {
      id: 3,
      value: "3",
      jobTransactionId: 5,
      positionId: 3,
      parentId: 0,
      fieldAttributeMasterId: 1,
      key: 1,
      attributeTypeId: 1,
      dateTime: currentTime
    },
    {
      id: 4,
      value: "4",
      jobTransactionId: 5,
      positionId: 4,
      parentId: 0,
      fieldAttributeMasterId: 1,
      key: 1,
      attributeTypeId: 1,
      dateTime: currentTime
    },
    {
      id: 5,
      value: "5",
      jobTransactionId: 6,
      positionId: 5,
      parentId: 0,
      fieldAttributeMasterId: 1,
      key: 1,
      attributeTypeId: 1,
      dateTime: currentTime
    },
    {
      id: 6,
      value: "6",
      jobTransactionId: 5,
      positionId: 6,
      parentId: 0,
      fieldAttributeMasterId: 1,
      key: 1,
      attributeTypeId: 1,
      dateTime: currentTime
    },
    {
      id: 7,
      value: "7",
      jobTransactionId: 6,
      positionId: 7,
      parentId: 0,
      fieldAttributeMasterId: 1,
      key: 1,
      attributeTypeId: 1,
      dateTime: currentTime
    },
    {
      id: 8,
      value: "8",
      jobTransactionId: 5,
      positionId: 8,
      parentId: 0,
      fieldAttributeMasterId: 1,
      key: 1,
      attributeTypeId: 1,
      dateTime: currentTime
    },
    {
      id: 9,
      value: null,
      jobTransactionId: 6,
      positionId: 0,
      parentId: 0,
      fieldAttributeMasterId: 1,
      key: "dd",
      attributeTypeId: 1,
      dateTime: currentTime
    }
  ];
  it("should save field data for bulk", () => {
    formLayoutEventsInterface._saveFieldData.mockReturnValueOnce({
      tableName: TABLE_FIELD_DATA,
      value: fieldDataArray,
      npsFeedbackValue: null,
      reAttemptDate: null,
      moneyCollectObject,
      skuArrayObject,
      amountMap: {
        originalAmount: null,
        actualAmount: null,
        moneyTransactionType: null
      }
    });
    let childDataList = [
      {
        value: 3,
        jobTransactionId: 5,
        positionId: 3,
        parentId: 0,
        fieldAttributeMasterId: 1,
        key: 1,
        attributeTypeId: 1,
        childDataList: [
          {
            value: 4,
            jobTransactionId: 5,
            positionId: 4,
            parentId: 0,
            fieldAttributeMasterId: 1,
            key: 1,
            attributeTypeId: 1
          },
          {
            value: 5,
            jobTransactionId: 5,
            positionId: 5,
            parentId: 0,
            fieldAttributeMasterId: 1,
            key: 1,
            attributeTypeId: 1,
            childDataList: [
              {
                value: 6,
                jobTransactionId: 5,
                positionId: 6,
                parentId: 0,
                fieldAttributeMasterId: 1,
                key: 1,
                attributeTypeId: 1
              },
              {
                value: 7,
                jobTransactionId: 5,
                positionId: 7,
                parentId: 0,
                fieldAttributeMasterId: 1,
                key: 1,
                attributeTypeId: 1,
                childDataList: []
              }
            ]
          }
        ]
      },
      {
        value: 8,
        jobTransactionId: 5,
        positionId: 8,
        parentId: 0,
        fieldAttributeMasterId: 1,
        key: 1,
        attributeTypeId: 1
      }
    ];
    let data = {
      amountMap: { "5": { actualAmount: 10, originalAmount: 10 } },
      npsFeedbackValue: null,
      reAttemptDate: null,
      tableName: "TABLE_FIELD_DATA",
      value: [
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: 2,
          jobTransactionId: 5,
          key: "d",
          parentId: 0,
          positionId: 0,
          value: "dd"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: 3,
          jobTransactionId: 5,
          key: 1,
          parentId: 0,
          positionId: 3,
          value: "3"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: 4,
          jobTransactionId: 5,
          key: 1,
          parentId: 0,
          positionId: 4,
          value: "4"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: 5,
          jobTransactionId: 6,
          key: 1,
          parentId: 0,
          positionId: 5,
          value: "5"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: 6,
          jobTransactionId: 5,
          key: 1,
          parentId: 0,
          positionId: 6,
          value: "6"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: 7,
          jobTransactionId: 6,
          key: 1,
          parentId: 0,
          positionId: 7,
          value: "7"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: 8,
          jobTransactionId: 5,
          key: 1,
          parentId: 0,
          positionId: 8,
          value: "8"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: 9,
          jobTransactionId: 6,
          key: "dd",
          parentId: 0,
          positionId: 0,
          value: null
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: 4,
          jobTransactionId: 5,
          key: 1,
          parentId: 0,
          positionId: 4,
          value: "4"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: 2,
          jobTransactionId: 5,
          key: "d",
          parentId: 0,
          positionId: 0,
          value: "dd"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: 3,
          jobTransactionId: 5,
          key: 1,
          parentId: 0,
          positionId: 3,
          value: "3"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: 6,
          jobTransactionId: 5,
          key: 1,
          parentId: 0,
          positionId: 6,
          value: "6"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: NaN,
          jobTransactionId: 6,
          key: "d",
          parentId: 0,
          positionId: 0,
          value: "dd"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: NaN,
          jobTransactionId: 6,
          key: 1,
          parentId: 0,
          positionId: 3,
          value: "3"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: NaN,
          jobTransactionId: 6,
          key: 1,
          parentId: 0,
          positionId: 4,
          value: "4"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: NaN,
          jobTransactionId: 6,
          key: 1,
          parentId: 0,
          positionId: 5,
          value: "5"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: NaN,
          jobTransactionId: 6,
          key: 1,
          parentId: 0,
          positionId: 6,
          value: "6"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: NaN,
          jobTransactionId: 6,
          key: 1,
          parentId: 0,
          positionId: 7,
          value: "7"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: NaN,
          jobTransactionId: 6,
          key: 1,
          parentId: 0,
          positionId: 8,
          value: "8"
        },
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: NaN,
          jobTransactionId: 6,
          key: "dd",
          parentId: 0,
          positionId: 0,
          value: null
        },
        undefined,
        {
          attributeTypeId: 1,
          dateTime: currentTime,
          fieldAttributeMasterId: 1,
          id: 5,
          jobTransactionId: 6,
          key: 1,
          parentId: 0,
          positionId: 5,
          value: "5"
        }
      ]
    };
    formLayoutMap[1].childDataList = childDataList;
    formLayoutMap[1].value = "dd";
    realm.getRecordListOnQuery = jest.fn();
    formLayoutEventsInterface._convertFormLayoutToFieldData = jest.fn();
    formLayoutEventsInterface._convertFormLayoutToFieldData.mockReturnValueOnce(
      fieldDataArray[0]
    );
    formLayoutEventsInterface.setMoneyCollectFieldDataForBulk
      .mockReturnValueOnce({ fieldDataArray: fieldDataArray[1], lastId: 3 })
      .mockReturnValueOnce({ fieldDataArray: fieldDataArray[3], lastId: 5 });
    formLayoutEventsInterface._saveFieldDataForSkuArrayInBulk
      .mockReturnValueOnce({
        skuArrayFieldData: fieldDataArray[2],
        currentFieldDataObject: 4
      })
      .mockReturnValueOnce({
        skuArrayFieldData: fieldDataArray[4],
        currentFieldDataObject: 46
      });
    expect(
      formLayoutEventsInterface._saveFieldDataForBulk(
        formLayoutMap,
        jobTransactionList,
        currentTime
      )
    ).toEqual(data);
  });
});

describe("find next focusable and editable elements", () => {
  beforeEach(() => {
    formLayoutEventsInterface.updateFieldInfo = jest.fn();
    fieldValidationService.fieldValidations = jest.fn();
  });
  let formLayoutObject = {
    1: {
      label: "rr",
      subLabel: "d",
      helpText: "d",
      key: "name",
      required: true,
      hidden: false,
      attributeTypeId: 1,
      fieldAttributeMasterId: 1,
      positionId: 0,
      parentId: 0,
      showHelpText: false,
      editable: false,
      focus: true,
      validation: [],
      displayValue: 12,
      value: "xyz"
    },
    2: {
      label: "ds",
      subLabel: "d",
      helpText: "w",
      key: "contact",
      required: true,
      hidden: true,
      attributeTypeId: 2,
      fieldAttributeMasterId: 2,
      positionId: 0,
      parentId: 0,
      showHelpText: true,
      editable: false,
      focus: false,
      validation: [],
      value: "123456"
    }
  };
  it("when both elements are required and current element is last element", () => {
    fieldValidationService.fieldValidations
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);
    expect(
      formLayoutEventsInterface.findNextFocusableAndEditableElement(
        1,
        formLayoutObject,
        false,
        "a",
        [],
        "NEXT_FOCUS",
        { id: 1 },
        null,
        null,
        [1, 2]
      )
    ).toEqual({
      formLayoutObject,
      isSaveDisabled: false,
      isAllAttributeHidden: true
    });
  });
  it("when  one elements required and other are  not required and current element is last element", () => {
    formLayoutObject = {
      2: {
        label: "ds",
        subLabel: "d",
        helpText: "w",
        key: "contact",
        required: false,
        hidden: true,
        attributeTypeId: 2,
        fieldAttributeMasterId: 2,
        positionId: 0,
        parentId: 0,
        showHelpText: true,
        editable: false,
        focus: false,
        validation: [],
        value: null
      },
      3: {
        label: "ds",
        subLabel: "d",
        helpText: "w",
        key: "contact",
        required: true,
        hidden: true,
        attributeTypeId: 2,
        fieldAttributeMasterId: 2,
        positionId: 0,
        parentId: 0,
        showHelpText: true,
        editable: false,
        focus: false,
        validation: [],
        value: null
      }
    };
    fieldValidationService.fieldValidations
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);
    expect(
      formLayoutEventsInterface.findNextFocusableAndEditableElement(
        2,
        formLayoutObject,
        false,
        "a",
        [],
        "NEXT_FOCUS",
        { id: 1 },
        null,
        null,
        [2, 3]
      )
    ).toEqual({
      formLayoutObject,
      isSaveDisabled: true,
      isAllAttributeHidden: true
    });
  });
  it("when single elements are not required and current element value is null", () => {
    formLayoutObject = {
      2: {
        label: "ds",
        subLabel: "d",
        helpText: "w",
        key: "contact",
        required: false,
        hidden: false,
        attributeTypeId: 2,
        fieldAttributeMasterId: 2,
        positionId: 0,
        parentId: 0,
        showHelpText: true,
        editable: false,
        focus: false,
        validation: [],
        value: null
      }
    };
    fieldValidationService.fieldValidations
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);
    expect(
      formLayoutEventsInterface.findNextFocusableAndEditableElement(
        1,
        formLayoutObject,
        false,
        "a",
        [],
        "NEXT_FOCUS",
        { id: 1 },
        null,
        null,
        [2]
      )
    ).toEqual({
      formLayoutObject,
      isSaveDisabled: false,
      isAllAttributeHidden: false
    });
  });
  it("when single elements are required and current element value is null", () => {
    formLayoutObject = {
      2: {
        label: "ds",
        subLabel: "d",
        helpText: "w",
        key: "contact",
        required: true,
        hidden: false,
        attributeTypeId: 2,
        fieldAttributeMasterId: 2,
        positionId: 0,
        parentId: 0,
        showHelpText: true,
        editable: false,
        focus: false,
        validation: [],
        value: null
      }
    };
    fieldValidationService.fieldValidations
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);
    expect(
      formLayoutEventsInterface.findNextFocusableAndEditableElement(
        1,
        formLayoutObject,
        false,
        "a",
        [],
        "FOCUS",
        { id: 1 },
        null,
        null,
        [2]
      )
    ).toEqual({
      formLayoutObject,
      isSaveDisabled: true,
      isAllAttributeHidden: false
    });
  });
  it("when single elements are required and has attributeTypeId equals 44", () => {
    formLayoutObject = {
      2: {
        label: "ds",
        subLabel: "d",
        helpText: "w",
        key: "contact",
        required: true,
        hidden: false,
        attributeTypeId: 44,
        fieldAttributeMasterId: 2,
        positionId: 0,
        parentId: 0,
        showHelpText: true,
        editable: false,
        focus: false,
        validation: [],
        value: null
      }
    };
    fieldValidationService.fieldValidations
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);
    expect(
      formLayoutEventsInterface.findNextFocusableAndEditableElement(
        1,
        formLayoutObject,
        false,
        "a",
        [],
        "NEXT_FOCUS",
        { id: 1 },
        null,
        null,
        [2]
      )
    ).toEqual({
      formLayoutObject,
      isSaveDisabled: true,
      isAllAttributeHidden: false
    });
  });
  it("when single elements are required and current element is last element with value", () => {
    formLayoutObject = {
      2: {
        label: "ds",
        subLabel: "d",
        helpText: "w",
        key: "contact",
        required: true,
        hidden: false,
        attributeTypeId: 4,
        fieldAttributeMasterId: 2,
        positionId: 0,
        parentId: 0,
        showHelpText: true,
        editable: false,
        focus: false,
        validation: [],
        value: 10
      }
    };
    fieldValidationService.fieldValidations
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);
    expect(
      formLayoutEventsInterface.findNextFocusableAndEditableElement(
        1,
        formLayoutObject,
        false,
        "a",
        [],
        "NEXT_FOCUS",
        { id: 1 },
        null,
        null,
        [2]
      )
    ).toEqual({
      formLayoutObject,
      isSaveDisabled: true,
      isAllAttributeHidden: false
    });
  });

  // it('when both elements are required and current element is not last element', () => {
  //     let formLayoutObject = new Map(formLayoutMap);
  //     formLayoutObject.get(2).value = null;
  //     formLayoutObject.get(2).focus = true;
  //     formLayoutObject.get(2).editable = true;
  //     let isSaveDisabled = true;
  //     const expectedObject = { formLayoutObject, nextEditable, isSaveDisabled }
  //     expect(formLayoutEventsInterface.findNextFocusableAndEditableElement(1, formLayoutObject, nextEditable, true, 'a')).toEqual(expectedObject);
  // })

  // it('when both elements are required and other required does not contain value', () => {
  //     let formLayoutObject = new Map(formLayoutMap);
  //     formLayoutObject.get(2).value = 'a';
  //     formLayoutObject.get(1).value = null;
  //     let isSaveDisabled = true;
  //     expect(formLayoutEventsInterface.findNextFocusableAndEditableElement(2, formLayoutObject, nextEditable, true, 'a')).toEqual({
  //         formLayoutObject,
  //         nextEditable,
  //         isSaveDisabled
  //     });
  // })
});

describe("test for _updateTransactionLogs", () => {
  let jobTransaction = {
    1: {
      id: 1,
      hubId: 1,
      cityId: 1,
      companyId: 1
    }
  };
  let statusId = 2;
  let prevStatusId = 3;
  let jobMasterId = 1;
  let user = {
    value: { id: 1 }
  };
  let lastTrackLog = {
    latitude: 123,
    longitude: 123
  };
  let dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
  let result = {
    tableName: "TABLE_TRANSACTION_LOGS",
    value: [
      {
        userId: user.value.id,
        transactionId: jobTransaction[1].id,
        jobMasterId: jobMasterId,
        toJobStatusId: statusId,
        fromJobStatusId: prevStatusId,
        latitude: lastTrackLog.latitude,
        longitude: lastTrackLog.longitude,
        transactionTime: dateTime,
        updatedAt: dateTime,
        hubId: jobTransaction[1].hubId,
        cityId: jobTransaction[1].cityId,
        companyId: jobTransaction[1].companyId
      }
    ]
  };
  it("should return transaction logs dto", () => {
    expect(
      formLayoutEventsInterface._updateTransactionLogs(
        jobTransaction,
        statusId,
        prevStatusId,
        jobMasterId,
        user,
        lastTrackLog
      )
    ).toEqual(result);
  });
});

describe("test for changeJobTransactionIdInCaseOfNewJob", () => {
  it("should return transaction id in case of no new job", () => {
    expect(
      formLayoutEventsInterface.changeJobTransactionIdInCaseOfNewJob(1, [])
    ).toEqual(1);
  });

  it("should return -1 job tramsaction id", () => {
    realm.getRecordListOnQuery.mockReturnValue([]);
    expect(
      formLayoutEventsInterface.changeJobTransactionIdInCaseOfNewJob(-2, [])
    ).toEqual(-2);
  });

  it("should return most negative job tramsaction id", () => {
    realm.getRecordListOnQuery = jest.fn();
    realm.getRecordListOnQuery.mockReturnValue([
      {
        id: -3
      }
    ]);
    expect(
      formLayoutEventsInterface.changeJobTransactionIdInCaseOfNewJob(-2, {
        jobId: -2
      })
    ).toEqual(-4);
  });
});
describe("test for prepare Transaction Logs", () => {
  it("should prepare transaction log", () => {
    let jobTransactions = [
      {
        id: 1,
        referenceNo: 12,
        hubId: 4,
        cityId: 7,
        companyId: 4
      }
    ];
    let time = moment().valueOf();
    let data = [
      {
        cityId: 7,
        companyId: 4,
        fromJobStatusId: 1,
        hubId: 4,
        jobMasterId: 123,
        latitude: 1,
        longitude: 2,
        toJobStatusId: 2,
        transactionId: 1,
        transactionTime: time,
        updatedAt: time,
        userId: 14
      }
    ];

    expect(
      formLayoutEventsInterface._prepareTransactionLogsData(
        1,
        2,
        jobTransactions,
        123,
        { id: 14 },
        time,
        { latitude: 1, longitude: 2 }
      )
    ).toEqual(data);
  });
});

describe("test for get RunsheetId To Updated JobTransactions", () => {
  let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
  let jobTransactions = [
    {
      id: 1,
      referenceNo: 12,
      hubId: 4,
      cityId: 7,
      companyId: 4,
      runsheetId: 1,
      seqSelected: 1,
      jobEtaTime: "2017-09-09 11:11:11"
    }
  ];
  it("should get runsheetId to updated jobTransactions", () => {
    return formLayoutEventsInterface
      ._getRunsheetIdToUpdateJobTransactions(jobTransactions, currentTime, 3)
      .then(data => {
        expect(data).toEqual(undefined);
      });
  });
});

describe("test for update EtaTime Of JobTransactions", () => {
  beforeEach(() => {
    jobStatusService.getNonUnseenStatusIdsForStatusCategory = jest.fn();
    realm.getRecordListOnQuery = jest.fn();
    realm.saveList = jest.fn();
  });
  it("should update etaTime of jobTransactions", () => {
    let runsheetIdToJobTransactionMap = { 1: 4, 2: 5 };
    let jobTransactions = [
      {
        id: 1,
        referenceNo: 12,
        hubId: 4,
        cityId: 7,
        companyId: 4,
        jobEtaTime: moment().format("YYYY-MM-DD HH:mm:ss")
      }
    ];
    realm.getRecordListOnQuery.mockReturnValueOnce(jobTransactions);
    jobStatusService.getNonUnseenStatusIdsForStatusCategory.mockReturnValueOnce(
      [1, 2, 3.4]
    );
    return formLayoutEventsInterface
      ._updateEtaTimeOfJobtransactions(1, runsheetIdToJobTransactionMap)
      .then(data => {
        expect(data).toEqual(undefined);
        expect(
          jobStatusService.getNonUnseenStatusIdsForStatusCategory
        ).toHaveBeenCalledTimes(1);
        expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(2);
        expect(realm.saveList).toHaveBeenCalledTimes(1);
      });
  });
});

describe("test for makeNegativeJobTransactionId", () => {
  it("should return -1 jobTransactionId in case of empty jobTransaction", () => {
    realm.getRecordListOnQuery.mockReturnValue([]);
    expect(formLayoutEventsInterface.makeNegativeJobTransactionId()).toEqual(
      -1
    );
  });

  it("should return most negative job tramsaction id", () => {
    realm.getRecordListOnQuery = jest.fn();
    realm.getRecordListOnQuery.mockReturnValue([
      {
        id: -3
      }
    ]);
    expect(formLayoutEventsInterface.makeNegativeJobTransactionId()).toEqual(
      -4
    );
  });
});

describe("test for _getDefaultValuesForJob", () => {
  let id = 1,
    status = { id: 1, code: 1 },
    jobMasterId = 1,
    user = { id: 1, cityId: 1, employeeCode: 1, company: { id: 1 } },
    hub = { id: 1, code: 1 },
    referenceNumber = 1,
    currentTime = "12:10:10";
  it("should return job transaction", () => {
    let time = moment().valueOf();
    let jobTransaction = {
      id,
      referenceNo: referenceNumber,
      hubId: hub ? hub.id : null,
      cityId: user ? user.cityId : null,
      companyId: user && user.company ? user.company.id : null,
      jobMasterId,
      status: 3,
      latitude: 0.0,
      longitude: 0.0,
      slot: 0,
      merchantCode: null,
      jobStartTime: currentTime,
      createdAt: currentTime,
      attemptCount: 1,
      missionId: null,
      jobEndTime: null,
      currentProcessId: null
    };
    expect(
      formLayoutEventsInterface._getDefaultValuesForJob(
        jobMasterId,
        id,
        user,
        hub,
        referenceNumber,
        currentTime
      )
    ).toEqual(jobTransaction);
  });
});

describe("test for _setBulkJobDbValues", () => {
  let jobTransactions = [
    {
      id: 1,
      jobId: 1
    }
  ];
  it("should return job with status 3", () => {
    let status = {
      actionOnStatus: 1
    };
    let result = [
      {
        jobId: 1,
        status: 3,
        id: 1
      }
    ];
    realm.getRecordListOnQuery = jest.fn();
    realm.getRecordListOnQuery.mockReturnValue(jobTransactions);
    expect(
      formLayoutEventsInterface._setBulkJobDbValues(status, jobTransactions)
    ).toEqual({
      tableName: TABLE_JOB,
      value: result
    });
  });
  it("should return job with status 1", () => {
    let status = {
      actionOnStatus: 2
    };
    let result = [
      {
        jobId: 1,
        status: 1,
        id: 1
      }
    ];
    realm.getRecordListOnQuery = jest.fn();
    realm.getRecordListOnQuery.mockReturnValue(jobTransactions);
    expect(
      formLayoutEventsInterface._setBulkJobDbValues(status, jobTransactions)
    ).toEqual({
      tableName: TABLE_JOB,
      value: result
    });
  });
  it("should return job with status 4", () => {
    let status = {
      actionOnStatus: 3
    };
    let result = [
      {
        jobId: 1,
        status: 4,
        id: 1
      }
    ];
    realm.getRecordListOnQuery = jest.fn();
    realm.getRecordListOnQuery.mockReturnValue(jobTransactions);
    expect(
      formLayoutEventsInterface._setBulkJobDbValues(status, jobTransactions)
    ).toEqual({
      tableName: TABLE_JOB,
      value: result
    });
  });
  it("should return job with re attempt date", () => {
    let status = {
        actionOnStatus: 1
      },
      referenceNumber = 1;
    let result = [
      {
        jobId: 1,
        status: 3,
        id: 1,
        jobStartTime: "2099-12-12 00:00:00"
      }
    ];
    let reAttemptDate = "2099-12-12";
    realm.getRecordListOnQuery = jest.fn();
    realm.getRecordListOnQuery.mockReturnValue(jobTransactions);
    expect(
      formLayoutEventsInterface._setBulkJobDbValues(
        status,
        jobTransactions,
        1,
        null,
        null,
        reAttemptDate
      )
    ).toEqual({
      tableName: TABLE_JOB,
      value: result
    });
  });
});

describe("test for _setJobDbValues", () => {
  let jobTransactions = [
    {
      id: 1,
      jobId: 1
    }
  ];

  let id = 1,
    status = { id: 1, code: 1 },
    jobMaster = { id: 1, code: 1 },
    user = { id: 1, cityId: 1, employeeCode: 1, company: { id: 1 } },
    hub = { id: 1, code: 1 },
    imei = {
      imeiNumber: 1
    },
    currentTime = "12:10:10";
  it("should return job with status 3", () => {
    let status = {
      actionOnStatus: 1
    };
    let result = [
      {
        jobId: 1,
        status: 3,
        id: 1
      }
    ];
    realm.getRecordListOnQuery = jest.fn();
    realm.getRecordListOnQuery.mockReturnValue(jobTransactions);
    expect(formLayoutEventsInterface._setJobDbValues(status, id)).toEqual({
      tableName: TABLE_JOB,
      value: result
    });
  });
  it("should return job with status 3", () => {
    let status = {
        actionOnStatus: 1
      },
      referenceNumber = 1;
    let result = [
      {
        status: 4,
        id: -1,
        referenceNo: referenceNumber,
        hubId: hub ? hub.id : null,
        cityId: user ? user.cityId : null,
        companyId: user && user.company ? user.company.id : null,
        jobMasterId: jobMaster.id,
        status: 3,
        latitude: 0.0,
        longitude: 0.0,
        slot: 0,
        merchantCode: null,
        jobStartTime: currentTime,
        createdAt: currentTime,
        attemptCount: 1,
        missionId: null,
        jobEndTime: null,
        currentProcessId: null
      }
    ];
    realm.getRecordListOnQuery = jest.fn();
    realm.getRecordListOnQuery.mockReturnValue(jobTransactions);
    expect(
      formLayoutEventsInterface._setJobDbValues(
        status,
        -1,
        jobMaster.id,
        user,
        hub,
        referenceNumber,
        currentTime,
        null,
        { latitude: 0, longitude: 0 }
      )
    ).toEqual({
      tableName: TABLE_JOB,
      value: result
    });
  });

  it("should return job with re attempt date", () => {
    let status = {
        actionOnStatus: 1
      },
      referenceNumber = 1;
    let result = [
      {
        jobId: 1,
        status: 3,
        id: 1,
        jobStartTime: "2099-12-12 00:00:00"
      }
    ];
    let reAttemptDate = "2099-12-12";
    realm.getRecordListOnQuery = jest.fn();
    realm.getRecordListOnQuery.mockReturnValue(jobTransactions);
    expect(
      formLayoutEventsInterface._setJobDbValues(
        status,
        1,
        jobMaster.id,
        user,
        hub,
        referenceNumber,
        currentTime,
        reAttemptDate,
        { latitude: 0, longitude: 0 }
      )
    ).toEqual({
      tableName: TABLE_JOB,
      value: result
    });
  });

  it("should return job with status 4", () => {
    let status = {
      actionOnStatus: 3
    };
    let result = [
      {
        jobId: 1,
        status: 4,
        id: 1
      }
    ];
    realm.getRecordListOnQuery = jest.fn();
    realm.getRecordListOnQuery.mockReturnValue(jobTransactions);
    expect(formLayoutEventsInterface._setJobDbValues(status, id)).toEqual({
      tableName: TABLE_JOB,
      value: result
    });
  });
  it("should return job with status 1", () => {
    let status = {
      actionOnStatus: 2
    };
    let result = [
      {
        jobId: 1,
        status: 1,
        id: 1
      }
    ];
    realm.getRecordListOnQuery = jest.fn();
    realm.getRecordListOnQuery.mockReturnValue(jobTransactions);
    expect(formLayoutEventsInterface._setJobDbValues(status, id)).toEqual({
      tableName: TABLE_JOB,
      value: result
    });
  });

  it("should return job with status 2", () => {
    let status = {
      actionOnStatus: 0
    };
    let result = [
      {
        jobId: 1,
        status: 2,
        id: 1
      }
    ];
    realm.getRecordListOnQuery = jest.fn();
    realm.getRecordListOnQuery.mockReturnValue(jobTransactions);
    expect(formLayoutEventsInterface._setJobDbValues(status, id)).toEqual({
      tableName: TABLE_JOB,
      value: result
    });
  });
});
describe("test for save Data for particular jobTransaction", () => {
  beforeEach(() => {
    keyValueDBService.getValueFromStore = jest.fn();
    keyValueDBService.validateAndSaveData = jest.fn();
    formLayoutEventsInterface._saveFieldDataForBulk = jest.fn();
    formLayoutEventsInterface._getDbObjects = jest.fn();
    formLayoutEventsInterface._setBulkJobTransactionValues = jest.fn();
    formLayoutEventsInterface._setBulkJobDbValues = jest.fn();
    formLayoutEventsInterface.changeJobTransactionIdInCaseOfNewJob = jest.fn();
    formLayoutEventsInterface._saveFieldData = jest.fn();
    formLayoutEventsInterface._setJobTransactionValues = jest.fn();
    formLayoutEventsInterface._setJobDbValues = jest.fn();
    formLayoutEventsInterface._getRunsheetIdToUpdateJobTransactions = jest.fn();
    formLayoutEventsInterface._updateTransactionLogs = jest.fn();
    formLayoutEventsInterface._updateJobSummary = jest.fn();
    formLayoutEventsInterface._updateUserSummary = jest.fn();
    formLayoutEventsInterface._updateRunsheetSummary = jest.fn();
    realm.performBatchSave = jest.fn();
    addServerSmsService.addServerSms = jest.fn();
  });
  let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
  let userData = {
    value: {
      id: 12,
      hubId: 12,
      name: "abc"
    }
  };
  let userSummaryData = {
    value: {
      gpsKms: 10,
      lastLat: 10,
      lastLng: 10
    }
  };
  let previouslyTravelledDistance = {
    value: 10
  };
  let trackTransactionTimeSpent = {
    value: 10
  };
  let trackBattery = {
    value: 1
  };
  let fieldDataArray = [
    {
      id: 2,
      jobTransactionId: 5,
      key: "d",
      parentId: 0,
      positionId: 0,
      value: "dd",
      fieldAttributeMasterId: 1,
      attributeTypeId: 1,
      dateTime: currentTime
    },
    {
      id: 3,
      value: "3",
      jobTransactionId: 5,
      positionId: 3,
      parentId: 0,
      fieldAttributeMasterId: 1,
      key: 1,
      attributeTypeId: 1,
      dateTime: currentTime
    },
    undefined,
    undefined,
    undefined
  ];
  let fieldData = {
    tableName: TABLE_FIELD_DATA,
    value: fieldDataArray,
    npsFeedbackValue: null,
    reAttemptDate: 4,
    moneyCollectObject: null,
    skuArrayObject: null,
    amountMap: {
      originalAmount: 10,
      actualAmount: 10,
      moneyTransactionType: "cash"
    }
  };
  let dbObjects = {
    jobTransaction: { id: 1, jobId: 1, referenceNumber: 1, jobStatusId: 1 },
    user: { value: {} },
    hub: { value: {} },
    imei: { value: {} },
    status: [{ id: 1, code: 1, statusCategory: 2 }],
    jobMaster: [{ id: 1, code: 1 }]
  };
  let bulkDbObjects = {
    jobTransaction: [{ id: 1, jobId: 1, referenceNumber: 1, jobStatusId: 1 }],
    user: { value: {} },
    hub: { value: {} },
    imei: { value: {} },
    status: [{ id: 1, code: 1, statusCategory: 2 }],
    jobMaster: [{ id: 1, code: 1 }]
  };
  let jobTransactionList = {};
  let jobTransactionArray = [
    { id: 1, jobId: 1, referenceNumber: 1, npsFeedBack: 1 }
  ];
  jobTransactionList[1] = {
    id: jobTransactionArray.id,
    referenceNumber: jobTransactionArray.referenceNumber,
    jobId: jobTransactionArray.jobId,
    syncTime: moment().format("YYYY-MM-DD HH:mm:ss")
  };
  let jobTransactionValues = {
    tableName: "TABLE_JOB_TRANSACTION",
    value: jobTransactionArray,
    jobTransactionDTOMap: jobTransactionList
  };
  let jobDbValues = {
    tableName: TABLE_JOB,
    value: [
      {
        jobId: 1,
        status: 3,
        id: 1
      }
    ]
  };
  let updateEta = {
    value: {
      updateEta: 10
    }
  };
  let transactionLog = {
    tableName: "TABLE_TRANSACTION_LOGS",
    value: [
      {
        userId: 1,
        transactionId: 1,
        jobMasterId: 1,
        toJobStatusId: 1,
        fromJobStatusId: 1,
        latitude: 10,
        longitude: 10,
        transactionTime: 10,
        updatedAt: 10,
        hubId: 1,
        cityId: 1,
        companyId: 1
      }
    ]
  };
  const newRunsheetList = [
    {
      id: 2260,
      userId: 4957,
      hubId: 2759,
      runsheetNumber: "1",
      pendingCount: 0,
      successCount: 2,
      failCount: 0
    },
    {
      id: 2261,
      userId: 4957,
      hubId: 2759,
      runsheetNumber: "2",
      pendingCount: 0,
      successCount: 1,
      failCount: 0
    }
  ];
  let runSheetData = {
    tableName: TABLE_RUNSHEET,
    value: newRunsheetList
  };
  it("should save all data in db for single transaction", () => {
    keyValueDBService.getValueFromStore
      .mockReturnValueOnce(userData)
      .mockReturnValueOnce(userSummaryData)
      .mockReturnValueOnce(previouslyTravelledDistance)
      .mockReturnValueOnce(trackTransactionTimeSpent)
      .mockReturnValueOnce(trackBattery)
      .mockReturnValueOnce(updateEta);
    formLayoutEventsInterface.changeJobTransactionIdInCaseOfNewJob.mockReturnValueOnce(
      1
    );
    formLayoutEventsInterface._saveFieldData.mockReturnValueOnce(fieldData);
    formLayoutEventsInterface._getDbObjects.mockReturnValueOnce(dbObjects);
    formLayoutEventsInterface._setJobTransactionValues.mockReturnValueOnce(
      jobTransactionValues
    );
    formLayoutEventsInterface._setJobDbValues.mockReturnValueOnce(jobDbValues);
    formLayoutEventsInterface._updateTransactionLogs.mockReturnValueOnce(
      transactionLog
    );
    formLayoutEventsInterface._updateRunsheetSummary.mockReturnValueOnce(
      runSheetData
    );
    addServerSmsService.addServerSms.mockReturnValueOnce([]);
    let jobTransactions = [
      {
        id: 1,
        referenceNo: 12,
        hubId: 4,
        cityId: 7,
        companyId: 4
      }
    ];
    let time = moment().valueOf();
    let data = [
      {
        cityId: 7,
        companyId: 4,
        fromJobStatusId: 1,
        hubId: 4,
        jobMasterId: 123,
        latitude: 1,
        longitude: 2,
        toJobStatusId: 2,
        transactionId: 1,
        transactionTime: time,
        updatedAt: time,
        userId: 14
      }
    ];

    // expect(formLayoutEventsInterface.saveData({}, 1,1,1,null)).toEqual(jobTransactionValues.jobTransactionDTOMap)

    return formLayoutEventsInterface.saveData({}, 1, 1, 1, null).then(data => {
      expect(data).toEqual(jobTransactionValues.jobTransactionDTOMap);
      expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(6);
      expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(1);
      expect(realm.saveList).toHaveBeenCalledTimes(1);
      expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(3);
    });
  });

  it("should save data in db for bulk transaction", () => {
    keyValueDBService.getValueFromStore
      .mockReturnValueOnce(userData)
      .mockReturnValueOnce(userSummaryData)
      .mockReturnValueOnce(previouslyTravelledDistance)
      .mockReturnValueOnce(trackTransactionTimeSpent)
      .mockReturnValueOnce(trackBattery)
      .mockReturnValueOnce(updateEta);
    formLayoutEventsInterface._saveFieldDataForBulk.mockReturnValueOnce(
      fieldData
    );
    formLayoutEventsInterface._getDbObjects.mockReturnValueOnce(bulkDbObjects);
    formLayoutEventsInterface._setBulkJobTransactionValues.mockReturnValueOnce(
      jobTransactionValues
    );
    formLayoutEventsInterface._setBulkJobDbValues.mockReturnValueOnce(
      jobDbValues
    );
    formLayoutEventsInterface._updateTransactionLogs.mockReturnValueOnce(
      transactionLog
    );
    formLayoutEventsInterface._updateRunsheetSummary.mockReturnValueOnce(
      runSheetData
    );
    addServerSmsService.addServerSms.mockReturnValueOnce([]);
    let jobTransactions = [
      {
        id: 1,
        referenceNo: 12,
        hubId: 4,
        cityId: 7,
        companyId: 4
      }
    ];
    let time = moment().valueOf();
    let data = [
      {
        cityId: 7,
        companyId: 4,
        fromJobStatusId: 1,
        hubId: 4,
        jobMasterId: 123,
        latitude: 1,
        longitude: 2,
        toJobStatusId: 2,
        transactionId: 1,
        transactionTime: time,
        updatedAt: time,
        userId: 14
      }
    ];

    // expect(formLayoutEventsInterface.saveData({}, 1,1,1,null)).toEqual(jobTransactionValues.jobTransactionDTOMap)

    return formLayoutEventsInterface
      .saveData({}, 1, 1, 1, [{ id: 1 }])
      .then(data => {
        expect(data).toEqual(jobTransactionValues.jobTransactionDTOMap);
        expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(6);
        expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(1);
        expect(realm.saveList).toHaveBeenCalledTimes(1);
        expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(3);
      });
  });
});
