'use strict'
import React, {Component} from 'react'
import
{
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableHighlight,
  Image,
  Switch
}
from 'react-native'

import { Container, Body, InputGroup, Button, Input, Item, ListItem, CheckBox} from 'native-base';

import feTheme from '../Themes/feTheme';
import sha256 from 'sha256';
import {Actions} from 'react-native-router-flux';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as authActions from '../reducers/login/loginActions'

import ItemCheckbox from '../components/ItemCheckbox'
var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  width70 : {
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
    marginTop: 70,
    flexBasis: '20%',
    justifyContent: 'flex-start',
  },
  
  logoStyle: {
    width: 94,
    resizeMode: 'contain'
  },
 
})


function mapStateToProps (state) {
    return {
        auth: state.auth,
        global: state.global
    }
}

function mapDispatchToProps (dispatch) {
    return {
        actions: bindActionCreators(authActions, dispatch)
    }
}
class Login2 extends Component {

  constructor(){
    super();
      this.state = {
          username:'',
          password:''
      }
  }

  render () {
      const isEnabled = this.isFormValid()
      console.log(isEnabled)
    return (
      <Container>
        <View style={styles.container}>
              <View style={styles.logoContainer}>
                <Image
                  style={styles.logoStyle}
                  source={require('../../images/fareye-logo.png')}
                />
              </View>
              <View style={styles.width70}>
                <Item style={{borderWidth: 0}}>
                    <Input
                        value = {this.state.username}
                        placeholder='Username'
                        style={feTheme.roundedInput}
                        onChangeText = {value=>this.onChangeUsername(value)}/>
                </Item>
                <Item style={{borderWidth: 0, marginTop: 15}}>
                    <Input
                        value = {this.state.password}
                        placeholder='Password'
                        style={feTheme.roundedInput}
                        onChangeText = {value=>this.onChangePassword(value)}
                    />
                      <View style={{position: 'absolute', bottom: 7, right: 10}}>
                        <ItemCheckbox
                            size = {28}
                            icon_check= 'ios-eye-off-outline'
                            icon_open= 'ios-eye-outline'
                            text=''

                        />
                      </View>
                </Item>
                
                <Button disabled={!isEnabled} onPress={this.login.bind(this, this.props.actions.login)} rounded success style={{width: '100%', marginTop: 15}}>
                    <Text style={{textAlign: 'center', width: '100%', color: 'white'}}>Log In</Text>
                </Button>

                <View style={{flexDirection: 'row', flexGrow: 1, justifyContent: 'flex-start', marginTop: 15}}>
                    <CheckBox checked={true} />
                    <Text style={{marginLeft: 20}}>Remember Me</Text>
                </View>
                  
                <View style={{marginTop: 35}}>
                  <Text style={{textAlign:'center', color: '#d3d3d3', marginBottom: 10}}>
                   ...
                  </Text>
                  <Button onPress={this.scanLogin.bind(this)} rounded style={{width: '100%', }}>
                    <Text style={{textAlign: 'center', width: '100%', color: 'white'}}>Scanner</Text>
                </Button>
                </View>
              </View>
            </View>
      </Container>
    )
  }
    onChangeUsername(username){
        this.setState({
            username

        })
    }

    onChangePassword(password){
        this.setState({
            password
        })
    }

    login(login){
        login(login,this.state.username, sha256(this.state.password))
    }

    scanLogin(){
        Actions.Scanner();
    }

    isFormValid(){
        const {username, password } = this.state;
        return (
            username.length > 0 &&
            password.length > 0
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login2)