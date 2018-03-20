#!/bin/bash
#!/bin/bash
echo "Creating Bluetooth project"

rm -rf node_modules/react-native-bluetooth-serial/android/src/main/java/com/rusel/RCTBluetoothSerial/RCTBluetoothSerialPackage.java 
cp src/scripts/bluetooth/RCTBluetoothSerialPackage.java node_modules/react-native-bluetooth-serial/android/src/main/java/com/rusel/RCTBluetoothSerial/ 
