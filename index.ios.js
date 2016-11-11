'use strict'

import fareye from './src/fareye'

fareye('ios')
// import React, { Component } from 'react';
// import _ from "underscore";
// import Realm from 'realm';
//
// import {
//   AppRegistry,
//   View,
//   Text,
// } from 'react-native';
//
// export default class Fareye extends Component {
//   render() {
//     let realm = new Realm({
//      schema: [
//       {
//         name: 'People',
//         properties: {
//           name: 'string',
//           age: 'int'
//         }
//       }
//     ]
//    });
//
//    const dataForInsert = [
//       {
//           "name": "Rex",
//           "age": 22,
//           "company": {
//               "code": 12
//           },
//           "height": 180
//       },
//       {
//           "name": "PEXXX",
//           "age": 99
//       }
//     ]
//
//
//    realm.write(() => {
//      realm.create('People', people);
//    });
//
//    const people = realm.objects('People');
//    people.forEach(people => console.log(people.name));
//     return (
//       <View>
//
//         <Text>{"\n"}{"\n"}{"\n"}</Text>
//         <Text>  Count of people in Realm: {people.length}</Text>
//         <Text>  {people[0].name} | {people[0].age} </Text>
//         <Text>  {people[1].name} | {people[1].age} </Text>
//      </View>
//     )
//   }
// }
//
//
// AppRegistry.registerComponent('FareyeReact', () => Fareye)
