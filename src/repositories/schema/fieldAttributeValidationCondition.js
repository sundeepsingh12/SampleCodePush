/**
 * Created by udbhav on 28/4/17.
 */

const fieldAttributeValidationCondition = {
    "id":"/fieldAttributeValidationCondition",
    "type":"array",
    "items": {
        "type":"object",
        "properties": {
            "id": {"type": "number","required":true},
            "key": {"type": "string"},
            "assignValue": {"type": "string"},
            "type": {"type": "string"},//Don't add required here
            "conditionType": {"type": "string"},
            "fieldAttributeMasterValidationId": {"type": "number","required":true},
            "actionOnAssignFrom": {"type": "string"}//Don't add required here
        }
    }
};

module.exports = fieldAttributeValidationCondition;