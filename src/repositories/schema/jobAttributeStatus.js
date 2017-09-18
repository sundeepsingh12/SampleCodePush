const jobAttributeStatus = {
    "id": "/jobAttributeStatus",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": { "type": "integer", "required": true },
            "jobAttributeId": { "type": "integer", "required": true },
            "statusId": { "type": "integer", "required": true },
            "sequence": { "type": "integer", "required": true }
        }
    }
}

module.exports = jobAttributeStatus;