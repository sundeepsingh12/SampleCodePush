/**
 * Created by udbhav on 28/4/17.
 */

const jobSummary = {
    "id":"/jobSummary",
    "type":"array",
    "items": {
        "type": "object",
        "properties": {
            "id": {"type": "number"},
            "userId": {"type": "number"},
            "hubId": {"type": "number"},
            "companyId": {"type": "integer"},
            "date": {"type": "string"},
            "count": {"type": "integer"},
            "jobMasterId": {"type": "number"},
            "jobStatusId": {"type": "number"}
        }
    }
};

module.exports = jobSummary;