const hub = {
    "id":"/hub",
    "type":"object",
    "properties":{
        "id":{"type":"number","required":true},
        "name":{"type":"string","required":false},
        "code":{"type":"string","required":false}
    }
};

module.exports = hub;
  