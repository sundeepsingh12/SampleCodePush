
'use strict'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'


import Ionicons from 'react-native-vector-icons/Ionicons'
import Preloader from '../containers/Preloader'
import Loader from '../components/Loader'
import ResyncLoader from '../components/ResyncLoader'


import React, {Component} from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'

import {
  Container,
  Content,
  Header,
  Button,
  Left,
  Body,
  Right,
  Icon,
  Form, 
  Item, 
  Input, 
  Label,
  Footer,
  FooterTab,
  StyleProvider
} from 'native-base';

import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import * as homeActions from '../modules/home/homeActions'
import * as globalActions from '../modules/global/globalActions'

function mapStateToProps(state) {
  return {}
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...globalActions,
      ...homeActions
    }, dispatch)
  }
}


class ResetPassword extends Component {

  static navigationOptions = ({navigation}) => {
    return {header: null}
  }


  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>

          <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
            <Body>
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                  <Icon  name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]}/>
                </TouchableOpacity>
                <View style={[style.headerBody]}>
                  <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>Resets Password</Text>  
                </View>
                <View style={[style.headerRight]}>
                </View>
                <View/>
              </View>
            </Body>
          </Header>

          <Content style={[styles.flex1, styles.bgWhite]}>
            {/*card 1*/}
            <View style={[styles.bgWhite, styles.padding10, styles.marginTop30]}>
                <Item stackedLabel style={[styles.marginBottom15]}>
                    <Label style={[styles.fontPrimary, styles.fontSm]}>Current Password</Label>
                    <Input style={[style.inputType]} />
                </Item>
                <Item stackedLabel style={[styles.marginBottom15]}>
                    <Label style={[styles.fontPrimary, styles.fontSm]}>New Password</Label>
                    <Label style={[styles.fontDarkGray, styles.fontXs]}>Minimum 8 characters, including a symbol and a number.</Label>
                    <Input style={[style.inputType]} />
                </Item>
                <Item stackedLabel style={[styles.marginBottom15]}>
                    <Label style={[styles.fontPrimary, styles.fontSm]}>Confirm New Password</Label>
                    <Input style={[style.inputType]} />
                </Item>
            </View>

          </Content>
          <Footer style={[style.footer]}>
            <FooterTab style={[styles.padding10]}>
              <Button success full>
                <Text style={[styles.fontLg, styles.fontWhite]}>Reset Password</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </StyleProvider>
      )
  }

};

const style = StyleSheet.create({
  header: {
    borderBottomWidth: 0,
    height: 'auto',
    padding: 0,
    paddingRight: 0, 
    paddingLeft: 0
  },
  headerLeft : {
    width: '15%', 
    padding: 15
  },
  headerBody : {
    width: '70%', 
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerRight : {
    width: '15%',
    padding: 15
  },
  footer: {
    height: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#f3f3f3'
  },
  inputType : {
    height: 30,
    fontSize: 14
  }
  
});


export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
