package com.mosambeePayment;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;


public class MosambeePaymentModule extends SimpleViewManager<FrameView>  {

   ReactApplicationContext reactContext;

   public MosambeePaymentModule(ReactApplicationContext reactContext) {
       this.reactContext = reactContext;
   }

    @Override
    public String getName() {
        return "MosambeePayment";
    }

    @Override
    public FrameView createViewInstance(ThemedReactContext context) {
        return new FrameView(context); //If your customview has more constructor parameters pass it from here.
    }

    @ReactProp(name = "mosambeeParameters")
    public void setType(FrameView view, ReadableMap mosambeeParameters) {
        view.setMosambeeParameters(mosambeeParameters);
    }
}

