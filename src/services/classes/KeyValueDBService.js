import {
  keyValueDB
} from '../../repositories/keyValueDb'
import CONFIG from '../../lib/config'
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

  deleteValueFromStore(schemaName) {
    const storeValue = keyValueDB.deleteValueFromStore(schemaName);
  }

  validateAndUpdateData(schemaName, data) {
    const storeValue = keyValueDB.updateValueInStore(schemaName, data);
    return storeValue
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
