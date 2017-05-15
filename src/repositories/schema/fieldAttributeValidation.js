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
            "leftKey": {"type": "string"},//Don't add required here
            "condition": {"type": "string"},//Don't add required here
            "rightKey": {"type": "string"},//Don't add required here
            "fieldAttributeMasterId": {"type": "number","required":true},
            "companyId": {"type": "number","required":true},
            "jobMasterId": {"type": "number","required":true}
        }
    }
};

module.exports = fieldAttributeValidation;
