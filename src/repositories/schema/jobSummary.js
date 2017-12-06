/**
 * Created by udbhav on 28/4/17.
 */

const jobSummary = {
    "id":"/jobSummary",
    "type":"array",
    "items": {
        "type": "object",
        "properties": {
            "id": {"type": "number","required":true},
            "userId": {"type": "number","required":true},
            "hubId": {"type": "number","required":true},
            "companyId": {"type": "integer","required":true},
            "cityId":{"type":"integer","required":true},
            "date": {"type": "string","required":true,"format":"date-time"},
            "count": {"type": "integer","required":true},
            "jobMasterId": {"type": "number","required":true},
            "jobStatusId": {"type": "number","required":true},
            "updatedTime": {"type":"string","required":false}
        }
    }
};

module.exports = jobSummary;