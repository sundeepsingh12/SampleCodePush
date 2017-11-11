 /**
     * function return object for statistics of user
     * @param {*} statisticsList = user_summary
     * setStatisticsList(statisticsList)
     *
     * 
     * return {{id:''
     *          value : 0
     *          label : ''
     *        }}
     */
class Statistics {
   setStatisticsList(statisticsList) {
        const labels = ['Distance', 'Halt Duration', 'Travel Duration', 'Average Speed', 'Maximum Speed', 'Official SMS', 'Personal SMS', 'Officials Calls', 'Personal Calls', 'Collection']
        let statisticsData = {}, id = 0, object = {} 
        statisticsData[id] = {id, value : (statisticsList.gpsKms != null  ) ? (((statisticsList.gpsKms)/1000).toFixed(2))+" kilometers" : 0,label : labels[id++]}
        statisticsData[id] = {id, value:(statisticsList.haltDuration != null) ? parseInt(statisticsList.haltDuration)/60 + " mins," + (statisticsList.haltDuration) % 60 + " secs" :0,label : labels[id++]}
        statisticsData[id] = {id, value: (statisticsList.travelDuration != null ) ? parseInt(statisticsList.travelDuration)/60 + " mins," + (statisticsList.travelDuration) % 60 + " secs" : 0 ,label : labels[id++]} 
        statisticsData[id] = {id, value: (statisticsList.avgSpeed != null) ?  (statisticsList.avgSpeed)+" km/hr":0, label : labels[id++] }
        statisticsData[id] = {id, value: (statisticsList.maxSpeed != null) ?  (statisticsList.maxSpeed)+" km/hr" : 0, label : labels[id++] }
        statisticsData[id] = {id, value: (statisticsList.officialSmsSentCount != null) ? (statisticsList.officialSmsSentCount)+"  text messages" :0, label : labels[id++] } 
        statisticsData[id] = {id, value: (statisticsList.personalSmsSentCount != null) ? (statisticsList.personalSmsSentCount)+"  text messages": 0, label : labels[id++] }
        statisticsData[id] = {id, value:(statisticsList.officialCallOutgoingDuration != null && statisticsList.cugCallOutgoingDuration != null) ? parseInt(statisticsList.officialCallOutgoingDuration + statisticsList.cugCallOutgoingDuration)/60 + " minutes," +
                              (statisticsList.officialCallOutgoingDuration + statisticsList.cugCallOutgoingDuration) % 60 + " seconds" : 0, label : labels[id++]}
        statisticsData[id] = {id, value: (statisticsList.personalCallOutgoingDuration != null) ? parseInt(statisticsList.personalCallOutgoingDuration)/60 + " minutes," + (statisticsList.personalCallOutgoingDuration) % 60 + " seconds": 0, label : labels[id++]}         
        statisticsData[id] = {id, value: (statisticsList.cashCollected != null) ? parseInt(statisticsList.cashCollected).toFixed(2) + "/- collected" : 0, label : labels[id++]} 
        return statisticsData
    }
}
export let statisticsListService = new Statistics()