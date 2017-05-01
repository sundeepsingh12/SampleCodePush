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
        "lastUsed":{},
        "overallDataConsumptionViaNetwork":{"type":"string"},
        "overallDataConsumptionViaWifi":{},
        "dataConsumptionByFarEye":{}
    }
};

module.exports = deviceImei;