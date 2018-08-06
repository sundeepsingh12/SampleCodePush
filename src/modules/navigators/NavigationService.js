import { NavigationActions, StackActions } from 'react-navigation';

let _navigator = null;

function setTopLevelNavigator(navigatorRef) {
  if (navigatorRef) {
    _navigator = navigatorRef;
  }
}

function getState() {
  return _navigator.state;
}

function navDispatch(args) {
  _navigator.dispatch(args);
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function push(routeName, params) {
  _navigator.dispatch(
    StackActions.push({
      routeName,
      params,
    })
  );
}

function popToTop() {
  _navigator.dispatch(
    StackActions.popToTop()
  );
}

export { getState, navDispatch, setTopLevelNavigator, navigate, _navigator, push, popToTop }; 
