'use strict'

import fareye from './src/fareye'

fareye('android')

 /*import React, { Component } from 'react';
 import validate from "json-schema";

 import {
 AppRegistry,
 View,
 Text,
 } from 'react-native';

 export default class Fareye extends Component {
 render() {
 const instance = customerCareList[
     {
         "createdDate": "2016-08-03 11:52:55",
         "lastModifiedDate": "2016-08-03 11:52:55",
         "id": 280,
         "jobMasterId": 930,
         "companyId": 295,
         "mobileNumber": "8009141547",
         "enabled": true,
         "emailId": null,
         "contactType": null,
         "enabledEmail": false,
         "enabledSupportContactNumber": false
     },{
         "createdDate": "2016-06-01 13:25:55",
         "lastModifiedDate": "2016-06-01 13:25:55",
         "id": 250,
         "jobMasterId": 895,
         "companyId": 295,
         "mobileNumber": "1800180266",
         "enabled": true,
         "emailId": null,
         "contactType": null,
         "enabledEmail": false,
         "enabledSupportContactNumber": false
     }
 ];
     const schema = {
         "type" : "object",
         "properties" : {
             "users" : {
                 "type" : "array",
                 "items" : { // "items" represents the items within the "customerCare" array
                     "type" : "object",
                     "properties" : {
                         "name": { "type": "string" },
                         "mobileNumber": { "type" : "boolean" },
                         "jobMasterId": { "type" : "number" },
                     }
                 }
             }
         }
     };
     console.log('validate json 3>>>>>');
     console.log(validate(instance, schema));
 return (
 <View>

 </View>
 )
 }
 }
*/

 AppRegistry.registerComponent('FareyeReact', () => Fareye)