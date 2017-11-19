import { AppNavigator } from '../navigators/AppNavigator';
import { NavigationActions } from 'react-navigation';
import initialNavState from './navigatorInitialState'

import {
    ApplicationScreen,
    LoginScreen,
    PreloaderScreen,
    HomeScreen,
    JobDetails,
    FormLayout
} from '../../lib/constants'

export default function nav(state = initialNavState, action) {
  let nextState
  switch (action.type) {
    case ApplicationScreen:
      nextState = AppNavigator.router.getStateForAction(
         NavigationActions.back(),
        state
      );
      break;
      case LoginScreen:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: Preloader }),
        state
      );
    break;
    case PreloaderScreen:
       nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName:  Home }),
        state
      );
      break;
      case HomeScreen:
       nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName:  JobDetails }),
        state
      );
      break;
      case JobDetails:
      nextState = AppNavigator.router.getStateForAction(
       NavigationActions.navigate({ routeName:  FormLayout }),
       state
     );
     break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}