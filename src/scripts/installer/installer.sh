#!/bin/bash
echo "APK Installer Script Running"

rm -rf node_modules/react-native-apk-installer/android/src/main/java/com/cnull/apkinstaller/ApkInstallerPackage.java 
cp src/scripts/installer/ApkInstallerPackage.java node_modules/react-native-apk-installer/android/src/main/java/com/cnull/apkinstaller/ 
