package com.schedulealarm;

import android.app.IntentService;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.fareyereact.MainApplication;

import org.json.JSONObject;

import java.util.Date;

public class CountDownTimerService extends IntentService {
    Context context;
    String jobId = null;
    String countDownTimerValue = null;
    Integer numberOfAlarms;
    String jobAttributeMasterId;
    String snoozeValue;
    Date date = null;

    public CountDownTimerService() {
        super("CountDownTimerService");
    }

    @Override
    public void onCreate() {
        super.onCreate();
        context = this;
        Log.d("onCreate", "Countdownservice");
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        try {
            Bundle bundle = intent.getExtras();
            if (bundle != null) {
                jobId = bundle.getString("jobId");
                snoozeValue = bundle.getString("snoozeValue");
                numberOfAlarms = bundle.getInt("numberOfAlarms");
                jobAttributeMasterId = bundle.getString("jobAttributeMasterId");
                JSONObject callObj = new JSONObject();
                callObj.put("jobId", jobId);
                callObj.put("snoozeValue", snoozeValue);
                callObj.put("numberOfAlarms", numberOfAlarms);
                callObj.put("jobAttributeMasterId", jobAttributeMasterId);
                MainApplication application = (MainApplication) this.getApplication();

                ReactNativeHost reactNativeHost = application.getReactNativeHost();
                ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
                ReactContext reactContext = reactInstanceManager.getCurrentReactContext();

                if (reactContext != null) {
                    WritableNativeArray params = new WritableNativeArray();
                    params.pushString(callObj.toString());
                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("SHOW_ALARM", params);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}