/**
 * # fieldValidation.js
 *
 * Define the validation rules for various fields such as email, username,
 * and passwords.  If the rules are not passed, the appropriate
 * message is displayed to the user
 *
 */
'use strict'

/**
 * ## Imports
 *
 * validate and underscore
 *
 */
import validate from 'validate.js'
import _ from 'underscore'

/**
* ## username validation rule
* read the message.. ;)
*/
const usernamePattern = /^[a-zA-Z0-9]{6,12}$/
const usernameConstraints = {
  username: {
    format: {
      pattern: usernamePattern,
      flags: 'i'
    }
  }
}

/**
* ## password validation rule
* read the message... ;)
*/
const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/
const passwordConstraints = {
  password: {
    format: {
      pattern: passwordPattern,
      flags: 'i'
    }
  }
}

/**
 * ## Field Validation
 * @param {Object} state Redux state
 * @param {Object} action type & payload
 */
export default function fieldValidation (state, action) {
  const {field, value} = action.payload

  switch (field) {
    /**
     * ### username validation
     * set the form field error
     */
    case ('username'):
      let validUsername = _.isUndefined(validate({username: value},
                                                {}))
      if (validUsername) {
        return state.setIn(['form', 'fields', 'usernameHasError'],
                         false)
        .setIn(['form', 'fields', 'usernameErrorMsg'], '')
      } else {
        return state.setIn(['form', 'fields', 'usernameHasError'], true)
        .setIn(['form', 'fields', 'usernameErrorMsg'],
               "Username not matching pattern")
      }

    /**
     * ### password validation
     * set the form field error
     */
    case ('password'):
      let validPassword = _.isUndefined(validate({password: value},
                                               {  }))
      if (validPassword) {
        return state.setIn(['form', 'fields', 'passwordHasError'],
                         false)
        .setIn(['form', 'fields', 'passwordErrorMsg'],
               '')
      } else {
        return state.setIn(['form', 'fields', 'passwordHasError'], true)
        .setIn(['form', 'fields', 'passwordErrorMsg'], "Password not matching pattern")
      }

    /**
     * ### showPassword
     * toggle the display of the password
     */
    case ('showPassword'):
      return state.setIn(['form', 'fields',
                                'showPassword'], value)

  }
  return state
}
