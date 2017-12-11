'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import SearchIcon from '../../src/svg_components/icons/SearchIcon'

import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'

import {
  Container,
  Content,
  Header,
  Button,
  Text,
  Left,
  Body,
  Right,
  Icon,
  StyleProvider,
  List,
  ListItem,
  Item, 
  Input, 
  Label,
  Footer,
  FooterTab
} from 'native-base'

import * as profileActions from '../modules/profile/profileActions'
import * as globalActions from '../modules/global/globalActions'

function mapStateToProps(state) {
  return {

  }
};


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...globalActions, ...profileActions }, dispatch)
  }
}

class FormDetailsV2 extends Component {
  static navigationOptions = ({ navigation }) => {
    return { header: null }
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
                  <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                </TouchableOpacity>
                <View style={[style.headerBody]}>
                  <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>Form Layout</Text>
                </View>
                <View style={[style.headerRight]}>
                </View>
                <View />
              </View>
            </Body>
          </Header>

          <Content style={[styles.flex1, styles.bgLightGray]}>
            {/* card 1 */}
            <View style={[styles.bgWhite, styles.padding10]}>
              <View style={[styles.marginBottom15]}>
                <Item floatingLabel>
                  <Label style={[styles.fontPrimary]}>Username</Label>
                  <Input />
                </Item>
              </View>
              <View style={[styles.marginBottom15]}>
                <Item floatingLabel>
                  <Label style={[styles.fontPrimary]}>Username</Label>
                  <Input />
                </Item>
              </View>
              <View style={[style.dropDown]}>
                <Text>Reletionship with consignee</Text>
                <Icon  name="md-arrow-dropdown" style={[styles.fontBlack, styles.fontXl, styles.fontLeft]}/>
              </View>
            </View>

            {/*card 1*/}
            <View style={style.formCard}>
              <View style={style.iconContainer}>
                <SearchIcon width={30} height={30}/>
              </View>
              <View style={style.formCardDetail}>
                <View>
                  <Text style={[styles.fontDefault, styles.lineHeight25, styles.fontPrimary]}>
                    Search Merchant
                  </Text>
                  <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20]}>
                    Search Merchant name from database
                  </Text>
                 
                </View>
                <View style={[styles.row]}>
                  <View style={[styles.marginRight5]}>
                    <Icon name="ios-checkmark-circle" style={[styles.fontXl, styles.fontSuccess, styles.fontXxl]}/>
                  </View>
                  <View>
                    <Icon name="ios-help-circle" style={[styles.fontXl, styles.fontLightGray, styles.fontXxl]}/>
                  </View>
                </View>
              </View>
            </View>

            {/*card 2*/}
            <View style={style.formCard}>
              <View style={style.iconContainer}>
                <SearchIcon width={30} height={30}/>
              </View>
              <View style={style.formCardDetail}>
                <View>
                  <Text style={[styles.fontDefault, styles.lineHeight25, styles.fontPrimary]}>
                    Search Merchant
                  </Text>
                  <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20]}>
                    Search Merchant name from database
                  </Text>
                 
                </View>
                <View style={[styles.row]}>
                  <View style={[styles.marginRight5]}>
                    <Icon name="ios-checkmark-circle" style={[styles.fontXl, styles.fontSuccess, styles.fontXxl]}/>
                  </View>
                  <View>
                    <Icon name="ios-help-circle" style={[styles.fontXl, styles.fontLightGray, styles.fontXxl]}/>
                  </View>
                </View>
              </View>
            </View>

            {/*card 3*/}
            <View style={style.formCard}>
              <View style={style.iconContainer}>
                <SearchIcon width={30} height={30}/>
              </View>
              <View style={style.formCardDetail}>
                <View>
                  <Text style={[styles.fontDefault, styles.lineHeight25, styles.fontPrimary]}>
                    Search Merchant
                  </Text>
                  <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20]}>
                    Search Merchant name from database
                  </Text>
                 
                </View>
                <View style={[styles.row]}>
                  <View style={[styles.marginRight5]}>
                    <Icon name="ios-checkmark-circle" style={[styles.fontXl, styles.fontSuccess, styles.fontXxl]}/>
                  </View>
                  <View>
                    <Icon name="ios-help-circle" style={[styles.fontXl, styles.fontLightGray, styles.fontXxl]}/>
                  </View>
                </View>
              </View>
            </View>

            
            
          </Content>
          <Footer style={[style.footer]}>
            <FooterTab style={[styles.padding10]}>
              <Button success full onPress={this._onResetPress} disabled={this.props.isSaveResetButtonDisabled}>
                <Text style={[styles.fontLg, styles.fontWhite]}>Reset Password</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </StyleProvider>
    )
  }
}


const style = StyleSheet.create({
  //  styles.column, styles.paddingLeft0, styles.paddingRight0, {height: 'auto'}
  header: {
    borderBottomWidth: 0,
    height: 'auto',
    padding: 0,
    paddingRight: 0,
    paddingLeft: 0
  },
  headerLeft: {
    width: '15%',
    padding: 15
  },
  headerBody: {
    width: '70%',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerRight: {
    width: '15%',
    padding: 15
  },
  dropDown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1, 
    borderBottomColor: '#d3d3d3'
  },
  listIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'green',
    borderRadius: 3,
  },
  formCard: {
    minHeight: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: '#ffffff'
  },
  iconContainer: {
    width: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  formCardDetail: {
    flex: 1,
    minHeight: 70,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#d3d3d3',
    borderBottomWidth: 1
  },
  footer: {
    height: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#f3f3f3'
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(FormDetailsV2)