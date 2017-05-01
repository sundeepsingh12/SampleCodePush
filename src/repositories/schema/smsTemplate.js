/**
 * Created by udbhav on 28/4/17.
 */

const smsTemplate = {
    "id":"/smsTemplate",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {"type": "number"},
            "title": {"type": "string"},
            "body": {"type": "string"},
            "jobMasterId": {"type": "integer"},
            "companyId": {"type": "number"},
            "enabled": {"type": "number"}
        }
    }
};

module.exports = smsTemplate;