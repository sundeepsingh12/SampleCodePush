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

        let dataForInsert = []
        for (let i = 0;i<100;i++) {
            let obj = {
                "name" : "Rahul",
                "age" : i ,
            }
            dataForInsert.push(obj)
        }

        let dataForInsert1 = [
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
            },
        ]

        for (let i = 0; i < 5; i++) {
            console.log(i)
        }

        realm.write(() => {
            dataForInsert.forEach(data => realm.create('People', data, true));
        });
        
        console.log('before')
        console.log(new Date())
        const people1 = realm.objects('People');
        console.log('after query')
        console.log(new Date())
        const p = { ...people1 }
        console.log('after object get')
        console.log(new Date())
        const test = JSON.stringify(people1)
        console.log('hello test')
        return (
            <View>
                <Text>Hello</Text>
            </View>
        )
    }
}


AppRegistry.registerComponent('FareyeReact', () => Fareye)*/