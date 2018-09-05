#!/bin/bash
echo "Creating Bluetooth project"

rm -rf node_modules/react-native-bluetooth-serial/android/src/main/java/com/rusel/RCTBluetoothSerial/RCTBluetoothSerialPackage.java node_modules/react-native-bluetooth-serial/android/src/main/java/com/rusel/RCTBluetoothSerial/RCTBluetoothSerialModule.java node_modules/react-native-bluetooth-serial/index.js node_modules/react-native-bluetooth-serial/android/build.gradle
cp src/scripts/bluetooth/RCTBluetoothSerialPackage.java node_modules/react-native-bluetooth-serial/android/src/main/java/com/rusel/RCTBluetoothSerial/ 
cp src/scripts/bluetooth/RCTBluetoothSerialModule.java node_modules/react-native-bluetooth-serial/android/src/main/java/com/rusel/RCTBluetoothSerial/ 
cp src/scripts/bluetooth/build.gradle node_modules/react-native-bluetooth-serial/android/
cp src/scripts/bluetooth/index.js node_modules/react-native-bluetooth-serial/
