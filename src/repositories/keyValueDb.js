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
    validateAndSaveData(schemaName, value) {
        let schemaInstance = '',checkCondition = false;

        switch (schemaName) {
            case 'JOB_MASTER':
                schemaInstance = require('../repositories/schema/jobMaster');
                break;
            case 'USER':
                schemaInstance = require('../repositories/schema/user');
                break;
            case 'JOB_ATTRIBUTE':
                schemaInstance = require('../repositories/schema/jobAttribute');
                break;
            case 'JOB_ATTRIBUTE_VALUE':
                schemaInstance = require('../repositories/schema/jobAttributeValue');
                break;
            case 'FIELD_ATTRIBUTE':
                schemaInstance = require('../repositories/schema/fieldAttribute');
                break;
            case 'FIELD_ATTRIBUTE_VALUE':
                schemaInstance = require('../repositories/schema/fieldAttributeValue');
                break;
            case 'JOB_STATUS':
                schemaInstance = require('../repositories/schema/jobStatus');
                break;
            case 'CUSTOMIZATION_APP_MODULE':
                schemaInstance = require('../repositories/schema/customizationAppModule')
                break;
            case 'JOB_LIST_CUSTOMIZATION':
                schemaInstance = require('../repositories/schema/jobListCustomization')
                break;
            case 'TAB':
                schemaInstance = require('../repositories/schema/tab');
                break;
            case 'JOB_MASTER_MONEY_TRANSACTION_MODE':
                schemaInstance = require('../repositories/schema/jobMasterMoneyTransactionMode');
                break;
            case 'CUSTOMER_CARE':
                schemaInstance = require('../repositories/schema/customerCare');
                break;
            case 'SMS_TEMPLATE':
                schemaInstance = require('../repositories/schema/smsTemplate');
                break;
            case 'FIELD_ATTRIBUTE_STATUS':
                schemaInstance = require('../repositories/schema/fieldAttributeStatus');
                break;
            case 'FIELD_ATTRIBUTE_VALIDATION':
                schemaInstance = require('../repositories/schema/fieldAttributeValidation');
                break;
            case 'FIELD_ATTRIBUTE_VALIDATION_CONDITION':
                schemaInstance = require('../repositories/schema/fieldAttributeValidationCondition');
                break;
            case 'SMS_JOB_STATUS':
                schemaInstance = require('../repositories/schema/smsJobStatus');
                break;
            case 'USER_SUMMARY':
                schemaInstance = require('../repositories/schema/userSummary');
                break;
            case 'JOB_SUMMARY':
                schemaInstance = require('../repositories/schema/jobSummary');
                break;
            default:
             checkCondition = true;
        }
        console.log(schemaInstance)
        console.log(value)
        console.log(validate(value, schemaInstance))
        if (value && (checkCondition || validate(value, schemaInstance))) {
            return store.save(schemaName, {
                value
            }).then(() => {
                return true;
            }).catch(error => {
                return error;
            })
        }
    }

    getValueFromStore(schemaName) {
        const value = store.get(schemaName);
        return value;
    }


    deleteValueFromStore(schemaName) {
        const value = store.delete(schemaName);
    }
}
// The singleton variable
export let keyValueDB = new keyValueDb()
