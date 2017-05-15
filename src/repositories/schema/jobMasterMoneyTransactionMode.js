/**
 * Created by udbhav on 28/4/17.
 */

const jobMasterMoneyTransactionMode = {
    "id":"/jobMasterMoneyTransactionMode",
    "type":"array",
    "items": {
        "type":"object",
        "properties": {
            "id": {"type": "number","required":true},
            "jobMasterId": {"type": "number","required":true},
            "moneyTransactionModeId": {"type": "integer","required":true}
        }
    }
};

module.exports = jobMasterMoneyTransactionMode;
