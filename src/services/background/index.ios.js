import BackgroundFetch from "react-native-background-fetch";

export function backgroundServiceEvery15mins() {
  BackgroundFetch.configure({
      stopOnTerminate: false
    }, function() {
      console.log("[js] Received background-fetch event");
      // To signal completion of your task to iOS, you must call #finish!
      // If you fail to do this, iOS can kill your app.
      BackgroundFetch.finish();
    }, function(error) {
      console.log("[js] RNBackgroundFetch failed to start");
    });

    // Optional: Query the authorization status.
    BackgroundFetch.status(function(status) {
      switch(status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log("BackgroundFetch restricted");
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log("BackgroundFetch denied");
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log("BackgroundFetch is enabled");
          break;
      }
    });
}

