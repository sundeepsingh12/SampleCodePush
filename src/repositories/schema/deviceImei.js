/**
 * Created by udbhav on 28/4/17.
 */

const deviceImei = {
    "id":"/deviceImei",
    "type":"object",
    "properties":{
        "id":{"type":"number"},
        "hubId":{"type":"number"},
        "cityId":{"type":"number"},
        "companyId":{"type":"number"},
        "userId":{"type":"number"},
        "imeiNumber":{"type":"number"},
        "lastUsed":{"type":"string"},
        "overallDataConsumptionViaNetwork":{"type":"string"},
        "overallDataConsumptionViaWifi":{"type":"string"},
        "dataConsumptionByFarEye":{"type":"string"}
    }
};

module.exports = deviceImei;