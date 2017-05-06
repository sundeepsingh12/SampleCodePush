package com.imeigetter;

import android.content.Context;
import android.telephony.TelephonyManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNIMEIModule extends ReactContextBaseJavaModule {

   ReactApplicationContext reactContext;

   public RNIMEIModule(ReactApplicationContext reactContext) {
       super(reactContext);
       this.reactContext = reactContext;
   }

    @Override
    public String getName() {
        return "IMEI";
    }

    @ReactMethod
    public void getIMEI(Promise promise) {
        try {
            TelephonyManager tm = (TelephonyManager) this.reactContext.getSystemService(Context.TELEPHONY_SERVICE);
            promise.resolve(tm.getDeviceId());
        } catch (Exception e) {
            promise.reject(e.getMessage());
        }
    }

    @ReactMethod
    public void getSim(Promise promise){
        try{
             TelephonyManager tManager = (TelephonyManager) this.reactContext.getSystemService(Context.TELEPHONY_SERVICE);
              promise.resolve(tManager.getSimSerialNumber());
        }catch(Exception e){
        promise.reject(e.getMessage());
        }
    }
}

