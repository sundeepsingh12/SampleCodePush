const pages = {
    "id": "/pages",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": { "type": "number", "required": true },
            "name": { "type": "string", "required": true },
            "groupName": { "type": ["string", null] },
            "icon": { "type": "string", "required": true },
            "userType": { "type": "number", "required": true },
            "jobMasterIds": { "type": ["string", null], "required": true },
            "manualSelection": { "type": "boolean", "required": true },
            "menuLocation": { "type": "string", "required": true },
            "screenTypeId": { "type": "number", "required": true },
            "sequenceNumber": { "type": "number", "required": true },
            "additionalParams": { "type": ["string", null], "required": true }
        }
    }
};

module.exports = pages;