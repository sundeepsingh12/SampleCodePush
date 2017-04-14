/**
 * # Login.js
 *
 * This class is a little complicated as it handles multiple states.
 *
 */
'use strict'
/**
 * ## Imports
 *
 * Redux
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

/**
 * The actions we need
 */
import * as authActions from '../reducers/login/loginActions'
import * as globalActions from '../reducers/global/globalActions'

/**
 * Router actions
 */
import { Actions } from 'react-native-router-flux'

/**
 * The ErrorAlert displays an alert for both ios & android
 */
import ErrorAlert from '../components/ErrorAlert'
/**
 * The FormButton will change it's text between the 4 states as necessary
 */
import ButtonSuccess from '../components/ButtonSuccess'
import ButtonLinear from '../components/ButtonLinear'

/**
 *  The LoginForm does the heavy lifting of displaying the fields for
 * textinput and displays the error messages
 */
import LoginForm from '../components/LoginForm'
/**
 * The itemCheckbox will toggle the display of the password fields
 */
// var ItemCheckbox = require('react-native-item-checkbox');
import ItemCheckbox from '../components/ItemCheckbox'
/**
 * The necessary React components
 */

import React, {Component} from 'react'
import
{
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  View,
  Image,
  Modal
}
from 'react-native'


import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Container, Content, Button,  List, ListItem, Thumbnail, Body, Left, Right, Badge } from 'native-base';

import Dimensions from 'Dimensions'
var {height, width} = Dimensions.get('window') // Screen dimensions in current orientation

/**
 * The states were interested in
 */
const {
  LOGIN
} = require('../lib/constants').default

/**
 * ## Styles
 */
var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  issueWrapper: {
    flex: 1, 
    backgroundColor: '#ffffff', 
    height: '100%', 
    paddingTop: 80, 
    flexDirection: 'column', 
    justifyContent: 'center'
  },

  listIcons: {
    flexBasis: '20%',
    color: '#a3a3a3', 
    fontSize: 24
  },

  inputs: {
    width: '70%'
  },
  forgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },
  logoContainer: {
    marginTop: 90,
    marginBottom: 30,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center'
  },
  logoStyle: {
    width: 94,
    resizeMode: 'contain'
  },

  iconLargeWhite : {
    color: '#fff',
    fontSize: 104
  }
 
})
/**
 * ## Redux boilerplate
 */

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ ...authActions, ...globalActions }, dispatch)
  }
}
/**
 * ### Translations
 */

class LoginRender extends Component {
  constructor (props) {
    super(props)
    this.errorAlert = new ErrorAlert()
    this.state = {
      value: {
        username: this.props.auth.form.fields.username,
        password: this.props.auth.form.fields.password,
      }
    }
  }

  /**
   * ### componentWillReceiveProps
   * As the properties are validated they will be set here.
   */
  componentWillReceiveProps (nextprops) {
    this.setState({
      value: {
        username: nextprops.auth.form.fields.username,
        password: nextprops.auth.form.fields.password,
      }
    })
  }

  /**
   * ### onChange
   *
   * As the user enters keys, this is called for each key stroke.
   * Rather then publish the rules for each of the fields, I find it
   * better to display the rules required as long as the field doesn't
   * meet the requirements.
   * *Note* that the fields are validated by the authReducer
   */
  onChange (value) {
    if (value.username !== '') {
      this.props.actions.onAuthFormFieldChange('username', value.username)
    }
    if (value.password !== '') {
      this.props.actions.onAuthFormFieldChange('password', value.password)
    }
    this.setState(
      {value}
    )
  }

