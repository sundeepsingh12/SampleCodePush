package com.smsinbackground;
import android.content.Context;
import android.telephony.SmsManager;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.content.ContentValues;
import android.net.Uri;
import java.util.ArrayList;

public class SendSMSModule extends ReactContextBaseJavaModule {

    ReactApplicationContext reactContext;

    public SendSMSModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "SendSMS";
    }

    @ReactMethod
    public void sendLongCodeSMS(String messageBody, String longCodeNumber, Promise promise) {
        try {
            SmsManager smsManager = SmsManager.getDefault();
            ArrayList<String> smsPartsList = new ArrayList<String>();
            smsPartsList = smsManager.divideMessage(messageBody);
            smsManager.sendMultipartTextMessage(longCodeNumber, null, smsPartsList, null, null);
            ContentValues values = new ContentValues();
            values.put("address", longCodeNumber);
            values.put("body", messageBody);
            reactContext.getContentResolver().insert(Uri.parse("content://sms/sent"), values);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject(e.getMessage());
        }
    }
}
