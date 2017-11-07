import { AppNavigator } from '../navigators/AppNavigator';

const {
    Application,
    Login,
    Preloader,
    Home,
    JobDetails,
    SkuListing,
    FormLayout,
    Sequence
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

const skuListingAction = AppNavigator.router.getActionForPathAndParams(SkuListing)
const skuListingState = AppNavigator.router.getStateForAction(skuListingAction)

const formLayoutAction = AppNavigator.router.getActionForPathAndParams(FormLayout)
const formLayoutState = AppNavigator.router.getStateForAction(formLayoutAction)

const sequenceAction = AppNavigator.router.getActionForPathAndParams(Sequence)
const sequenceState = AppNavigator.router.getStateForAction(sequenceAction)


const initialNavState = AppNavigator.router.getStateForAction(
  applicationAction,
  loginState,
  preloaderState,
  homeState,
  jobDetailsState,
  skuListingState,
  formLayoutState,
  sequenceState
);

export default initialNavState