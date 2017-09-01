import { AppNavigator } from '../navigators/AppNavigator';

const {
    Application,
    Login,
    Preloader,
    Main
} = require('../../lib/constants').default

const applicationAction = AppNavigator.router.getActionForPathAndParams(Application);

const loginAction = AppNavigator.router.getActionForPathAndParams(Login);
const loginState = AppNavigator.router.getStateForAction(loginAction);

const preloaderAction = AppNavigator.router.getActionForPathAndParams(Preloader)
const preloaderState = AppNavigator.router.getStateForAction(preloaderAction)

const mainAction = AppNavigator.router.getActionForPathAndParams(Main)
const mainState = AppNavigator.router.getStateForAction(mainAction)

const initialNavState = AppNavigator.router.getStateForAction(
  applicationAction,
  loginState,
  preloaderState,
  mainState
);

export default initialNavState