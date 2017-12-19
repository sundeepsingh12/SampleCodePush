import {
  USER_EVENT_LOG,
  USER,
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
    let userEventLogArray = []
    let userEventLogObject = {
      userId: userDetails.value.id,
      companyId: userDetails.value.company.id,
      hubId: userDetails.value.hubId,
      cityId: userDetails.value.cityId,
      eventId: eventID,
      description: description,
      latitude: 0, // to be set later
      longitude: 0, // to be set later
      dateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }
    let olduserEventLogArray = await keyValueDBService.getValueFromStore(USER_EVENT_LOG)
    userEventLogArray = olduserEventLogArray ? olduserEventLogArray.value : []
    userEventLogArray.push(userEventLogObject)
    await keyValueDBService.validateAndSaveData(USER_EVENT_LOG, userEventLogArray)
  }
}

export let userEventLogService = new UserEvent()