import { AppNavigator } from '../navigators/AppNavigator';

import {
    ApplicationScreen,
    LoginScreen,
    PreloaderScreen,
    JobDetails,
    SkuListing,
    FormLayout,
    Sequence
} from '../../lib/constants'

const applicationAction = AppNavigator.router.getActionForPathAndParams(ApplicationScreen);

const loginAction = AppNavigator.router.getActionForPathAndParams(LoginScreen)
const loginState = AppNavigator.router.getStateForAction(loginAction)

const preloaderAction = AppNavigator.router.getActionForPathAndParams(PreloaderScreen)
const preloaderState = AppNavigator.router.getStateForAction(preloaderAction)

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
  skuListingState,
  formLayoutState,
  sequenceState
);

export default initialNavState