/**
 * Created by udbhav on 28/4/17.
 */

const mdmPolicies = {
    "id":"/mdmPolicies",
    "type":"object",
    "properties":{
        "id":{"type":"number"},
        "basicSetting":{"type":"boolean"},
        "startFareyeAtBoot":{"type":"boolean"},
        "alwaysKeepFareyeVisible":{"type":"boolean"},
        "companyMdmWhiteListDTOs":{"type":"array"},
        "mandatoryGps":{"type":"boolean"},
        "disableSettingChange":{"type":"boolean"},
        "alwaysKeepFareyeRunning":{"type":"boolean"},
        "disableNotificationForOtherApp":{"type":"boolean"},
        "disableOutgoingCall":{"type":"boolean"},
        "allowOutgoingOfficialCall":{"type":"boolean"},
        "disableOutgoingSms":{"type":"boolean"},
        "limitOutgoingCall":{"type":"number"},
        "limitOutgoingSms":{"type":"number"},
        "disableAndroidBrowser":{"type":"boolean"},
        "disablePlayStore":{"type":"boolean"},
        "disableYouTube":{"type":"boolean"},
        "advanceSetting":{"type":"boolean"},
        "gpsTracking":{"type":"boolean"},
        "frequencyOfGps":{"type":"string"},
        "syncCommunicationLogs":{"type":"boolean"},
        "syncSmsBody":{"type":"boolean"},
        "accuracyOfGps":{"type":"string"},
        "syncSmsBodyOfficial":{"type":"boolean"},
        "disableIncomingCall":{"type":"boolean"},
        "enableCallerIdentity":{"type":"boolean"},
        "callerIdentityDisplayList":{"type":"string"},
        "preAdvanceSetting":{"type":"boolean"}
    }
};

module.exports = mdmPolicies;
