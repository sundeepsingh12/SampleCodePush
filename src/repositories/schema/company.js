/**
 * Created by udbhav on 28/4/17.
 */

const company = {
    "id":"/company",
    "type":"object",
    "properties":{
        "id":{"type":"number"},
        "name":{"type":"string"},
        "code":{"type":"string"},
        "timeZone":{"type":"string"},
        "apkVersion":{"type":"string"},
        "apkVersionId":{"type":"number"},
        "currentJobMasterVersion":{"type":"number"},
        "postHookServiceCalledAtRunSheetClosed":{"type":"boolean"},
        "enable":{"type":"boolean"},
        "customLoginActivated":{"type":"boolean"},
        "customErpPullActivated":{"type":"boolean"},
        "allowOffRouteNotification":{"type":"boolean"},
        "autoLogoutFromDevice":{"type":"boolean"}
    }
};

module.exports = company;