/**
 * Created by udbhav on 28/4/17.
 */

const smsJobStatus = {
    "id":"/smsJobStatus",
    "type":"array",
    "items": {
        "type":"object",
        "properties": {
            "id": {"type": "number"},
            "companyId": {"type": "number"},
            "jobMasterId": {"type": "number"},
            "statusId": {"type": "number"},
            "messageBody": {"type": "string"},
            "contactNoJobAttributeId": {"type": "number"}
        }
    }
};

module.exports = smsJobStatus;