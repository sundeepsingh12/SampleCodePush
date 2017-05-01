/**
 * Created by udbhav on 28/4/17.
 */

const fieldAttributeValidation = {
    "id":"/fieldAttributeValidation",
    "type":"object",
    "properties":{
        "id":{"type":"long"},
        "timeOfExecution":{"type":"string"},
        "leftKey":{"type":"string"},
        "condition":{"type":"string"},
        "rightKey":{"type":"string"},
        "fieldAttributeMasterId":{"type":"long"},
        "companyId":{"type":"long"},
        "jobMasterId":{"type":"long"}
    }
};

module.exports = fieldAttributeValidation;
