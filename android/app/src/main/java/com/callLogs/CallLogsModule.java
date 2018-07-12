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
import com.facebook.react.bridge.Promise;

import android.telephony.PhoneNumberUtils;
import android.net.Uri;

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
    public void getCallLogs(String dateTime, String lastCallLogTime, Promise promise) {
        String[] dates = {dateTime + ""};
        Cursor cursor;
        if (lastCallLogTime == null) {
            cursor = this.reactContext.getContentResolver().query(CallLog.Calls.CONTENT_URI, null, CallLog.Calls.DATE + ">=?", dates, CallLog.Calls.DATE + " DESC");
        } else {
            String[] args = {lastCallLogTime};
            cursor = this.reactContext.getContentResolver().query(CallLog.Calls.CONTENT_URI, null, CallLog.Calls.DATE + ">?", args, CallLog.Calls.DATE + " DESC");
        }
        if (cursor == null) {
            promise.reject("[]");
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
        promise.resolve(callArray.toString());
    }

    @ReactMethod
    public void compareNumbers(String a, String b, Promise promise) {
        promise.resolve(PhoneNumberUtils.compare(a, b));
    }

    @ReactMethod
    public void getSmsLogs(String dateTime, String lastCallLogTime, Promise promise) {
        JSONArray callArray = new JSONArray();
        Uri uri = Uri.parse("content://sms");
        String filter;
        if (lastCallLogTime == null) {
            filter = "date>=" + dateTime;
        } else {
            filter = "date>" + lastCallLogTime;
        }
        Cursor cursor = this.reactContext.getContentResolver().query(uri, null, filter, null, "date DESC");
        if (cursor == null) {
            promise.reject("[]");
            return;
        }
         while (cursor.moveToNext()){

                String dateTimeInMillis;
                String contact;
                try {
                    contact = cursor.getString(cursor.getColumnIndexOrThrow("address")) + "";
                } catch (Exception e) {
                    contact = "";
                }

                try {
                    dateTimeInMillis = cursor.getString(cursor.getColumnIndexOrThrow("date")) + "";
                } catch (Exception e) {
                    dateTimeInMillis = "";
                }

                String smsBody;
                try {
                    smsBody = cursor.getString(cursor.getColumnIndexOrThrow("body")) + "";
                } catch (Exception e) {
                    smsBody = "";
                    e.printStackTrace();
                }
                String type;
                try {
                    type = cursor.getString(cursor.getColumnIndexOrThrow("type")) + "";
                      switch (Integer.parseInt(type)) {
                                case 1:
                                    type="INBOX";
                                    break;
                                case 2:
                              type="SENT";

                                    break;
                                case 3:
                            type="DRAFT";

                                    break;
                            }
                } catch (Exception e) {
                    type = "";
                    e.printStackTrace();
                }


                JSONObject callObj = new JSONObject();
                try {
                    callObj.put("phoneNumber", contact);
                    callObj.put("callType", type);
                    callObj.put("callDate", dateTimeInMillis);
                    callObj.put("smsBody", smsBody);
                    callArray.put(callObj);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            } 
           cursor.close();
            promise.resolve(callArray.toString());

    }
}
