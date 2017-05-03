/**
 * Created by udbhav on 28/4/17.
 */

const tab = {
    "id":"/tab",
    "type":"array",
    "items": {
        "type":"object",
        "properties": {
            "id": {"type": "number","required":true},
            "name": {"type": "string","required":true},
            "isDefault": {"type": "boolean","required":true}
        }
    }
};

module.exports = tab;