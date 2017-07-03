'use strict'
 
 import fareye from './src/fareye'
 
 fareye('android')
/*import React, { Component } from 'react';
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
            schemaVersion: 23,
            schema: [
                {
                    name: 'People',
                    primaryKey: 'age',
                    properties: {
                        name: 'string',
                        age: 'int'
                    }
                }
            ]
        });

        let dataForInsert = [
            {
                "name": "Rex",
                "age": 22,
            },
            {
                "name": "PEXXX",
                "age": 99
            },
            {
                "name": "Gaurav",
                "age": 97
        }
        ]
      
        realm.write(() => {
            dataForInsert.forEach(data => realm.create('People', data,true));
        });
    
    
const people1 = realm.objects('People');
const test = JSON.stringify(people1)
console.log(test)
      
        return (
            <View>

                <Text>{"\n"}{"\n"}{"\n"}</Text>
            
            </View>
        )
    }
}


AppRegistry.registerComponent('FareyeReact', () => Fareye)*/