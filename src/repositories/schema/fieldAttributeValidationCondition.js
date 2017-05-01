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
            "type": {"type": "string"},
            "conditionType": {"type": "string"},
            "fieldAttributeMasterValidationId": {"type": "number"},
            "actionOnAssignFrom": {"type": "string"}
        }
    }
};

module.exports = fieldAttributeValidationCondition;