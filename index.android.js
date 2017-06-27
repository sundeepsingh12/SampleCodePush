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
            schemaVersion: 20,
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

        const dataForInsert = [
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
    console.log('length')
     console.log(people1.length)
     const property = 'age'
    const peopleAgeList = people1.map(data=>data[property])
       console.log('peopleAgeList')
    console.log(peopleAgeList)
        _.forEach(people1,people => console.log(people.name));
        return (
            <View>

                <Text>{"\n"}{"\n"}{"\n"}</Text>
            </View>
        )
    }
}


AppRegistry.registerComponent('FareyeReact', () => Fareye)*/