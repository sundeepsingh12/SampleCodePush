package com.callgetter;

import android.provider.CallLog;
import android.provider.CallLog.Calls;
import android.database.Cursor;

import java.util.Date;

import android.content.Context;

import org.json.*;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class CallLogsModule extends ReactContextBaseJavaModule {

    ReactApplicationContext reactContext;

    public CallLogsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "CALLS";
    }

    @ReactMethod
    public void getCallLogs(String dateTime, Callback callBack) {
        String[] dates = {dateTime + ""};

        Cursor cursor = this.reactContext.getContentResolver().query(CallLog.Calls.CONTENT_URI,
                null, CallLog.Calls.DATE + ">=?", dates, CallLog.Calls.DATE + " DESC");
        
        if (cursor == null) {
            callBack.invoke("[]");
            return;
        }
        int number = cursor.getColumnIndex(CallLog.Calls.NUMBER);
        int type = cursor.getColumnIndex(CallLog.Calls.TYPE);
        int date = cursor.getColumnIndex(CallLog.Calls.DATE);
        int duration = cursor.getColumnIndex(CallLog.Calls.DURATION);
        JSONArray callArray = new JSONArray();
        while (cursor.moveToNext()) {
            String phNumber = cursor.getString(number);
            String callType = cursor.getString(type);
            String callDate = cursor.getString(date);
            String callDuration = cursor.getString(duration);
            String dir = null;
            int dircode = Integer.parseInt(callType);
            switch (dircode) {
                case CallLog.Calls.OUTGOING_TYPE:
                    dir = "OUTGOING";
                    break;
                case CallLog.Calls.INCOMING_TYPE:
                    dir = "INCOMING";
                    break;
                case CallLog.Calls.MISSED_TYPE:
                    dir = "MISSED";
                    break;
            }

            JSONObject callObj = new JSONObject();
            try {
                callObj.put("phoneNumber", phNumber);
                callObj.put("callType", dir);
                callObj.put("callDate", callDate);
                callObj.put("callDuration", callDuration);
                callArray.put(callObj);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        cursor.close();
        callBack.invoke(callArray.toString());
    }
}
