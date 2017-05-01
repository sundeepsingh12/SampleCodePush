/**
 * Created by udbhav on 28/4/17.
 */
const jobStatus  = {
    "id":"/jobStatus",
    "type": "object",
    "properties":{
        "name":{"type":"string"},
        "code":{"type":"string"},
        "transientState":{"type":"boolean"},
        "job_master_id":{"type":"long"},
        "tabId":{"type":"long"},
        "statusCategory":{"type":"integer"},
        "buttonColor":{"type":"string"},
        "actionOnStatus":{"type":"integer"},
        "sequence":{"type":"integer"},
        "saveActivated":{"type":"boolean"}
    }
};

module.exports = jobStatus;