/**
 * Created by udbhav on 28/4/17.
 */

const user = {
    "id":"/user",
    "type":"object",
    "properties":{
        "id":{"type":"number"},
        "login":{"type":"string"},
        "firstName":{"type":"string"},
        "lastName":{"type":"string"},
        "email":{"type":"string"},
        "mobileNumber":{"type":"string"},
        "employeeCode":{"type":"string"},
        "cityId":{"type":"number"},
        "hubId":{"type":"number"},
        "company":{"$ref": "/company"}

    }
};

module.exports = user;