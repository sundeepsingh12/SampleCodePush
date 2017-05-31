'use strict'

import fareye from './src/fareye'

fareye('android')
/*import React, {Component} from 'react'
import {
    AppRegistry,
    View,
    Text,
    NativeModules,
} from 'react-native';

export default class Fareye extends Component {
    render() {
       const tdcResponse_sample =  [
        {
            "id": 2333173,
            "userId": 4954,
            "type": "insert",
            "query": "{\"job\":[{\"referenceNo\":\"GAMA-1495691593865\",\"hubId\":2757,\"cityId\":744,\"jobMasterId\":930,\"companyId\":295,\"missionId\":null,\"status\":2,\"latitude\":0.0,\"longitude\":0.0,\"slot\":0,\"merchantCode\":null,\"jobStartTime\":\"2017-05-25 00:00:00\",\"createdAt\":\"2017-05-25 11:23:13\",\"broadcastTime\":null,\"attemptCount\":1,\"jobEndTime\":null,\"lastTransactionStatusId\":4814,\"currentProcessId\":null,\"flowCode\":null,\"userId\":4954,\"sequenceNumber\":null,\"routeNumber\":null,\"id\":2765320}],\"jobTransactions\":[{\"runsheetNo\":\"GAMA/honk_gama/2017-05-25\",\"syncErp\":false,\"jobCreatedAt\":\"2017-05-25 11:23:13\",\"erpSyncTime\":null,\"androidPushTime\":null,\"lastUpdatedAtServer\":\"2017-05-25 17:49:55\",\"lastTransactionTimeOnMobile\":null,\"jobEtaTime\":null,\"seqSelected\":1,\"seqActual\":null,\"seqAssigned\":null,\"companyId\":295,\"jobId\":2765320,\"jobMasterId\":930,\"userId\":4954,\"jobStatusId\":4814,\"actualAmount\":null,\"originalAmount\":null,\"moneyTransactionType\":null,\"referenceNumber\":\"GAMA-1495691593865\",\"runsheetId\":194154,\"hubId\":2757,\"cityId\":744,\"trackKm\":0.0,\"trackHalt\":0.0,\"trackCallCount\":0,\"trackCallDuration\":0,\"trackSmsCount\":0,\"trackTransactionTimeSpent\":0,\"latitude\":0.0,\"longitude\":0.0,\"trackBattery\":0,\"deleteFlag\":0,\"attemptCount\":1,\"startTime\":null,\"endTime\":null,\"merchantCode\":null,\"imeiNumber\":null,\"npsFeedBack\":null,\"id\":2377063,\"lastUpdatedDuration\":null}],\"jobData\":[{\"value\":\"2017-05-17\",\"jobId\":2765320,\"positionId\":16,\"parentId\":0,\"jobAttributeMasterId\":12351,\"id\":34263660},{\"value\":\"22\",\"jobId\":2765320,\"positionId\":15,\"parentId\":0,\"jobAttributeMasterId\":20900,\"id\":34263659},{\"value\":\"09:00:00\",\"jobId\":2765320,\"positionId\":14,\"parentId\":0,\"jobAttributeMasterId\":14230,\"id\":34263658},{\"value\":\"3\",\"jobId\":2765320,\"positionId\":13,\"parentId\":0,\"jobAttributeMasterId\":12707,\"id\":34263657},{\"value\":\"3\",\"jobId\":2765320,\"positionId\":12,\"parentId\":0,\"jobAttributeMasterId\":12462,\"id\":34263656},{\"value\":\"3\",\"jobId\":2765320,\"positionId\":11,\"parentId\":0,\"jobAttributeMasterId\":12349,\"id\":34263655},{\"value\":\"3\",\"jobId\":2765320,\"positionId\":10,\"parentId\":0,\"jobAttributeMasterId\":12279,\"id\":34263654},{\"value\":\"77.783203125\",\"jobId\":2765320,\"positionId\":9,\"parentId\":7,\"jobAttributeMasterId\":20541,\"id\":34263653},{\"value\":\"24.607069137709683\",\"jobId\":2765320,\"positionId\":8,\"parentId\":7,\"jobAttributeMasterId\":20540,\"id\":34263652},{\"value\":\"ObjectSarojFareye\",\"jobId\":2765320,\"positionId\":7,\"parentId\":0,\"jobAttributeMasterId\":20539,\"id\":34263651},{\"value\":\"3\",\"jobId\":2765320,\"positionId\":6,\"parentId\":2,\"jobAttributeMasterId\":15174,\"id\":34263650},{\"value\":\"3\",\"jobId\":2765320,\"positionId\":5,\"parentId\":2,\"jobAttributeMasterId\":6621,\"id\":34263649},{\"value\":\"3\",\"jobId\":2765320,\"positionId\":4,\"parentId\":2,\"jobAttributeMasterId\":6620,\"id\":34263648},{\"value\":\"3\",\"jobId\":2765320,\"positionId\":3,\"parentId\":2,\"jobAttributeMasterId\":10233,\"id\":34263647},{\"value\":\"ObjectSarojFareye\",\"jobId\":2765320,\"positionId\":2,\"parentId\":1,\"jobAttributeMasterId\":6622,\"id\":34263646},{\"value\":\"ArraySarojFareye\",\"jobId\":2765320,\"positionId\":1,\"parentId\":0,\"jobAttributeMasterId\":6623,\"id\":34263645}],\"fieldData\":[],\"runSheet\":[{\"id\":194154,\"runsheetNumber\":\"GAMA/honk_gama/2017-05-25\",\"endDate\":\"2017-05-25 23:59:59\",\"startDate\":\"2017-05-25 00:00:00\",\"userId\":4954,\"hubId\":2757,\"cityId\":744,\"companyId\":295,\"cashCollected\":0.0,\"cashPayment\":0.0,\"isClosed\":false,\"sequenceCount\":1,\"closedDateTime\":null,\"closedByManagerId\":null,\"closedByManagerSign\":null,\"pendingCount\":0,\"successCount\":0,\"failCount\":0,\"cashCollectedByCard\":0.0}]}",
            "dateTime": "2017-05-25 17:49:55",
            "companyId": 295,
            "jobId": null,
            "imeiNumber": null
        }
    ]
    let tdcResponse_item
    for(tdcResponse_item of tdcResponse_sample){
        console.log(tdcResponse_item.id)
    }
    
        return (
            <View>
                  <Text>{"\n"}{"\n"}{"\n"}</Text>
                <Text>  Count of json objects in response: {tdcResponse_sample.length}</Text>
                <Text>  {tdcResponse_sample[0].dateTime} | {tdcResponse_sample[0].companyId} </Text>
              
            </View>
        )
    }
}

AppRegistry.registerComponent('FareyeReact', () => Fareye)*/

