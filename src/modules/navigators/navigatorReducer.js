import { AppNavigator } from '../navigators/AppNavigator'
import { NavigationActions } from 'react-navigation'

import {
  ApplicationScreen,
  LoginScreen,
  PreloaderScreen,
  HomeScreen,
  JobDetails,
  FormLayout
} from '../../lib/constants'

const INITIAL_STATE = AppNavigator.router.getStateForAction(NavigationActions.init())

export default function nav(state = INITIAL_STATE, action) {
  const nextState = AppNavigator.router.getStateForAction(action, state)

  return nextState || state
}
