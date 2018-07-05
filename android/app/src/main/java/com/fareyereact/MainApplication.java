package com.fareyereact;

import android.app.Application;
import com.emekalites.react.compress.image.ImageCompressPackage;
import com.facebook.react.ReactApplication;
import com.psykar.cookiemanager.CookieManagerPackage;
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
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

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
            new CookieManagerPackage(),
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
            new RNIMEIPackage()
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
