/**
 * Created by udbhav on 28/4/17.
 */

const smsJobStatus = {
    "id":"/smsJobStatus",
    "type":"object",
    "properties":{
        "id":{"type":"long"},
        "compamyId":{"type":"long"},
        "jobMasterId":{"type":"long"},
        "statusId":{"type":"long"},
        "messageBody":{"type":"string"},
        "contactNoJobAttributeId":{"type":"long"}
    }
};

module.exports = smsJobStatus;