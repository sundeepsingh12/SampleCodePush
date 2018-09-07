package com.fareyereact;

import android.app.Application;
import com.emekalites.react.compress.image.ImageCompressPackage;
import com.facebook.react.ReactApplication;
import com.chirag.RNMail.RNMail;
import com.zmxv.RNSound.RNSoundPackage;
import com.rusel.RCTBluetoothSerial.RCTBluetoothSerialPackage;
import com.pritesh.calldetection.CallDetectionManager;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.cnull.apkinstaller.ApkInstallerPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.imagepicker.ImagePickerPackage;
import org.reactnative.camera.RNCameraPackage;
import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;
import io.realm.react.RealmReactPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.rssignaturecapture.RSSignatureCapturePackage;
import com.horcrux.svg.SvgPackage;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import com.rnziparchive.RNZipArchivePackage;
import com.rnfs.RNFSPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.imeigetter.RNIMEIPackage;
import com.smsinbackground.SendSMSPackage;
import java.util.Arrays;
import java.util.List;
import android.support.multidex.MultiDexApplication;
import com.callgetter.CallLogsPackage;
import com.opendatetimesettings.OpenDateTimeSettingsPackage;
import com.mosambeePayment.MosambeePaymentPackage;
import com.schedulealarm.ScheduleAlarmPackage;
import com.datetime.DateTimePackage;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
           new RNMail(),
          new RNSoundPackage(),
          new RCTBluetoothSerialPackage(),
          new CallDetectionManager(MainApplication.this),
          new ImagePickerPackage(),
          new PickerPackage(),
          new ImageCompressPackage(), 
          new ApkInstallerPackage(),
          new RNCameraPackage(),
          new FIRMessagingPackage(),
          new RNBackgroundFetchPackage(),
          new RealmReactPackage(),
          new LinearGradientPackage(),
          new RSSignatureCapturePackage(),
          new SvgPackage(),
          new RNBackgroundGeolocation(),
          new RNZipArchivePackage(),
          new RNFSPackage(),
          new RNFetchBlobPackage(),
          new VectorIconsPackage(),
          new RNDeviceInfo(),
          new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
          new BackgroundTimerPackage() ,
          new RNIMEIPackage(),
          new SendSMSPackage(),
          new CallLogsPackage(),
          new OpenDateTimeSettingsPackage(),
          new MosambeePaymentPackage(),
          new ScheduleAlarmPackage(),
          new DateTimePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index.android";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }

}
