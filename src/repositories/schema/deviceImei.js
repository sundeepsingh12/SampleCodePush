/**
 * Created by udbhav on 28/4/17.
 */

const deviceImei = {
    "id":"/deviceImei",
    "type":"object",
    "properties":{
        "id":{"type":"number"},
        "hubId":{"type":"number","required":true},
        "cityId":{"type":"number","required":true},
        "companyId":{"type":"number","required":true},
        "userId":{"type":"number","required":true},
        "imeiNumber":{"type":"number"},
        "lastUsed":{"type":"string"},
        "overallDataConsumptionViaNetwork":{"type":"string"},
        "overallDataConsumptionViaWifi":{"type":"string"},
        "dataConsumptionByFarEye":{"type":"string"}
    }
};

module.exports = deviceImei;