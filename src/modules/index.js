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
import checkBox from './selectFromList/selectFromListReducer'
import skuListing from './skulisting/skuListingReducer'
import payment from './payment/paymentReducer'
import upiPayment from './cardTypePaymentModules/upiPayment/upiPaymentReducer'
import payByLinkPayment from './cardTypePaymentModules/payByLinkPayment/payByLinkPaymentReducer'
import fixedSKU from './fixedSKU/fixedSKUReducer'
import signature from './signature/signatureReducer'
import formLayout from './form-layout/formLayoutReducer'
// import profile from './profile/profileReducer'

import { combineReducers } from 'redux'

/**
 * ## CombineReducers
 *
 * the rootReducer will call each and every reducer with the state and action
 * EVERY TIME there is a basic action
 */
const rootReducer = combineReducers({
  auth,
  device,
  global,
  home,
  jobDetails,
  checkBox,
  skuListing,
  listing,
  nav,
  payment,
  preloader,
  upiPayment,
  payByLinkPayment,
  fixedSKU,
  signature,
  formLayout,
})

export default rootReducer
