'use strict'


 import fareye from './src/fareye'

 fareye('android')
/*import React, {
  Component
} from 'react';
import _ from "underscore";
import Realm from 'realm';

import {
  AppRegistry,
  View,
  Text,
} from 'react-native';

export default class Fareye extends Component {
  render() {
    let realm = new Realm({
            schemaVersion: 39,
            schema: [
                {
                    name: 'People',
                    properties: {
                         albumId: { type: 'int' },
    id: { type: 'int' },
    title: { type: 'string' },
    url: { type: 'string' },
    thumbnailUrl: { type: 'string' }
 
                    }
                }
            ]
        });

   
        let dataForInsert = [
  {
    "albumId": 1,
    "id": 1,
    "title": "accusamus beatae ad facilis cum similique qui sunt",
    "url": "http://placehold.it/600/92c952",
    "thumbnailUrl": "http://placehold.it/150/92c952"
  },
  {
    "albumId": 1,
    "id": 2,
    "title": "reprehenderit est deserunt velit ipsam",
    "url": "http://placehold.it/600/771796",
    "thumbnailUrl": "http://placehold.it/150/771796"
  },
]

  console.log('before insert')
  console.log(new Date())
        realm.write(() => {
            dataForInsert.forEach(data => realm.create('undefined', data, true));
        });
        console.log('after insert')
       console.log(new Date())
        return (
            <View>
                <Text>Hello</Text>

            </View>
        )
    }
  }


  AppRegistry.registerComponent('FareyeReact', () => Fareye)*/
