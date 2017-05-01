/**
 * Created by udbhav on 28/4/17.
 */

const tab = {
    "id":"/tab",
    "type":"array",
    "items": {
        "type":"object",
        "properties": {
            "id": {"type": "long"},
            "name": {"type": "string"},
            "isDefault": {"type": "string"}
        }
    }
};

module.exports = tab;