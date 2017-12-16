import { AppNavigator } from '../navigators/AppNavigator'
import { NavigationActions } from 'react-navigation'
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
   if (action.type.startsWith('Navigation/')) {
    const { type, routeName } = action
    const lastRoute = state.routes[state.routes.length - 1]
    if (routeName == lastRoute.routeName) return state
  }
  return AppNavigator.router.getStateForAction(action, state)
}
