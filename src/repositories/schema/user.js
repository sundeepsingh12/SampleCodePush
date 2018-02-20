/**
 * Created by udbhav on 28/4/17.
 */

const user = {
    "id": "/user",
    "type": "object",
    "properties": {
        "id": { "type": "number", "required": true },
        "login": { "type": "string", "required": true },
        "firstName": { "type": "string", "required": true },
        "lastName": { "type": "string", "required": true },
        "email": { "type": ["string", null] },
        "mobileNumber": { "type": ["string", null] },
        "employeeCode": { "type": "string", "required": true },
        "cityId": { "type": "number", "required": true },
        "hubId": { "type": "number", "required": true },
        "currentJobMasterVersion": { "type": "number" },
        "company": { "$ref": "/company", "required": true },
        "last_login": { "type": "string", },
        "lastERPSyncWithServer": { "type": ["string", null] }
    }
};

module.exports = user;