/**
 * Created by udbhav on 28/4/17.
 */

const fieldAttribute = {
    "id": "/fieldAttribute",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {"type": "number","required":true},
            "label": {"type": "string","required":true},
            "subLabel": {"type": ["string",null],"required":true},
            "key": {"type": "string","required":true},
            "helpText": {"type": ["string",null],"required":true},
            "required": {"type": "boolean","required":true},
            "parentId": {"type": ["integer",null],"required":true},
            "jobMasterId": {"type": "number","required":true},
            "attributeTypeId": {"type": "integer","required":true},
            "jobAttributeMasterId": {"type": ["number",null],"required":true},
            "fieldAttributeMasterId": {"type": ["number",null],"required":true},
            "icon": {"type": "string","required":true},
            "hidden": {"type": ["boolean",null],"required":true},
            "dataStoreMasterId": {"type": ["number",null],"required":true},
            "dataStoreAttributeId": {"type": ["number",null],"required":true},
            "sequenceMasterId": {"type": ["integer",null],"required":true},
            "dataStoreFilterMapping":{"type":[null,"string"],"required":true},
            "externalDataStoreMasterUrl": {"type": ["string",null],"required":true}
        }
    }
};

module.exports = fieldAttribute;