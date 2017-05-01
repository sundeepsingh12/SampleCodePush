/**
 * Created by udbhav on 28/4/17.
 */

const jobAttribute = {
    "id":"/jobAttribute",
    "type":"object",
    "properties":{
        "id":{"type":"long"},
        "label":{"type":"string"},
        "subLabel":{"type":"string"},
        "key":{"type":"string"},
        "helpText":{"type":"string"},
        "required":{"type":"boolean"},
        "sequence":{"type":"integer"},
        "parentId":{"type":"integer"},
        "jobMasterId":{"type":"long"},
        "attributeTypeId":{"type":"integer"},
        "hidden":{"type":"boolean"},
        "dataStoreMasterId":{"type":"long"},
        "dataStoreAttributeId":{"type":"long"}
    }
};

module.exports = jobAttribute;