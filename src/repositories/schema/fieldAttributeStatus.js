/**
 * Created by udbhav on 28/4/17.
 */


const fieldAttributeStatus = {
    "id":"/fieldAttributeStatus",
    "type":"array",
    "items": {
        "type":"object",
        "properties": {
            "id": {"type": "integer","required":true},
            "fieldAttributeId": {"type": "integer","required":true},
            "statusId": {"type": "integer","required":true},
            "sequence": {"type": "integer","required":true}
        }
    }
};

module.exports = fieldAttributeStatus;