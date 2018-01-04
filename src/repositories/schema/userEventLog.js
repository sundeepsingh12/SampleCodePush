const userEventLog = {
    "id": "/userEventLog",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "userId": { "type": "number", "required": true },
            "companyId": { "type": "number", "required": true },
            "hubId": { "type": "number", "required": true },
            "cityId": { "type": "number", "required": true },
            "eventId": { "type": "number", "required": true },
            "description": {"type":["string",null]},
            "latitude": { "type": ["number",null], "required": true },
            "longitude": { "type": ["number",null], "required": true },
            "dateTime": { "type": "string", "required": true },
        }
    }
};

module.exports = userEventLog;