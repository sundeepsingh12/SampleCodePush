package com.mosambeePayment;

import android.app.AlertDialog;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.fareyereact.R;
import com.mosambee.lib.MosCallback;
import com.mosambee.lib.ResultData;
import com.mosambee.lib.TransactionCallback;
import com.mosambee.lib.TransactionResult;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;


/**
 * Created by mmpkl05 on 12/14/17.
 */

public class FrameView  extends LinearLayout implements TransactionResult{

    private ThemedReactContext context;
    Button mosambeeButton, checkTransactionStatusButton;
    MosCallback moscCallback;
    TransactionCallback tc;
    TextView mosambeeTextView;
    AlertDialog alertDialog;
    ReadableMap mosambeeParameters;


    public FrameView(ThemedReactContext context) {
        super(context);
        this.context = context;

    }
    @Override
    public void onCommand(String s) {

    }

    public void setMosambeeParameters(ReadableMap mosambeeParameters) {
        this.mosambeeParameters = mosambeeParameters;
        UiThreadUtil.runOnUiThread(
                new Runnable() {
                    @Override
                    public void run() {
                        init();
                    }
                }
        );
    }


    @Override
    public void onResult(ResultData result) {
        if (!result.getResult()) {
            mosambeeButton.setVisibility(View.VISIBLE);
            mosambeeTextView.setText("Payment_unsuccesful"
                    + "\n"+"Reason_code"+" " + result.getReasonCode()
                    + "\n"+"Reason"+" " + result.getReason());
        } else {
            if (alertDialog != null) {
                alertDialog.dismiss();
            }
            WritableMap params = Arguments.createMap();
            params.putString("jsonObject", result.getTransactionData());
            context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("showResult",params);
        }
    }

    public void init() {
        AlertDialog.Builder builder;
        builder = new AlertDialog.Builder(context, AlertDialog.THEME_HOLO_LIGHT);
        builder.setTitle("Processing mPOS");
        LayoutInflater inflater = LayoutInflater.from(context);
        View dialogView = inflater.inflate(R.layout.mosambee_frame_layout, null);
        FrameLayout frameLayout = (FrameLayout) dialogView.findViewById(R.id.frameContainer);
        mosambeeTextView = (TextView) dialogView.findViewById(R.id.mosambeeText);
        mosambeeButton = (Button) dialogView.findViewById(R.id.mosambeeButton);
        builder.setView(dialogView);
        builder.setCancelable(false);
        alertDialog = builder.create();
        mosambeeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (alertDialog != null) {
                    WritableMap params = Arguments.createMap();
                    params.putBoolean("backHandle", true);
                    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("backHandler",params);
                    alertDialog.dismiss();
                }
            }
        });
        alertDialog.show();
        SimpleDateFormat formattedDt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US);
        String dateTime = formattedDt.format(new Date());
        moscCallback = new MosCallback(context);
        tc = new MosCallback(context);
        tc.initialise("355370069303467", mosambeeParameters.getString("userPwd"),this);
        tc.initializeSignatureView(frameLayout, "#364b68", "#000000");
        moscCallback.initialiseFields("sale", mosambeeParameters.getString("contactNumber"),
                mosambeeParameters.getString("appKey"), true, "email@test.com",
                null, null, dateTime, null);
        tc.processTransaction(mosambeeParameters.getString("referenceNoActualAmountMap"), Double.parseDouble(mosambeeParameters.getString("actualAmount")), null, "");
    }

}