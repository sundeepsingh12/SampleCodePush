'use strict'

if (__DEV__) {
    require ('./ReactotronConfig')
}
import fareye from './src/fareye'

fareye('android')
// import React, {
//   PureComponent
// } from 'react';

// var mqtt    = require('react-native-mqtt');

// import {
//   AppRegistry,
//   View,
//   Text,
// } from 'react-native';

// export default class Fareye extends PureComponent {
//   render() {

//         return (
//             <View>
//                 <Text>Hello</Text>

//             </View>
//         )
//     }
//   }


//   AppRegistry.registerComponent('Fareye', () => Fareye)