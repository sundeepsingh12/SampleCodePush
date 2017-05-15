/**
 * Created by udbhav on 28/4/17.
 */

const customizationAppModule = {
    "id":"/customizationAppModule",
    "type":"array",
    "items": {
        "type":"object",
        "properties": {
            "appModulesId": {"type": "integer","required":true},
            "displayName": {"type": ["string",null],"required":true},
            "remark": {"type": ["string",null],"required":true},
            "selectedUserType": {"type": ["string",null],"required":true}
        }
    }
}

module.exports = customizationAppModule;

