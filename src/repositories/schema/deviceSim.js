/**
 * Created by udbhav on 28/4/17.
 */

const deviceSim = {
    "id":"/deviceSim",
    "type":"object",
    "properties":{
        "id":{"type":"number"},
        "hubId":{"type":"number"},
        "cityId":{"type":"number"},
        "companyId":{"type":"number"},
        "userId":{"type":"number"},
        "imeiId":{"type":"number"},
        "lastUsed":{},
        "simNumber":{"type":"number"},
        "contactNumber":{"type":"number"},
        "otpNumber":{"type":"number"},
        "isVerified":{"type":"boolean"},
        "otpExpiryTime":{}
    }
};

module.exports = deviceSim;