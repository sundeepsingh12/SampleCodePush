'use strict'
import React, {Component} from 'react'
import
{
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableHighlight,
  Image
}
from 'react-native'

import { Container, Body, InputGroup, Button, Input, Item, ListItem, CheckBox} from 'native-base';

import feTheme from '../Themes/feTheme';


// var ItemCheckbox = require('react-native-item-checkbox');
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
class Login2 extends Component {

  render () {
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
                    <Input placeholder='Regular Textbox' style={feTheme.roundedInput}/>
                </Item>
                <Item style={{borderWidth: 0, marginTop: 15}}>
                    <Input placeholder='Regular Textbox' style={feTheme.roundedInput}/>
                      <View style={{position: 'absolute', bottom: 7, right: 10}}>
                        <ItemCheckbox
                            size = {28}
                            icon_check= 'ios-eye-off-outline'
                            icon_open= 'ios-eye-outline'
                            text=''
                        />
                      </View>
                </Item>
                
                <Button rounded success style={{width: '100%', marginTop: 15}}>
                    <Text style={{textAlign: 'center', width: '100%', color: 'white'}}>Log In</Text>
                </Button>

                <View style={{flexDirection: 'row', flexGrow: 1, justifyContent: 'flex-start', marginTop: 15}}>
                    <CheckBox checked={true} />
                    <Text style={{marginLeft: 20}}>Remember Me</Text>
                </View>
                  
                <View style={{marginTop: 35}}>
                  <Text style={{textAlign:'center', color: '#d3d3d3', marginBottom: 10}}>
                    Use scanner to login
                  </Text>
                  <Button rounded style={{width: '100%', }}>
                    <Text style={{textAlign: 'center', width: '100%', color: 'white'}}>Scan</Text>
                </Button>
                </View>
              </View>
            </View>
      </Container>
    )
  }
};

export default Login2
