/**
 * Created by udbhav on 28/4/17.
 */

const fieldAttribute = {
    "id":"/fieldAttribute",
    "type":"object",
    "properties":{
        "id":{"type":"long"},
        "label":{"type":"string"},
        "subLabel":{"type":"string"},
        "key":{"type":"string"},
        "helpText":{"type":"string"},
        "required":{"type":"boolean"},
        "parentId":{"type":"integer"},
        "jobMasterId":{"type":"long"},
        "attributeTypeId":{"type":"integer"},
        "jobAttributeMasterId":{"type":"long"},
        "fieldAttributeMasterId":{"type":"long"},
        "icon":{"type":"string"},
        "hidden":{"type":"boolean"},
        "dataStoreMasterId":{"type":"long"},
        "dataStoreAttributeId":{"type":"long"},
        "sequenceMasterId":{"type":"integer"},
        "externalDataStoreMasterUrl":{"type":"string"}
    }
};

module.exports = fieldAttribute;