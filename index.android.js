'use strict'

import fareye from './src/fareye'

fareye('android')
// import React, {Component} from 'react'
// import {
//     AppRegistry,
//     View,
//     Text,
//     NativeModules,
// } from 'react-native';
//
// export default class Fareye extends Component {
//     render() {
//         NativeModules.IMEI.getIMEI().then(result => {
//             if (result && result.length > 0) {
//                 imeiNumber = result;
//                 console.log('deviceImei >>>> ' + deviceIMEI)
//             }
//         });
//         console.log(imeiNumber)
//         NativeModules.IMEI.getSim().then(result => {
//             if (result && result.length > 0) {
//                 simNumber = result;
//             }
//         });
//         console.log(simNumber)
//         return (
//             <View>
//             </View>
//         )
//     }
// }
//
// AppRegistry.registerComponent('FareyeReact', () => Fareye)

