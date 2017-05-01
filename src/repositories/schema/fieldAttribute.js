/**
 * Created by udbhav on 28/4/17.
 */

const fieldAttribute = {
    "id": "/fieldAttribute",
    "type": "array",
    "items":{
        "type":"object",
    "properties": {
        "id": {"type": "number"},
        "label": {"type": "string"},
        "subLabel": {"type": "string"},
        "key": {"type": "string"},
        "helpText": {"type": "string"},
        "required": {"type": "boolean"},
        "parentId": {"type": "integer"},
        "jobMasterId": {"type": "number"},
        "attributeTypeId": {"type": "integer"},
        "jobAttributeMasterId": {"type": "number"},
        "fieldAttributeMasterId": {"type": "number"},
        "icon": {"type": "string"},
        "hidden": {"type": "boolean"},
        "dataStoreMasterId": {"type": "number"},
        "dataStoreAttributeId": {"type": "number"},
        "sequenceMasterId": {"type": "integer"},
        "externalDataStoreMasterUrl": {"type": "string"}
    }
}
};

module.exports = fieldAttribute;