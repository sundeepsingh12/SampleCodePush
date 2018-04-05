const pagesAdditionalUtilities = {
    "id": "/pagesAdditionalUtilities",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": { "type": "number", "required": true },
            "name": { "type": "string", "required": true },
            "utilityID": { "type": "number", "required": true },
            "enabled": { "type": "boolean", "required": true },
            "additionalParams": { "type": ["string", null], "required": true }
        }
    }
};

module.exports = pagesAdditionalUtilities;