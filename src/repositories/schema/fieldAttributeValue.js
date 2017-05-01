/**
 * Created by udbhav on 28/4/17.
 */

const fieldAttributeValue = {
    "id":"/fieldAttributeValue",
    "type":"array",
    "items": {
        "type":"object",
        "properties": {
            "id": {"type": "number","required":true},
            "name": {"type": "string","required":true},
            "code": {"type": "string","required":true},
            "fieldAttributeMasterId": {"type": "number","required":true}
        }
    }
};

module.exports = fieldAttributeValue;