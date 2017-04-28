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
  NetInfo

}
from 'react-native'

import { Container, Body, InputGroup, Button, Input, Item, ListItem, CheckBox} from 'native-base';

import feTheme from '../Themes/feTheme';
import sha256 from 'sha256';
import {Actions} from 'react-native-router-flux';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as authActions from '../modules/login/loginActions'
import * as globalActions from '../modules/global/globalActions'

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
  }
 
})


function mapStateToProps (state) {
    return {
        auth: state.auth,
        global: state.global,
    }
}

function mapDispatchToProps (dispatch) {
    return {
        actions: bindActionCreators({ ...authActions, ...globalActions }, dispatch)
    }
}


class Login2 extends Component {

 constructor(props) {
    super(props);
  }

  onChangeUsername(username) {
        console.log("onChangeUsername called")
        console.log(username)
        this.props.actions.onChangeUsername(username)
    }

    onChangePassword(password) {
        this.props.actions.onChangePassword(password)
    }

    login(login) {
        login(login,this.props.global.username, sha256(this.props.global.password))
    }

    scanLogin() {
        Actions.Scanner();
    }

    componentDidMount(){
        if(this.props.global.startLogin){
            login(login,this.props.global.username, sha256(this.props.global.password))
        }
    }

  render () {
      // const isEnabled = this.isFormValid()
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
                        value = {this.props.global.username}
                        placeholder = 'Username'
                        style= {feTheme.roundedInput}
                        onChangeText = {(value) => {this.onChangeUsername(value)}}/>
                </Item>
                <Item style={{borderWidth: 0, marginTop: 15}}>
                    <Input
                        value = {this.props.global.password}
                        placeholder='Password'
                        style={feTheme.roundedInput}
                        secureTextEntry={true}
                        onChangeText = {(value) => {this.onChangePassword(value)}}
                        
                    />
                </Item>
                
                <Button
                 disabled = {this.props.auth.form.isLoginButtonDisabled} 
                 onPress={this.login.bind(this, this.props.actions.login)} rounded success style={{width: '100%', marginTop: 15}}>
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

    // isFormValid(){
    //     const {username, password } = this.state;
    //     return (
    //         username.length > 0 &&
    //         password.length > 0
    //     );
    // }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login2)