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
            schemaVersion: 4,
            schema: [
                {
                    name: 'People',
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
                "age": 99
            }
        ]


        realm.write(() => {
            realm.deleteAll()
            dataForInsert.forEach(data => realm.create('People', data));
        });
        const NAME_LIST = []
        NAME_LIST.push(dataForInsert[0].age)
         NAME_LIST.push(dataForInsert[1].age)
           console.log(NAME_LIST)  
           
        const people = realm.objects('People');
        const filteredPeople = people.filtered(NAME_LIST.map((id) => 'age = "' + id + '"').join(' OR '));
//          realm.write(() => {
//     realm.delete(filteredPeople)
//   });
filteredPeople.forEach(people=>console.log(people.name))
    const people1 = realm.objects('People');
        // people1.forEach(people => console.log(people.name));
        return (
            <View>

                <Text>{"\n"}{"\n"}{"\n"}</Text>
                <Text>  Count of people in Realm: {people.length}</Text>
                <Text>  {people[0].name} | {people[0].age} </Text>
                <Text>  {people[1].name} | {people[1].age} </Text>
            </View>
        )
    }
}


AppRegistry.registerComponent('FareyeReact', () => Fareye)*/