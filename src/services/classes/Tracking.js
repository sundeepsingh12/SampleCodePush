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
    LAT_LONG_GEO_FENCE
} from '../../lib/constants'
import { userSummaryService } from './UserSummary'
import {
    FAREYE_UPDATES
} from '../../lib/AttributeConstants'
import {
    ENTER
} from '../../lib/ContainerConstants'
import { userEventLogService } from './UserEvent'
import { sync } from './Sync'

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
                let fenceObject = keyValueDBService.getValueFromStore(GEO_FENCING)
                fenceObject.then(object => {
                    if (object && object.value && geofence.action != object.value.status) {
                        keyValueDBService.deleteValueFromStore(GEO_FENCING).then(() => {
                            keyValueDBService.validateAndSaveData(GEO_FENCING, {
                                identifier: geofence.identifier,
                                status: geofence.action
                            }).then(() => {
                                this.showNotification(geofence)
                            })
                        })
                    }
                })
            } catch (error) {
                console.error("An error occurred in my code!", error);
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

    inValidateStoreVariables(fenceIdentifier) {
        if (fenceIdentifier && fenceIdentifier.value && fenceIdentifier.value.identifier) {
            BackgroundGeolocation.removeGeofence(fenceIdentifier.value.identifier, () => {
                this.deleteFence()
                this.deleteLatLong()
                console.logs("Successfully removed geofence")
            }, (error) => {
                console.logs("Failed to remove geofence", error)
            })
        }
    }

    removeGeofence(fenceIdentifier) {
        if (fenceIdentifier && fenceIdentifier.value && fenceIdentifier.value.identifier) {
            BackgroundGeolocation.removeGeofence(fenceIdentifier.value.identifier, () => {
                keyValueDBService.deleteValueFromStore(GEO_FENCING).then(() => {
                    sync.addGeoFence(false)
                })
                console.logs("Successfully removed geofence")
            }, (error) => {
                console.logs("Failed to remove geofence", error)
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

    getTrackLogs(trackLogs, lastSyncTime) {
        let trackLogsToBeSynced = []
        trackLogs.forEach(trackLog => {
            if (moment(trackLog.trackTime).isAfter(lastSyncTime.value)) {
                trackLogsToBeSynced.push(trackLog)
            }
        })
        return trackLogsToBeSynced
    }

    addGeoFence(meanLatLong, radius, transactionIdIdentifier) {
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
            console.logs('- addGeofence success: ', fenceObject)
            this.storeFence(fenceObject.identifier, ENTER)
        }, (error) => {
            console.log('- addGeofence error: ', error)
            console.logs('- addGeofence error: ', error)
        })
    }

    storeFence(identifier, status) {
        let objectToStore = {
            identifier,
            status
        }
        keyValueDBService.validateAndSaveData(GEO_FENCING, objectToStore)
    }

    deleteFence() {
        keyValueDBService.deleteValueFromStore(GEO_FENCING)
    }

    deleteLatLong() {
        keyValueDBService.deleteValueFromStore(LAT_LONG_GEO_FENCE)
    }

    getGeofences() {
        BackgroundGeolocation.getGeofences((geofences) => {
            console.logs('geofences', geofences)
            for (let fence = 0; fence < geofences.length; fence++) {
                let geofence = geofences[fence]
            }
        })
    }

    showNotification(geofence) {
        let message, eventId
        if (geofence.action == ENTER) {
            eventId = 20
            message = "inside boundary"
        } else {
            eventId = 19
            message = "out of boundary"
        }
        PushNotification.localNotification({
            /* iOS and Android properties */
            title: FAREYE_UPDATES, // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
            message, // (required)
            soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        })
        this.updateUserEvent(geofence, message, eventId)
    }


    async updateUserEvent(geofence, outOfRouteMessage, eventId) {
        let fenceLatLongObject = await keyValueDBService.getValueFromStore(LAT_LONG_GEO_FENCE)
        if (fenceLatLongObject && fenceLatLongObject.value) {
            let description = outOfRouteMessage + "previous:" + fenceLatLongObject.value.latLongObject.previousLatLong + ",current:" + fenceLatLongObject.value.latLongObject.currentLatLong + ",next:" + fenceLatLongObject.value.latLongObject.nextLatLong + ",radius:" + fenceLatLongObject.value.radius + ",centre:" + fenceLatLongObject.value.meanLatLong.latitude + "," + fenceLatLongObject.value.meanLatLong.longitude
            await userEventLogService.addUserEventLog(eventId, description)
        }
    }
}

export let trackingService = new Tracking()
