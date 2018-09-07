package com.datetime;

import android.content.Context;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Date;

import java.text.SimpleDateFormat;
import java.text.ParseException;
import java.util.Locale;

public class DateTimeModule extends ReactContextBaseJavaModule {

   ReactApplicationContext reactContext;

   public DateTimeModule(ReactApplicationContext reactContext) {
       super(reactContext);
       this.reactContext = reactContext;
   }

    @Override
    public String getName() {
        return "DateTime";
    }

    @ReactMethod
    public void getTimeInMilliseconds(Promise promise) {
        try {
            SimpleDateFormat formattedDt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US);
            String dateTime = formattedDt.format(new Date());
            promise.resolve(dateTime);
        } catch (Exception e) {
            promise.reject(e.getMessage());
        }
    }

}

