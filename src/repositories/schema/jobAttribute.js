/**
 * Created by udbhav on 28/4/17.
 */

const jobAttribute = {
    "id":"/jobAttribute",
    "type":"array",
    "items": {
        "type":"object",
        "properties": {
            "id": {"type": "number"},
            "label": {"type": "string"},
            "subLabel": {"type": "string"},
            "key": {"type": "string"},
            "helpText": {"type": "string"},
            "required": {"type": "boolean"},
            "sequence": {"type": "integer"},
            "parentId": {"type": "integer"},
            "jobMasterId": {"type": "long"},
            "attributeTypeId": {"type": "integer"},
            "hidden": {"type": "boolean"},
            "dataStoreMasterId": {"type": "number"},
            "dataStoreAttributeId": {"type": "number"}
        }
    }
};

module.exports = jobAttribute;