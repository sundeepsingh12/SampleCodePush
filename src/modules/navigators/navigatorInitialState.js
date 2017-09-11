import { AppNavigator } from '../navigators/AppNavigator';

const {
    Application,
    Login,
    Preloader,
    Home,
    JobDetails
} = require('../../lib/constants').default

const applicationAction = AppNavigator.router.getActionForPathAndParams(Application);

const loginAction = AppNavigator.router.getActionForPathAndParams(Login);
const loginState = AppNavigator.router.getStateForAction(loginAction);

const preloaderAction = AppNavigator.router.getActionForPathAndParams(Preloader)
const preloaderState = AppNavigator.router.getStateForAction(preloaderAction)

const homeAction = AppNavigator.router.getActionForPathAndParams(Home)
const homeState = AppNavigator.router.getStateForAction(homeAction)

const jobDetailsAction = AppNavigator.router.getActionForPathAndParams(JobDetails)
const jobDetailsState = AppNavigator.router.getStateForAction(jobDetailsAction)

const initialNavState = AppNavigator.router.getStateForAction(
  applicationAction,
  loginState,
  preloaderState,
  homeState,
  jobDetailsState
);

export default initialNavState