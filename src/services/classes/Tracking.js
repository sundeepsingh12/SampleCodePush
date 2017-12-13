'use strict'

import * as realm from '../../repositories/realmdb';
import { keyValueDBService } from './KeyValueDBService'
import BackgroundGeolocation from "react-native-background-geolocation";
import moment from 'moment';

import {
  TABLE_TRACK_LOGS,
  USER
} from '../../lib/constants'

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

        // 2.  #configure the plugin (just once for life-time of app)
        BackgroundGeolocation.configure({
            // Geolocation Config
            desiredAccuracy: 0,
            stationaryRadius: 25,
            distanceFilter: 10,
            // Activity Recognition
            stopTimeout: 1,
            // Application config
            debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
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
        BackgroundGeolocation.un('location', this.onLocation);
        BackgroundGeolocation.un('error', this.onError);
        BackgroundGeolocation.un('motionchange', this.onMotionChange);
        BackgroundGeolocation.un('activitychange', this.onActivityChange);
        BackgroundGeolocation.un('providerchange', this.onProviderChange);
    }

    async onLocation(location) {
        let user = await keyValueDBService.getValueFromStore(USER) || {};
        console.log('- [js]location: ');
        console.log(location);
        let track_record = {
            'battery': location.battery.level,
            'gpsSignal': location.coords.accuracy,
            'latitude': location.coords.latitude,
            'longitude': location.coords.longitude,
            'speed': location.coords.speed,
            'trackTime': moment(location.timestamp).format('YYYY-MM-DD HH:mm:ss'),
            'userId': user.value.id
        }
        realm.save(TABLE_TRACK_LOGS, track_record)
    }

    onError(error) {
        console.log('error',error)
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
        console.log('- [js]motionchanged: ', JSON.stringify(location));
    }

    getTrackLogs(trackLogs,lastSyncTime){
        let trackLogsToBeSynced = []
        trackLogs.forEach(trackLog=>{
              if(moment(trackLog.trackTime).isAfter(lastSyncTime.value)){
                trackLogsToBeSynced.push(trackLog)
              }
        })
        return trackLogsToBeSynced
    }
}

export let trackingService = new Tracking()
