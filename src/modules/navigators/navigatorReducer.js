import { AppNavigator } from '../navigators/AppNavigator';
import { NavigationActions } from 'react-navigation';
const initialNavState = require('./navigatorInitialState').default   

const {
    Application,
    Login,
    Preloader,
    Home,
    JobDetails,
    FormLayout
} = require('../../lib/constants').default

export default function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case Application:
      nextState = AppNavigator.router.getStateForAction(
         NavigationActions.back(),
        state
      );
      break;
      case Login:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: Preloader }),
        state
      );
    break;
    case Preloader:
       nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName:  Home }),
        state
      );
      break;
      case Home:
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