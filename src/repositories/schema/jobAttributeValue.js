/**
 * Created by udbhav on 28/4/17.
 */

const jobAttributeValue = {
    "id":"/jobAttributeValue",
    "type":"array",
    "items": {
        "type":"object",
        "properties": {
            "id": {"type": "number","required":true},
            "name": {"type": "string","required":true},
            "code": {"type": "string","required":true},
            "jobAttributeMasterId": {"type": "number","required":true}
        }
    }
};

module.exports = jobAttributeValue;