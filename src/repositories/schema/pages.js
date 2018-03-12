const pages  = {
    "id":"/pages",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id":{"type":"number","required":true},
            "name": {"type": "string","required":true},
            "groupName": {"type": "string","required":true},
            "icon": {"type": "string","required":true},
            "userType": {"type": "string","required":true},
            "jobMasterIds": {
                "type": "array",
                "items": {"type": "number"}
            },
            "manualSelection": {"type": "boolean","required":true},
            "menuLocation": {"type": "string","required":true},
            "screenTypeId": {"type": "number","required":true},
            "sequenceNumber": {"type": "number","required":true},
            "additionalParams": {"type": "object","required":true}
        }
    }
};

module.exports = pages;