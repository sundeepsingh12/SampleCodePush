const jobMaster = {
    "id": "/jobMaster",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {"type": "number", "required": true},
            "title": {"type": "string"},
            "identifier": {"type": "string"},
            "identifierColor": {"type": "string", "format": "color"},
            "enabled": {"type": "integer"},
            "code": {"type": "string"},
            "allowAddNew": {"type": "boolean"},
            "allowAddNewFromBothFieldAndServer": {"type": "boolean"},
            "isCollectionAllowed": {"type": "boolean"},
            "isPaymentAllowed": {"type": "boolean"},
            "companyId": {"type": "number"},
            "autogenerateRunsheetNo": {"type": "boolean"},
            "isStatusRevert": {"type": "boolean"},
            "broadcastAutoAssignConfigId": {"type": ["number", null]},
            "isSlotLatLngAllowed": {"type": "boolean"},
            "isAutoGenerateReference": {"type": "boolean"},
            "isSchedulingAllowed": {"type": "boolean"},
            "userTypeOption": {"type": [null, "string"]},
            "efficiencyFormula": {"type": [null, "string"]},
            "enableFormLayout": {"type": "boolean"},
            "assignOrderToHub": {"type": "boolean"},
            "mapReferenceNoWithFieldAttribute": {"type": ["number", null]},
            "enableResequenceRestriction": {"type": "boolean"},
            "enableEtaUpdateFromDevice": {"type": "boolean"},
            "enableManualBroadcast": {"type": "boolean"},
            "isMerchantAllowed": {"type": "boolean"}
        }
    }
};

module.exports = jobMaster;
