const jobMaster = {
    "id": "/jobMaster",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {"type": "number", "required": true},
            "title": {"type": "string","required":true},
            "identifier": {"type": "string","required": true},
            "identifierColor": {"type": "string", "format": "color","required": true},
            "enabled": {"type": "boolean","required": true},
            "code": {"type": "string","required": true},
            "allowAddNew": {"type": "boolean","required": true},
            "allowAddNewFromBothFieldAndServer": {"type": "boolean","required": true},
            "isCollectionAllowed": {"type": "boolean","required": true},
            "isPaymentAllowed": {"type": "boolean","required": true},
            "companyId": {"type": "number","required": true},
            "isStatusRevert": {"type": "boolean","required": true},
            "enableFormLayout": {"type": "boolean","required": true},
            "assignOrderToHub": {"type": "boolean","required": true},
            "mapReferenceNoWithFieldAttribute": {"type": ["number", null]},
            "enableResequenceRestriction": {"type": "boolean","required": true},
            "enableEtaUpdateFromDevice": {"type": "boolean","required": true},
        }
    }
};

module.exports = jobMaster;
