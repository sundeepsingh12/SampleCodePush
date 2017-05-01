/**
 * Created by udbhav on 28/4/17.
 */

const customerCare ={
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {
                "type": "number",
                "required":true
            },
            "jobMasterId": {
                "type": ["number"],
                "required":true
            },
            "companyId": {
                "type": "number",
                "required":true
            },
            "name":{
                "type":["string"]
            },
            "createdDate":{
                "type":["string"]
            },
            "lastModifiedDate":{
                "type":["string"]
            },
            "mobileNumber":{
                "type":["string"]
            },
            "emailId":{
                "type":[null,"string"]
            },
            "contactType": {
                "type": [null,"string"]
            },
            "enabledEmail":{
                "type":[null,"boolean"]
            },
            "enabledSupportContactNumber":{
                "type":[null,"boolean"]
            }
        }
    }
};

module.exports = customerCare;