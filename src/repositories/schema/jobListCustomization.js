/**
 * Created by udbhav on 28/4/17.
 */

const jobListCustomization = {
    "id":"/jobListCustomization",
    "type":"array",
    "items": {
        "type":"object",
        "properties": {
            "jobMasterId": {"type": "number"},
            "appJobListMasterId": {"type": "number"},
            "seperator": {"type": "string"},
            "referenceNo": {"type": ["string", null]},
            "runsheetNo": {"type": [null, "boolean"]},
            "noOfAttempts": {},
            "slot": {},
            "delimiterType": {},
            "startTime": {"type": [null, "boolean"]},
            "endTime": {"type": [null, "boolean"]},
            "jobAttr": {},
            "fieldAttr": {},
            "trackKm": {"type": [null, "boolean"]},
            "trackHalt": {"type": [null, "boolean"]},
            "trackCallCount": {"type": [null, "boolean"]},
            "trackCallDuration": {"type": [null, "boolean"]},
            "trackSmsCount": {"type": [null, "boolean"]},
            "trackTransactionTimeSpent": {"type": [null, "boolean"]}
        }
    }
};

module.exports = jobListCustomization;
