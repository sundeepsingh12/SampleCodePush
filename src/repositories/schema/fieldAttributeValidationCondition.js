/**
 * Created by udbhav on 28/4/17.
 */

const fieldAttributeValidationCondition = {
    "id":"/fieldAttributeValidationCondition",
    "type":"object",
    "properties":{
        "id":{"type":"long"},
        "key":{"type":"string"},
        "assignValue":{"type":"string"},
        "type":{"type":"string"},
        "conditionType":{"type":"string"},
        "fieldAttributeMasterValidationId":{"type":"long"},
        "actionOnAssignFrom":{"type":"string"}
    }
};

module.exports = fieldAttributeValidationCondition;