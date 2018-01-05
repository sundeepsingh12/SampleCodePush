'use strict'

if (__DEV__) {
    require ('./ReactotronConfig')
}
import fareye from './src/fareye'

fareye('ios')

/*//Realm DB Playgroud....

import React, { PureComponent } from 'react';
import validate from "json-schema";
import _ from "underscore";
import Realm from 'realm';

import {
    AppRegistry,
    View,
    Text,
} from 'react-native';

export default class Fareye extends PureComponent {
    render() {
        var instance = 4;
        var instance2 = "asdasd";
        var schema = { "type": "number" };
        console.log(validate(instance, schema).valid);
        console.log(validate(instance2, schema).valid);
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
                "company": {
                    "code": 12
                },
                "height": 180
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

        const people = realm.objects('People');
        people.forEach(people => console.log(people.name));
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
