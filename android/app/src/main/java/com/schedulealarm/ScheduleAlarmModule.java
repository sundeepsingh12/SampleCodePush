package com.schedulealarm;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.support.annotation.Nullable;
import android.support.annotation.RequiresApi;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Locale;

public class ScheduleAlarmModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private SharedPreferences sharedPreferences;

    public ScheduleAlarmModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "ScheduleAlarm";
    }


    @ReactMethod
    public void setAlarm(String triggerTime, String jobId, String snoozeValue, Integer numberOfAlarms, String jobAttributeMasterId, @Nullable Callback successCallback, @Nullable Callback errorCallback) {
        try {
            long triggerTimeMillis = convertTimeToMilli(triggerTime);
            Intent intent = new Intent(reactContext, CountDownTimerService.class);
            intent.putExtra("jobId", jobId);
            intent.putExtra("snoozeValue", snoozeValue);
            intent.putExtra("numberOfAlarms", numberOfAlarms);
            intent.putExtra("jobAttributeMasterId", jobAttributeMasterId);
            PendingIntent pendingIntent = PendingIntent.getService(reactContext, numberOfAlarms, intent, PendingIntent.FLAG_UPDATE_CURRENT);
            AlarmManager alarmManager = (AlarmManager) reactContext.getSystemService(Context.ALARM_SERVICE);
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerTimeMillis, pendingIntent);
            successCallback.invoke();
            return;
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    public static Long convertTimeToMilli(String time) {
        SimpleDateFormat formattedDt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US);
        try {
            return (formattedDt.parse(time)).getTime();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return 0L;
    }
}