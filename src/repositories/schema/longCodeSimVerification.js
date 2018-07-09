const deviceSimVerification = {
    "id": "/deviceSimVerification",
    "type": "object",
    "properties": {
        "longCodeNumber": { "type": "string" },
        "longCodePreAppendText": { "type": "string" },
        "simVerificationType": { "type": "string", "required": true },
    }
};

module.exports = deviceSimVerification;