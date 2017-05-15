/**
 * Created by udbhav on 28/4/17.
 */

const customerCare ={
    "id":"/customerCare",
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
            "name":{
                "type":["string"],
                "required":true
            },
            "mobileNumber":{
                "type":["string"],
                "required":true
            }
        }
    }
};

module.exports = customerCare;