/**
 * # reducers
 *
 * This class combines all the reducers into one
 *
 */
'use strict'

import auth from './login/loginReducer'
import device from './device/deviceReducer'
import global from './global/globalReducer'
import preloader from './pre-loader/preloaderReducer'
import nav from './navigators/navigatorReducer'
import home from './home/homeReducer'
import listing from './listing/listingReducer'
import jobDetails from './job-details/jobDetailsReducer'
import selectFromList from './selectFromList/selectFromListReducer'
import skuListing from './skulisting/skuListingReducer'
import payment from './payment/paymentReducer'
import upiPayment from './cardTypePaymentModules/upiPayment/upiPaymentReducer'
import payByLinkPayment from './cardTypePaymentModules/payByLinkPayment/payByLinkPaymentReducer'
import fixedSKU from './fixedSKU/fixedSKUReducer'
import signature from './signature/signatureReducer'
import formLayout from './form-layout/formLayoutReducer'
import array from './array/arrayReducer'
import sequence from './sequence/sequenceReducer'
import cashTenderingReducer from './cashTendering/cashTenderingReducer'
import dataStore from './dataStore/dataStoreReducer'
import newJob from './newJob/newJobReducer'
import statistics from './statistics/statisticsReducer'
import bulk from './bulk/bulkReducer'
import profileReducer from './profile/profileReducer'
import sorting from './sorting/sortingReducer'
import taskList from './taskList/taskListReducer'
// import profile from './profile/profileReducer'

import {
  combineReducers
} from 'redux'
import {
  PRE_LOGOUT_SUCCESS
} from '../lib/constants'

/**
 * ## CombineReducers
 *
 * the rootReducer will call each and every reducer with the state and action
 * EVERY TIME there is a basic action
 */
const appReducer = combineReducers({
  nav,
  auth,
  device,
  global,
  home,
  jobDetails,
  selectFromList,
  skuListing,
  listing,
  payment,
  preloader,
  upiPayment,
  payByLinkPayment,
  fixedSKU,
  signature,
  formLayout,
  array,
  sequence,
  cashTenderingReducer,
  dataStore,
  newJob,
  statistics,
  bulk,
  profileReducer,
  sorting,
  taskList,
})

const rootReducer = (state, action) => {
  //Reset state of Redux Store
  if (action.type == PRE_LOGOUT_SUCCESS) {
    state = undefined
  }
  return appReducer(state, action)
}

export default rootReducer