  /**
   * ### render
   * Setup some default presentations and render
   */
  render () {
    var onButtonPress = this.props.onButtonPress
    let self = this

    // display the login / register / change password screens
    this.errorAlert.checkError(this.props.auth.form.error)

    /**
     * Toggle the display of the Password and PasswordAgain fields
     */

    /**
     * The LoginForm is now defined with the required fields.  Just
     * surround it with the Header and the navigation messages
     * Note how the button too is disabled if we're fetching. The
     * header props are mostly for support of Hot reloading.
     * See the docs for Header for more info.
     */
    return (
      <View style={styles.container}>
        <Modal
          animationType={"slide"}
          visible={true}
          >
         <View style={styles.issueWrapper}>
            <View style={{flexDirection: 'column', flexBasis: '40%', alignItems: 'center', flex:1}}>
              <View>
                <Image
                  style={styles.logoStyle}
                  source={require('../../images/warning.png')}
                />
              </View>
              <Text style={{color: '#000000', fontSize: 32, fontWeight: '200', marginTop: 30}} >
                  Fix Issues
              </Text>
            </View>
            <View style={{flexDirection: 'column', flexBasis: '40%', flex: 1, justifyContent: 'center'}}>
              <List>
                  <ListItem>
                      <Left>
                          <Ionicons name="ios-warning-outline" style={styles.listIcons} />
                          <Text style={{color: '#a3a3a3'}}>Insert SIM</Text>
                      </Left>
                      <Body />
                  </ListItem>
                  <ListItem>
                      <Left>
                          <Ionicons name="ios-pin-outline" style={styles.listIcons} />
                          <Text style={{color: '#a3a3a3'}}>Enable GPS</Text>
                      </Left>
                      <Body />
                  </ListItem>
                  <ListItem>
                      <Left>
                          <Ionicons name="ios-globe-outline" style={styles.listIcons} />
                          <Text style={{color: '#a3a3a3'}}>Enable Internet</Text>
                      </Left>
                      <Body />
                  </ListItem>
              </List>
            </View>
            <View style={{flexBasis: '30%', paddingTop: 20, flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
              <Button rounded danger style={{margin: 10}} >
                  <Text style={{color: '#ffffff'}} >Close</Text>
              </Button>
              <Button rounded success style={{margin: 10}}>
                  <Text style={{color: '#ffffff'}}>Retry</Text>
              </Button>
            </View>
         </View>
        </Modal>
        <ScrollView horizontal={false} width={width} height={height}>
          <View style={styles.wrapper}>
            <View style={styles.inputs}>
              <View style={styles.logoContainer}>
                <Image
                  style={styles.logoStyle}
                  source={require('../../images/fareye-logo.png')}
                />
              </View>

              <View style={{position:'relative'}}>
                <LoginForm
                  form={this.props.auth.form}
                  value={this.state.value}
                  onChange={self.onChange.bind(self)} />

                <View style={{position: 'absolute', bottom: 23, right: 10}}>
                  <ItemCheckbox
                      size = {28}
                      icon_check= 'ios-eye-off-outline'
                      icon_open= 'ios-eye-outline'
                      disabled={this.props.auth.form.isFetching}
                      onCheck={() => {
                        this.props.actions.onAuthFormFieldChange('showPassword', true)
                      }}
                      onUncheck={() => {
                        this.props.actions.onAuthFormFieldChange('showPassword', false)
                      }}
                      text=''
                  />
                </View>
              </View>
              <View style={{marginBottom: 15}}>
                <ItemCheckbox
                    size = {20}
                    icon_check= 'ios-checkmark-circle-outline'
                    icon_open= 'ios-radio-button-off'
                    text='Remember Me'
                />
              </View>
              
              <ButtonSuccess
                isDisabled={!this.props.auth.form.isValid || this.props.auth.form.isFetching}
                onPress={onButtonPress}
                buttonText="Login" />
                <Text style={{textAlign:'center'}}>{this.props.auth.form.currentStep}... </Text>
                
                <View style={{marginTop: 35}}>
                  <Text style={{textAlign:'center', color: '#d3d3d3', marginBottom: 10}}>
                    Use scanner to login
                  </Text>

                  <ButtonLinear
                    isDisabled={!this.props.auth.form.isValid || this.props.auth.form.isFetching}
                    onPress={onButtonPress}
                    buttonText="Scan" />
                </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
export default connect(null, mapDispatchToProps)(LoginRender)
