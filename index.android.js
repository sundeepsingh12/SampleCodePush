'use strict'


//  import fareye from './src/fareye'

//  fareye('android')
import React, {
  Component
} from 'react';

var mqtt    = require('react-native-mqtt');

import {
  AppRegistry,
  View,
  Text,
} from 'react-native';

export default class Fareye extends Component {
  render() {
mqtt.createClient({
  uri: 'mqtt://mqttstaging.fareye.co:1883', 
  clientId: 'FE_4954'
}).then(client=> {

  client.on('closed', ()=> { console.log('mqtt.event.closed');});
  
  client.on('error',msg=> {
    console.log('mqtt.event.error', msg);
    
  });

  client.on('message', msg=> {
    console.log('mqtt.event.message', msg);
  });

  client.on('connect', ()=>{
    console.log('connected');
    client.subscribe('FE_4954/#',2);
  });

  client.connect();
}).catch(err=>{
  console.log('inside catch')
  console.log(err);
});
        return (
            <View>
                <Text>Hello</Text>

            </View>
        )
    }
  }


  AppRegistry.registerComponent('FareyeReact', () => Fareye)
