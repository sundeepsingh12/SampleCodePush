import {
  keyValueDB
} from '../../repositories/keyValueDb'
import validate from "json-schema"

class KeyValueDB {

  /**
   * generic function for validating and saving a value in store
   * @param {*} schemaName 
   * @param {*} data 
   */
  validateAndSaveData(schemaName, data) {
    const storeValue = keyValueDB.validateAndSaveData(schemaName, data);
    return storeValue
  }

  /**
   * generic function for fetching value from store
   * @param {*} schemaName 
   */
  getValueFromStore(schemaName) {
    const storeValue = keyValueDB.getValueFromStore(schemaName);
    return storeValue;
  }

  getAllKeysFromStore(){
    const keys = keyValueDB.getAllKeysFromStore()
    return keys;
  }

  deleteValueFromStore(schemaName) {
    const storeValue = keyValueDB.deleteValueFromStore(schemaName);
  }

  validateAndUpdateData(schemaName, data) {
    const storeValue = keyValueDB.updateValueInStore(schemaName, data);
    return storeValue
  }
  
// used for check of null json and save data in store
 async checkForNullValidateAndSaveInStore(json,schemaName){
    if(!_.isEmpty(json)) {
      await keyValueDBService.validateAndSaveData(schemaName, json)
    }
 }

  validateData(schemaName, data) {
    let schemaInstance = ''
    switch (schemaName) {
      case 'TAB':
        schemaInstance = require('../../repositories/schema/tab');
        break;
      case 'JOB_LIST_CUSTOMIZATION':
        schemaInstance = require('../../repositories/schema/jobListCustomization')
        break;
    }

    if(data && !validate(data,schemaInstance)) {
      throw new Error(schemaName + ' validation failed')
    }

    return true
  }

}

export let keyValueDBService = new KeyValueDB()
