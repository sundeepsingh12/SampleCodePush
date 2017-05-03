/**
 * Created by udbhav on 28/4/17.
 */

const jobListCustomization = {
    "id":"/jobListCustomization",
    "type":"array",
    "items": {
        "type":"object",
        "properties": {
            "jobMasterId": {"type": "number","required":true},
            "appJobListMasterId": {"type": "number","required":true},
            "separator": {"type": ["string",null],"required":true},
            "referenceNo": {"type": ["boolean", null],"required":true},
            "runsheetNo": {"type": [null, "boolean"],"required":true},
            "noOfAttempts": {"type": [null, "boolean"],"required":true},
            "slot": {"type": [null, "boolean"],"required":true},
            "delimiterType": {"type": [null, "string"],"required":true},
            "startTime": {"type": [null, "boolean"],"required":true},
            "endTime": {"type": [null, "boolean"],"required":true},
            "jobAttr": {"type": [null, "string"],"required":true},
            "fieldAttr": {"type": [null, "string"],"required":true},
            "trackKm": {"type": [null, "boolean"],"required":true},
            "trackHalt": {"type": [null, "boolean"],"required":true},
            "trackCallCount": {"type": [null, "boolean"],"required":true},
            "trackCallDuration": {"type": [null, "boolean"],"required":true},
            "trackSmsCount": {"type": [null, "boolean"],"required":true},
            "trackTransactionTimeSpent": {"type": [null, "boolean"],"required":true}
        }
    }
};

module.exports = jobListCustomization;
