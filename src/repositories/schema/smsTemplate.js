/**
 * Created by udbhav on 28/4/17.
 */

const smsTemplate = {
    "id":"/smsTemplate",
    "type": "object",
    "properties": {
        "title":{"type":"string"},
        "body":{"type":"string"},
        "jobMasterId":{"type":"integer"}
    }
};

module.exports = smsTemplate;