import {
  keyValueDB
} from '../../repositories/keyValueDb'
import CONFIG from '../../lib/config'


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

  validateAndUpdateData(schemaName,data) {
    const storeValue = keyValueDB.updateValueInStore(schemaName, data);
    return storeValue
  }

}

export let keyValueDBService = new KeyValueDB()
