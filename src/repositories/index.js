'use strict'
//Class to combine all Schema and create realm object

import Realm from 'realm';
import UserSummary from './schema/userSummary'
// import JobMaster from './jobMaster'

const schemaVersion = 4;
const schema = [ UserSummary ];
let realm = new Realm({ schemaVersion, schema });

export function save(tableName, object) {
  return realm.write(() => {
    //removing existing entry from Table
    realm.delete(realm.objects(tableName));
    //writing new record
    realm.create(tableName, object);
  });
}

export function saveList(tableName, array) {
  return realm.write(() => {
    //writing new record
    array.forEach(data => realm.create(tableName, data));
  });
}


export function getAll(tableName) {
  return realm.objects(tableName);
}
