#!/bin/bash
echo "Creating project without FaceDetector"
if [ -e node_modules/react-native-camera/ios/FaceDetector ] ; then
  rm -rf node_modules/react-native-camera/ios/FaceDetector
fi

cp node_modules/react-native-camera/postinstall_project/projectWithoutFaceDetection.pbxproj node_modules/react-native-camera/ios/RNCamera.xcodeproj/project.pbxproj
cp src/scripts/camera/Camera1.java node_modules/react-native-camera/android/src/main/java/com/google/android/cameraview/Camera1.java