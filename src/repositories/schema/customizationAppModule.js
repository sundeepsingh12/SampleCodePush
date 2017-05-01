/**
 * Created by udbhav on 28/4/17.
 */

const customizationAppModule = {
    "id":"/customizationAppModule",
    "type":"array",
    "items": {
        "type":"object",
        "properties": {
            "appModulesId": {"type": "integer"},
            "displayName": {"type": "string"},
            "remark": {"type": "string"},
            "selectedUserType": {"type": "string"}
        }
    }
}

module.exports = customizationAppModule;

