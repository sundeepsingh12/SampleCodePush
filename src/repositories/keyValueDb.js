/**
 * # keyValueDb.js
 *
 * A thin wrapper over the react-native-simple-store
 *
 */
'use strict'
/**
 * ## Imports
 *
 * Redux  & the config file
 */
import store from 'react-native-simple-store'
import validate from "json-schema"


export class keyValueDb {
    validateAndSaveData(schemaName,value){
        let schemaInstance = '';
        schemaInstance = require ('../repositories/schema/'+schemaName);
        switch(schemaName){
            case 'jobMaster':
                schemaInstance = require ('../repositories/schema/jobMaster');
                break;
            case 'user':
                schemaInstance = require ('../repositories/schema/user');
                break;
            case 'jobAttribute':
                schemaInstance = require ('../repositories/schema/jobAttribute');
                break;
            case 'jobAttributeValue':
                schemaInstance = require ('../repositories/schema/jobAttributeValue');
                break;
            case 'fieldAttribute':
                schemaInstance = require ('../repositories/schema/fieldAttribute');
                break;
            case 'fieldAttributeValue':
                schemaInstance = require ('../repositories/schema/fieldAttributeValue');
                break;
            case 'jobStatus':
                schemaInstance = require ('../repositories/schema/jobStatus');
                break;
            case 'tab':
                schemaInstance = require ('../repositories/schema/tab');
                break;
            case 'jobMasterMoneyTransactionMode':
                schemaInstance = require ('../repositories/schema/jobMasterMoneyTransactionMode');
                break;
            case 'customerCare':
                schemaInstance = require ('../repositories/schema/customerCare');
                break;
            case 'smsTemplate':
                schemaInstance = require ('../repositories/schema/smsTemplate');
                break;
            case 'fieldAttributeStatus':
                schemaInstance = require ('../repositories/schema/fieldAttributeStatus');
                break;
            case 'fieldAttributeValidation':
                schemaInstance = require ('../repositories/schema/fieldAttributeValidation');
                break;
            case 'fieldAttributeValidationCondition':
                schemaInstance = require ('../repositories/schema/fieldAttributeValidationCondition');
                break;
            case 'smsJobStatus':
                schemaInstance = require ('../repositories/schema/smsJobStatus');
                break;
            case 'userSummary':
                schemaInstance = require ('../repositories/schema/userSummary');
                break;
            case 'jobSummary':
                schemaInstance = require ('../repositories/schema/jobSummary');
                break;
        }
        if(value && validate(schemaInstance,value)){
            return store.save(schemaName, {
                value
            }).then(() => {
                return true;
            }).catch(error => {
                return error;
            })
        }
    }

    getValueFromStore(schemaName){
        const value = store.get(schemaName);
        return value;
    }
}
// The singleton variable
export let keyValueDB = new keyValueDb()
