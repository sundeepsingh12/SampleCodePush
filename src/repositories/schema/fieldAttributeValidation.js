/**
 * Created by udbhav on 28/4/17.
 */

const fieldAttributeValidation = {
    "id":"/fieldAttributeValidation",
    "type":"array",
    "items": {
        "type":"object",
        "properties": {
            "id": {"type": "number","required":true},
            "timeOfExecution": {"type": "string","required":true},
            "leftKey": {"type": "string","required":true},
            "condition": {"type": "string","required":true},
            "rightKey": {"type": "string","required":true},
            "fieldAttributeMasterId": {"type": "number","required":true},
            "companyId": {"type": "number","required":true},
            "jobMasterId": {"type": "number","required":true}
        }
    }
};

module.exports = fieldAttributeValidation;
