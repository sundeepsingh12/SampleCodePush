'use strict'

import * as realm from '../../repositories/realmdb'
import { keyValueDBService } from './KeyValueDBService'
import BackgroundGeolocation from "react-native-background-geolocation"
import moment from 'moment'
import PushNotification from 'react-native-push-notification'
import {
    TABLE_TRACK_LOGS,
    TRACK_BATTERY,
    USER,
    GEO_FENCING,
    LAT_LONG_GEO_FENCE,
    GEO_FENCE_STATUS
} from '../../lib/constants'
import { userSummaryService } from './UserSummary'
import {
    FAREYE_UPDATES
} from '../../lib/AttributeConstants'
import {
    ENTER,
    INSIDE_BOUNDARY,
    OUTSIDE_BOUNDARY
} from '../../lib/ContainerConstants'
import { userEventLogService } from './UserEvent'
class Tracking {

    init() {
        // 1.  Wire up event-listeners

        // This handler fires whenever bgGeo receives a location update.
        BackgroundGeolocation.on('location', this.onLocation);

        // This handler fires whenever bgGeo receives an error
        BackgroundGeolocation.on('error', this.onError);

        // This handler fires when movement states changes (stationary->moving; moving->stationary)
        BackgroundGeolocation.on('motionchange', this.onMotionChange);

        // This event fires when a chnage in motion activity is detected
        BackgroundGeolocation.on('activitychange', this.onActivityChange);

        // This event fires when the user toggles location-services
        BackgroundGeolocation.on('providerchange', this.onProviderChange);

        // This event fires when the user get into a fence or get out of a fence 
        BackgroundGeolocation.on('geofence', (geofence) => {
            try {
                //Check status of FE i.e. inside boundary or outside boundary (in terms of library EXIT and ENTER)
                let fenceObject = keyValueDBService.getValueFromStore(GEO_FENCE_STATUS)
                fenceObject.then(status => {
                    //If status is mutually exclusive to geo fence action then show notification
                    if (status && status.value && geofence.action != status.value) {
                        //first save current status of geofence then show notification
                        keyValueDBService.validateAndSaveData(GEO_FENCE_STATUS, geofence.action)
                            .then(() => {
                                this.showNotification(geofence)
                            })
                    }
                })
            } catch (error) {
                //TODO
                console.log("An error occurred in my code!", error)
            }
        })


        // 2.  #configure the plugin (just once for life-time of app)
        BackgroundGeolocation.configure({
            // Geolocation Config
            desiredAccuracy: 0,
            stationaryRadius: 25,
            distanceFilter: 10,
            // Activity Recognition
            stopTimeout: 1,
            // Application config
            debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
            logLevel: BackgroundGeolocation.LOG_LEVEL_OFF,
            stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
            startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
            // HTTP / SQLite config
            // url: 'http://yourserver.com/locations',
            // batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
            // autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
            // headers: {              // <-- Optional HTTP headers
            //     "X-FOO": "bar"
            // },
            // params: {               // <-- Optional HTTP params
            //     "auth_token": "maybe_your_server_authenticates_via_token_YES?"
            // }
        }, function (state) {
            console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);
            if (!state.enabled) {
                BackgroundGeolocation.start(function () {
                    console.log("- Start success");
                });
            }
        });
    }

    destroy() {
        // Remove BackgroundGeolocation listeners
        BackgroundGeolocation.un('location', this.onLocation)
        BackgroundGeolocation.un('error', this.onError)
        BackgroundGeolocation.un('motionchange', this.onMotionChange)
        BackgroundGeolocation.un('activitychange', this.onActivityChange)
        BackgroundGeolocation.un('providerchange', this.onProviderChange)
        BackgroundGeolocation.stop()
        BackgroundGeolocation.removeListeners()
    }

    /**
     * @param {*} fenceIdentifier 
     * This method is use to delete geo fence by giving identifier saved in store and called when auto logout takes place
     */
    inValidateStoreVariables(fenceIdentifier) {
        //if fence is present then delete the fence in case of auto logout
        if (fenceIdentifier && fenceIdentifier.value && fenceIdentifier.value.identifier) {
            BackgroundGeolocation.removeGeofence(fenceIdentifier.value.identifier, () => {
                this.deleteFence() // delete fence identifier
                this.deleteLatLongAndStatus() // delete fence lat long object and status object
                console.log("Successfully removed geofence")
            }, (error) => {
                //TODO
                console.log("Failed to remove geofence", error)
            })
        }
    }

    /**
     * This method is called when a job is completed and we have to delete its fence and identifier
     * @param {*} fenceIdentifier 
     */
    removeGeofence(fenceIdentifier) {
        if (fenceIdentifier && fenceIdentifier.value && fenceIdentifier.value.identifier) {
            BackgroundGeolocation.removeGeofence(fenceIdentifier.value.identifier, () => {
                this.deleteFence()
                console.log("Successfully removed geofence")
            }, (error) => {
                //TODO
                console.log("Failed to remove geofence", error)
            })
        }
    }

    async onLocation(location) {
        let user = await keyValueDBService.getValueFromStore(USER) || {}
        let track_record = {
            'battery': location.battery.level * 100,
            'gpsSignal': location.coords.accuracy,
            'latitude': location.coords.latitude,
            'longitude': location.coords.longitude,
            'speed': location.coords.speed,
            'trackTime': moment(location.timestamp).format('YYYY-MM-DD HH:mm:ss'),
            'userId': user.value.id
        }
        realm.save(TABLE_TRACK_LOGS, track_record)
        await userSummaryService._updateUserSummary(location.coords.latitude, location.coords.longitude)
        await keyValueDBService.validateAndSaveData(TRACK_BATTERY, location.battery.level * 100)
    }



    onError(error) {
        console.log('error', error)
        // var type = error.type;
        // var code = error.code;
        // alert(type + " Error: " + code);
    }
    onActivityChange(activityName) {
        console.log('- Current motion activity: ', activityName);  // eg: 'on_foot', 'still', 'in_vehicle'
    }
    onProviderChange(provider) {
        console.log('- Location provider changed: ', provider.enabled);
    }
    onMotionChange(location) {
        // console.log('- [js]motionchanged: ', JSON.stringify(location));
    }

    /**
     * This function return track log that are to be synced with server
     * @param {*} trackLogsList 
     * @param {*} lastSyncTime 
     * @returns
     * [trackLogs]
     */
    getTrackLogs(trackLogsList, lastSyncTime) {
        let trackLogsToBeSynced = [];
        for (let trackLog in trackLogsList) {
            // If track log captured time is after last sync time with server then has to be sent to server
            if (moment(trackLogsList[trackLog].trackTime).isAfter(lastSyncTime)) {
                trackLogsToBeSynced.push(trackLogsList[trackLog]);
            }
        }
        return trackLogsToBeSynced;
    }

    /**
     * This method is use to add a geofence by giving it a lat long, radius, 
     * an identifier which is transactionId of current job which FE has to do next
     * and status i.e. currently FE is inside boundary or outside boundary 
     * @param {*} meanLatLong 
     * @param {*} radius 
     * @param {*} transactionIdIdentifier 
     * @param {*} status
     */
    addGeoFence(meanLatLong, radius, transactionIdIdentifier, status) {
        /* object which is added as a fence in Background-GeoLocation Library
            it will notifyOnEntry and notifyOnExit
           */
        let fenceObject = {
            identifier: transactionIdIdentifier,
            latitude: meanLatLong.latitude,
            longitude: meanLatLong.longitude,
            radius,
            notifyOnEntry: true,
            notifyOnExit: true,
        }
        BackgroundGeolocation.addGeofence(fenceObject, () => {
            console.log('- addGeofence success: ', fenceObject)
            // if status is present then this is not an inital job and another fence is present
            if (status && status.value) {
                this.storeFence(fenceObject.identifier, status.value)
            } else {// case of inital job and no fence is present and we assume that FE is inside fence
                this.storeFence(fenceObject.identifier, ENTER)
            }
        }, (error) => {
            //TODO
            console.log('- addGeofence error: ', error)
            // console.logs('- addGeofence error: ', error)
        })
    }

    /**
     * store fence object to store and status of FE
     * @param {*} identifier 
     * @param {*} status 
     */
    storeFence(identifier, status) {
        let objectToStore = {
            identifier
        }
        keyValueDBService.validateAndSaveData(GEO_FENCING, objectToStore)
        keyValueDBService.validateAndSaveData(GEO_FENCE_STATUS, status)
    }

    /**
     * delete fence object identifier
     */
    deleteFence() {
        keyValueDBService.deleteValueFromStore(GEO_FENCING)
    }

    /**
     * delete lat long object and status of FE
     */
    deleteLatLongAndStatus() {
        keyValueDBService.deleteValueFromStore(LAT_LONG_GEO_FENCE)
        keyValueDBService.deleteValueFromStore(GEO_FENCE_STATUS)
    }

    /**<----- DO NOT DELETE THIS METHOD ----->
     * This method loop through all the geofences present and it is not used anywhere, it's just for testing
     */
    getGeofences() {
        BackgroundGeolocation.getGeofences((geofences) => {
            for (let fence = 0; fence < geofences.length; fence++) {
                let geofence = geofences[fence]
            }
        })
    }

    /**
     * This method shows a notification to the user when fence is crossed
     * @param {*} geofence 
     */
    showNotification(geofence) {
        let message, eventId
        if (geofence.action == ENTER) {
            eventId = 20
            message = INSIDE_BOUNDARY
        } else {
            eventId = 19
            message = OUTSIDE_BOUNDARY
        }
        PushNotification.localNotification({
            /* iOS and Android properties */
            title: FAREYE_UPDATES,
            message,
            soundName: 'default'
        })
        this.updateUserEvent(geofence, message, eventId)// update user event with appropriate eventId
    }

    /**
     * This method update user event log DB when geofence is crossed
     * @param {*} geofence 
     * @param {*} outOfRouteMessage 
     * @param {*} eventId 
     */
    async updateUserEvent(geofence, outOfRouteMessage, eventId) {
        //Object of lat long contians last lat long of previous completed job, job which is to be completed next and second job to be completed
        let fenceLatLongObject = await keyValueDBService.getValueFromStore(LAT_LONG_GEO_FENCE)
        if (fenceLatLongObject && fenceLatLongObject.value) {
            //decription added for testing purpose
            let description = outOfRouteMessage + "previous:" + fenceLatLongObject.value.latLongObject.previousLatLong + ",current:" + fenceLatLongObject.value.latLongObject.currentLatLong + ",next:" + fenceLatLongObject.value.latLongObject.nextLatLong + ",radius:" + fenceLatLongObject.value.radius + ",centre:" + fenceLatLongObject.value.meanLatLong.latitude + "," + fenceLatLongObject.value.meanLatLong.longitude
            await userEventLogService.addUserEventLog(eventId, description)
        }
    }
}

export let trackingService = new Tracking()
