# fareye-react

------------------------------------------------
      How to Run?
------------------------------------------------      
For IOS:
Step 1: react-native init FareyeReact
Step 2: Install xCode
Step 3: react-native run-ios

For Android:
Step 1: react-native init FareyeReact
Step 2: Go to /path/to/FareyeReact/android/local.properties and update:sdk.dir
(for e.g. sdk.dir=/Users/gauravsrivastava/JavaDev/adt-bundle-mac-x86_64-20140702/sdk)
Step 3: react-native run-android


------------------------
Error
------------------------
Could not get batched bridge - make sure your bundle

Solution
------------------------
Go to "android > app > src > main " - Create assets folder

Go to terminal:
>  cd myproject
>  react-native start > /dev/null 2>&1 &
>  curl "http://localhost:8081/index.android.bundle?platform=android" -o "android/app/src/main/assets/index.android.bundle"
>  react-native run-android



------------------------------------------------
      Libraries (from Snowflake)
------------------------------------------------
npm install --save react-native-router-flux
npm install --save redux
npm install --save react-redux
npm install --save redux-thunk
npm install --save keymirror
npm install --save underscore
npm install --save react-mixin
npm install --save react-timer-mixin
npm install react-native-vector-icons --save
npm install --save regenerator
npm install tcomb-form-native
npm install --save react-native-simpledialog-android
npm install --save apsl-react-native-button
npm install --save validate.js

----------------
      Extra
----------------
npm install --save redux-logger
npm i react-native-item-checkbox
npm install --save sha256

npm install --save realm
react-native link realm


To start remote Debugging
------------------------
On the Android app, shake to open Dev menu
Go to Dev Settings > Debug Server host and port ... > Enter your IP address:8081 (192.168.2.139:8081)
For this to work, your mobile device and laptop have to be on the same network


To use ES Lint
---------------------

- Add ES Linter library to Atom (from package manager)
- Start terminal
> CD project_folder
> npm i --save-dev eslint
> ./node_modules/.bin/eslint --init
Restart Atom


To use NPM Libraries
_____________________________
npm install rn-nodeify
npm install rn-nodeify -g

Add this to package.json - script section
"postinstall": "node_modules/.bin/rn-nodeify --install md5 --hack"


For Android
----------------
Make modifications in: MainApplication.java
Reference: https://github.com/lucasferreira/react-native-simpledialog-android

    import com.burnweb.rnsimplealertdialog.RNSimpleAlertDialogPackage;  // <--- import

    public class MainApplication extends Application implements ReactApplication {
      ......
      @Override
      protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new RNSimpleAlertDialogPackage()); // <------ add this line to your MainApplication class
      }
      ......
    }
