/**
 * Created by udbhav on 28/4/17.
 */

const company = {
    "id":"/company",
    "type":"object",
    "properties":{
        "id":{"type":"number","required":true},
        "code":{"type":"string","required":true},
        "timeZone":{"type":"string","required":true},
        "currentJobMasterVersion":{"type":"number"},
        "customErpPullActivated":{"type":"boolean"},
        "allowOffRouteNotification":{"type":"boolean"},
        "autoLogoutFromDevice":{"type":"boolean"}
    }
};

module.exports = company;