const deviceSimVerification = {
    "id": "/deviceSimVerification",
    "type": "object",
    "properties": {
        "longCodeNumber": { "type": "string", "required": true },
        "longCodePreAppendText": { "type": "string", "required": true },
        "simVerificationType": { "type": "string", "required": true },
    }
};

module.exports = deviceSimVerification;