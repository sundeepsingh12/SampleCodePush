/**
 * Created by udbhav on 28/4/17.
 */

const jobAttribute = {
    "id":"/jobAttribute",
    "type":"array",
    "items": {
        "type":"object",
        "properties": {
            "id": {"type": "number","required":true},
            "label": {"type": "string","required":true},
            "subLabel": {"type": ["string",null],"required":true},
            "key": {"type": "string","required":true},
            "helpText": {"type": ["string",null],"required":true},
            "required": {"type": "boolean","required":true},
            "sequence": {"type": "integer","required":true},
            "parentId": {"type": ["integer",null],"required":true},
            "jobMasterId": {"type": "number","required":true},
            "attributeTypeId": {"type": "integer","required":true},
            "hidden": {"type": "boolean","required":true},
            "dataStoreMasterId": {"type": ["number",null],"required":true},
            "dataStoreAttributeId": {"type": ["number",null],"required":true}
        }
    }
};

module.exports = jobAttribute;