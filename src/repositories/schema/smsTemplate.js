/**
 * Created by udbhav on 28/4/17.
 * This is SMS template for Field in Job Master Settings
 */

const smsTemplate = {
    "id":"/smsTemplate",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {"type": "number","required":true},
            "title": {"type": "string","required":true},
            "body": {"type": "string","required":true},
            "jobMasterId": {"type": "integer","required":true},
        }
    }
};

module.exports = smsTemplate;