
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


class ArrayScreen extends Component {

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
                  <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>Inscan Packages</Text>  
                </View>
                <View style={[style.headerRight]}>
                </View>
                <View/>
              </View>
            </Body>
          </Header>

          <Content style={[styles.flex1, styles.bgWhite]}>
            {/*card 1*/}
            <View style={[style.card,styles.row, styles.bgWhite, styles.padding10]}>
                <View style={[styles.flexBasis90]}>
                  
                  <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10, styles.marginBottom10]}>
                    <View style={[style.listLeft, styles.justifyCenter, styles.alignStart, {height: 40}]}>
                      <Icon  name="md-qr-scanner" style={[styles.fontPrimary, styles.fontXxxl, styles.fontLeft]}/>
                    </View>
                    <View style={[ styles.justifySpaceBetween, styles.row, styles.marginLeft10, styles.flex1, {height: 40}]}>
                      <View style={[styles.paddingRight10, styles.justifyCenter]}>
                        <Text style={[styles.fontPrimary, styles.fontSm]}>
                          Inscan Packages
                        </Text>
                        <Text style={[styles.fontDarkGray, styles.fontSm]}>
                          Scan QR Code
                        </Text>
                      </View>
                      <View style={[styles.paddingRight10, styles.row, styles.justifyCenter, styles.alignCenter, {height: 40}]}>
                        <Text style={[styles.fontPrimary, styles.fontSm, styles.italic]}>
                          AWB13213123
                        </Text>
                        <Icon  name="ios-help-circle" style={[styles.fontDarkGray, styles.marginLeft5, styles.fontLg, styles.fontLeft]}/>
                      </View>
                    </View>
                  </View>
                  
                  <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10, styles.marginBottom10]}>
                    <View style={[style.listLeft, styles.justifyCenter, styles.alignStart, {height: 35}]}>
                      <Text style={[styles.fontSm]}>Length</Text>
                    </View>
                    <View style={[ styles.justifySpaceBetween, styles.marginLeft10, styles.flex1]}>
                      <View style={[styles.row, styles.paddingRight10, styles.justifySpaceBetween, styles.alignCenter]}>
                        <Item>
                            <Input style={[style.inputType]} />
                        </Item>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10, styles.marginBottom10]}>
                    <View style={[style.listLeft, styles.justifyCenter, styles.alignStart, {height: 35}]}>
                      <Text style={[styles.fontSm]}>Width</Text>
                    </View>
                    <View style={[ styles.justifySpaceBetween, styles.marginLeft10, styles.flex1]}>
                      <View style={[styles.row, styles.paddingRight10, styles.justifySpaceBetween, styles.alignCenter]}>
                        <Item>
                            <Input style={[style.inputType]} />
                        </Item>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10, styles.marginBottom10]}>
                    <View style={[style.listLeft, styles.justifyCenter, styles.alignStart, {height: 35}]}>
                      <Text style={[styles.fontSm]}>Height</Text>
                    </View>
                    <View style={[ styles.justifySpaceBetween, styles.marginLeft10, styles.flex1]}>
                      <View style={[styles.row, styles.paddingRight10, styles.justifySpaceBetween, styles.alignCenter]}>
                        <Item>
                            <Input style={[style.inputType]} />
                        </Item>
                      </View>
                    </View>
                  </View>

                </View>
                
                <View style={[styles.flexBasis10, styles.alignCenter, styles.justifyCenter]}>
                  <Icon  name="md-remove-circle" style={[styles.fontDanger, styles.fontXl, styles.fontLeft]}/>
                </View>
            </View>

            {/*card 1*/}
            <View style={[style.card,styles.row, styles.bgWhite, styles.padding10]}>
                <View style={[styles.flexBasis90]}>
                  
                  <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10, styles.marginBottom10]}>
                    <View style={[style.listLeft, styles.justifyCenter, styles.alignStart, {height: 40}]}>
                      <Icon  name="md-qr-scanner" style={[styles.fontPrimary, styles.fontXxxl, styles.fontLeft]}/>
                    </View>
                    <View style={[ styles.justifySpaceBetween, styles.row, styles.marginLeft10, styles.flex1, {height: 40}]}>
                      <View style={[styles.paddingRight10, styles.justifyCenter]}>
                        <Text style={[styles.fontPrimary, styles.fontSm]}>
                          Inscan Packages
                        </Text>
                        <Text style={[styles.fontDarkGray, styles.fontSm]}>
                          Scan QR Code
                        </Text>
                      </View>
                      <View style={[styles.paddingRight10, styles.row, styles.justifyCenter, styles.alignCenter, {height: 40}]}>
                        <Text style={[styles.fontPrimary, styles.fontSm, styles.italic]}>
                          AWB13213123
                        </Text>
                        <Icon  name="ios-help-circle" style={[styles.fontDarkGray, styles.marginLeft5, styles.fontLg, styles.fontLeft]}/>
                      </View>
                    </View>
                  </View>
                  
                  <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10, styles.marginBottom10]}>
                    <View style={[style.listLeft, styles.justifyCenter, styles.alignStart, {height: 35}]}>
                      <Text style={[styles.fontSm]}>Length</Text>
                    </View>
                    <View style={[ styles.justifySpaceBetween, styles.marginLeft10, styles.flex1]}>
                      <View style={[styles.row, styles.paddingRight10, styles.justifySpaceBetween, styles.alignCenter]}>
                        <Item>
                            <Input style={[style.inputType]} />
                        </Item>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10, styles.marginBottom10]}>
                    <View style={[style.listLeft, styles.justifyCenter, styles.alignStart, {height: 35}]}>
                      <Text style={[styles.fontSm]}>Width</Text>
                    </View>
                    <View style={[ styles.justifySpaceBetween, styles.marginLeft10, styles.flex1]}>
                      <View style={[styles.row, styles.paddingRight10, styles.justifySpaceBetween, styles.alignCenter]}>
                        <Item>
                            <Input style={[style.inputType]} />
                        </Item>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10, styles.marginBottom10]}>
                    <View style={[style.listLeft, styles.justifyCenter, styles.alignStart, {height: 35}]}>
                      <Text style={[styles.fontSm]}>Height</Text>
                    </View>
                    <View style={[ styles.justifySpaceBetween, styles.marginLeft10, styles.flex1]}>
                      <View style={[styles.row, styles.paddingRight10, styles.justifySpaceBetween, styles.alignCenter]}>
                        <Item>
                            <Input style={[style.inputType]} />
                        </Item>
                      </View>
                    </View>
                  </View>

                </View>
                
                <View style={[styles.flexBasis10, styles.alignCenter, styles.justifyCenter]}>
                  <Icon  name="md-remove-circle" style={[styles.fontDanger, styles.fontXl, styles.fontLeft]}/>
                </View>
            </View>
          </Content>

          <Footer
            style={[style.footer]}>
            <View style={[styles.justifySpaceBetween, styles.row, styles.alignCenter, styles.paddingBottom10]}>
              <Text
                style={[styles.fontSm, styles.fontBlack, styles.marginBottom10]}>Total Count : 9</Text>
              <Button bordered success small>
                <Text style={[styles.fontSuccess]}>Add</Text>
              </Button>
            </View>
            <Button  style={StyleSheet.flatten([styles.bgPrimary])} full>
              <Text style={[styles.fontLg, styles.fontWhite]}>Save</Text>
            </Button>
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
    flexDirection: 'column',
    height: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#f3f3f3',
    padding: 10
  },
  card : {
    borderBottomWidth: 10,
    borderBottomColor: '#f3f3f3'
  },
  inputType : {
    height: 35,
    fontSize: 14
  },
  listLeft: {
    width: 50
  }
  
});


export default connect(mapStateToProps, mapDispatchToProps)(ArrayScreen)
