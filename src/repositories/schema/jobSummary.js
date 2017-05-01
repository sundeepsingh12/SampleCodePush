/**
 * Created by udbhav on 28/4/17.
 */

const jobSummary = {
    "id":"/jobSummary",
    "type":"object",
    "properties":{
        "id":{"type":"long"},
        "userId":{"type":"long"},
        "hubId":{"type":"long"},
        "companyId":{"type":"long"},
        "date":{"type":"string"},
        "count":{"type":"integer"},
        "jobMasterId":{"type":"long"},
        "jobStatusId":{"type":"long"}
    }
};

module.exports = jobSummary;