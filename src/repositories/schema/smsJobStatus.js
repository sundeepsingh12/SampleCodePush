/**
 * Created by udbhav on 28/4/17.
 * This is SMS template for Server in Job Master Settings
 */

const smsJobStatus = {
    "id":"/smsJobStatus",
    "type":"array",
    "items": {
        "type":"object",
        "properties": {
            "id": {"type": "number","required":true},
            "companyId": {"type": "number","required":true},
            "jobMasterId": {"type": "number","required":true},
            "statusId": {"type": "number","required":true},
            "messageBody": {"type": "string","required":true},
            "contactNoJobAttributeId": {"type": "number","required":true}
        }
    }
};

module.exports = smsJobStatus;