import { NavigationActions } from 'react-navigation';

let _navigator = null, navDispatch = null;

function setTopLevelNavigator(navigatorRef) {
  if(navigatorRef) {
    _navigator = navigatorRef;
    //IF you wish to see a cyclic object(_navigate here)   
    // var seen = [];
    // console.logs(JSON.stringify(_navigator, function(key, val) {
    //     if (val != null && typeof val == "object") {
    //           if (seen.indexOf(val) >= 0) {
    //               return;
    //           }
    //           seen.push(val);
    //       }
    //       return val;
    //   }))
    navDispatch = navigatorRef.dispatch;
  }
}

function getState() {
  return _navigator.state;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

export { getState, navDispatch, setTopLevelNavigator, navigate }; 
