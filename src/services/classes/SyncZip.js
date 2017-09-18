import CONFIG from '../../lib/config'
import RNFS from 'react-native-fs';
import { zip } from 'react-native-zip-archive'
import { keyValueDBService } from './KeyValueDBService'
import * as realm from '../../repositories/realmdb';

const {
    TABLE_TRACK_LOGS,
    USER_SUMMARY
} = require('../../lib/constants').default


var PATH = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER;
//Location where zip contents are temporarily added and then removed
var PATH_TEMP = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/TEMP';

export async function createZip() {
    //Create FarEye folder if doesn't exist
    RNFS.mkdir(PATH);
    RNFS.mkdir(PATH_TEMP);

    //Prepare the SYNC_RESULTS
    var SYNC_RESULTS = {};
    SYNC_RESULTS.fieldData = [];
    SYNC_RESULTS.job = [];
    SYNC_RESULTS.jobSummary = [];
    SYNC_RESULTS.jobTransaction = [];
    SYNC_RESULTS.runSheetSummary = [];
    SYNC_RESULTS.scannedReferenceNumberLog = [];
    SYNC_RESULTS.serverSmsLog = [];
    SYNC_RESULTS.trackLog = [];
    SYNC_RESULTS.transactionLog = [];
    SYNC_RESULTS.userCommunicationLog = [];
    SYNC_RESULTS.userEventsLog = [];
    SYNC_RESULTS.userExceptionLog = [];
    const userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY)
    const userSummaryValue = userSummary.value
    SYNC_RESULTS.userSummary = userSummaryValue || {}
    console.log(JSON.stringify(SYNC_RESULTS));

    //Writing Object to File at TEMP location
    await RNFS.writeFile(PATH_TEMP + '/logs.json', JSON.stringify(SYNC_RESULTS), 'utf8');

    //Creating ZIP file
    const targetPath = PATH + '/sync.zip'
    const sourcePath = PATH_TEMP
    await zip(sourcePath, targetPath);
    console.log('zip completed at ' + targetPath);

    //Size of ZIP file created
    // var stat = await RNFS.stat(PATH + '/sync.zip');
    // console.log(stat);

    //Deleting TEMP folder location
    await RNFS.unlink(PATH_TEMP);
    // console.log(PATH_TEMP+' removed');

}
