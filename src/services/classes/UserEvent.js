import {
  USER_EVENT_LOG,
  USER,
  USER_SUMMARY,
} from '../../lib/constants'

import {
  keyValueDBService
} from './KeyValueDBService'

import moment from 'moment'
import _ from 'lodash'

class UserEvent {

  /**
   * 
   * @param {*} eventID --id of event for ex- login logout etc.
   * @param {*} desciption -- description of the event at that time.
   * @returns {*} 
   */

  async addUserEventLog(eventID, description) {
    const userDetails = await keyValueDBService.getValueFromStore(USER)
    let userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY)
    let userEventLogArray = []
    let userEventLogObject = {
      userId: userDetails.value.id,
      companyId: userDetails.value.company.id,
      hubId: userDetails.value.hubId,
      cityId: userDetails.value.cityId,
      eventId: eventID,
      description: description,
      latitude: (userSummary.value.lastLat) ? userSummary.value.lastLat : 0,
      longitude: (userSummary.value.lastLng) ? userSummary.value.lastLng : 0,
      dateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }
    let olduserEventLogArray = await keyValueDBService.getValueFromStore(USER_EVENT_LOG)
    userEventLogArray = olduserEventLogArray ? olduserEventLogArray.value : []
    userEventLogArray.push(userEventLogObject)
    await keyValueDBService.validateAndSaveData(USER_EVENT_LOG, userEventLogArray)
  }

  /**
   * @param {*} lastSyncTime --Latest time when the sync is done.
   */
  async getUserEventLog(lastSyncTime) {
    const userEventsLogs = await keyValueDBService.getValueFromStore(USER_EVENT_LOG);
    const userEventLogValue = userEventsLogs ? userEventsLogs.value : []
    let userEventLogsToBeSynced = []

    userEventLogValue.forEach(eventLog => {
      if (moment(eventLog.dateTime).isAfter(lastSyncTime.value)) {
        userEventLogsToBeSynced.push(eventLog)
      }
    })
    return userEventLogsToBeSynced
  }

  /**
   * This function return events log to be synced
   * @param {*} userEventsLogsList 
   * @param {*} lastSyncTime 
   * @returns
   * [userEventLogs]
   */
  getUserEventLogsList(userEventsLogsList, lastSyncTime) {
    let userEventLogsToBeSynced = [];
    for (let userEventsLog in userEventsLogsList) {
      // If event log captured time is after last sync time with server then has to be sent to server
      if (moment(userEventsLogsList[userEventsLog].dateTime).isAfter(lastSyncTime)) {
        userEventLogsToBeSynced.push(userEventsLogsList[userEventsLog]);
      }
    }
    return userEventLogsToBeSynced;
  }
}

export let userEventLogService = new UserEvent()