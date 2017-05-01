/**
 * Created by udbhav on 28/4/17.
 */


const fieldAttributeStatus = {
    "id":"/fieldAttributeStatus",
    "type":"object",
    "properties":{
        "id":{"type":"integer"},
        "fieldAttributeId":{"type":"integer"},
        "statusId":{"type":"integer"},
        "sequence":{"type":"integer"}

    }
};

module.exports = fieldAttributeStatus;