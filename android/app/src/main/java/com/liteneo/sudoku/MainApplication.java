package com.liteneo.sudoku;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.mehcode.reactnative.splashscreen.SplashScreenPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.liteneo.RNLeanCloud.RNLeanCloudPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new ReactNativeI18n(),
          new RNDeviceInfo(),
          new RNLeanCloudPackage("gVk8jt4UgJhs9Lb8wyH2fHHk-gzGzoHsz", "XkusJpvkcRSc6w1cNBghqEbW"),
          new SplashScreenPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
