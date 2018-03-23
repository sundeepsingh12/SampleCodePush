const userExceptionLogs = {
    "id": "/userExceptionLogs",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": { "type": "number", "required": true },
            "userId": { "type": "number", "required": true },
            "dateTime": { "type": "string", "required": true },
            "stacktrace": { "type": "string", "required": true },
            "packageVersion": { "type": "string", "required": true },
            "packageName": { "type": "string", "required": true },
            "hubId": { "type": "number", "required": true },
            "cityId": { "type": "number", "required": true },
            "companyId": { "type": "number", "required": true },
        }
    }
};

module.exports = userExceptionLogs;