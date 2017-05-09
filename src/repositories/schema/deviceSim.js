/**
 * Created by udbhav on 28/4/17.
 */

const deviceSim = {
    "id":"/deviceSim",
    "type":"object",
    "properties":{
        "id":{"type":"number"},
        "hubId":{"type":"number","required":true},
        "cityId":{"type":"number","required":true},
        "companyId":{"type":"number","required":true},
        "userId":{"type":"number","required":true},
        "imeiId":{"type":"number"},
        "lastUsed":{"type":"string"},
        "simNumber":{"type":"number"},
        "contactNumber":{"type":"number"},
        "otpNumber":{"type":"number"},
        "isVerified":{"type":"boolean"},
        "otpExpiryTime":{"type":"string"}
    }
};

module.exports = deviceSim;