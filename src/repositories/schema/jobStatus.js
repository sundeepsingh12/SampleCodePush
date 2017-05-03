/**
 * Created by udbhav on 28/4/17.
 */
const jobStatus  = {
    "id":"/jobStatus",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id":{"type":"number","required":true},
            "name": {"type": "string","required":true},
            "code": {"type": "string","required":true},
            "transient": {"type": "boolean","required":true},
            "jobMasterId": {"type": "number","required":true},
            "tabId": {"type": "number","required":true},
            "statusCategory": {"type": "number","required":true},
            "buttonColor": {"type": "string","required":true,"format":"color"},
            "actionOnStatus": {"type": "number","required":true},
            "sequence": {"type": ["number",null],"required":true},
            "saveActivated": {"type": ["boolean",null],"required":true}
        }
    }
};

module.exports = jobStatus;