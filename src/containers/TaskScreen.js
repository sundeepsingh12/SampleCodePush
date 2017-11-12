
'use strict'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'


import Ionicons from 'react-native-vector-icons/Ionicons'
import Preloader from '../containers/Preloader'
import Loader from '../components/Loader'
import ResyncLoader from '../components/ResyncLoader'


import React, {Component} from 'react'
import {StyleSheet, View, TouchableOpacity} from 'react-native'

import {
  Container,
  Content,
  Header,
  Button,
  Text,
  Input,
  Body,
  Icon,
  Footer,
  Tab, 
  Tabs, 
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


class TaskScreen extends Component {

  static navigationOptions = ({navigation}) => {
    return {header: null}
  }

  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])} hasTabs>
            <Body>
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                  <Icon  name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]}/>
                </TouchableOpacity>
                <View style={[style.headerBody]}>
                  <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>Tasks</Text>  
                </View>
                <View style={[style.headerRight]}>
                </View>
                <View/>
              </View>
              
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.paddingLeft10, styles.paddingRight10]}>
                <View style={[styles.relative, {width: '85%', height: 30}]}>
                  <Input
                    placeholder="Filter Reference Numbers"
                    placeholderTextColor={'rgba(255,255,255,.6)'}
                    style={[style.headerSearch]}/>
                  <Button small transparent style={[style.inputInnerBtn]}>
                    <Icon name="md-search" style={[styles.fontWhite, styles.fontXl]}/>
                  </Button>
                </View>
                <View style={{width: '15%'}}>
                  <Icon name="md-qr-scanner" style={[styles.fontWhite, styles.fontXxl, styles.fontRight]} onPress={() => { this.props.navigation.goBack(null) }}/>
                </View>
              </View>

            </Body>
          </Header>
          <Tabs
                tabBarUnderlineStyle={[styles.bgWhite]}>
            <Tab 
            tabStyle={[styles.bgPrimary]}
            activeTabStyle={[styles.bgPrimary]}
            textStyle={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}
            activeTextStyle={[styles.fontWhite, styles.fontDefault]}
            heading="PENDING">
              <Content>
                <View style={style.seqCard}>
                  <View style={style.seqCircle}>
                    <Text style={[styles.fontWhite, styles.fontCenter, styles.fontLg]}>
                      PKUP
                    </Text>
                  </View>
                  <View style={style.seqCardDetail}>
                    <View>
                      <Text style={[styles.fontDefault, styles.fontWeight500, styles.lineHeight25]}>
                        REF32546245 / John Smith
                      </Text>
                      <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20]}>
                        Plot 345, Saket
                      </Text>
                      <Text
                        style={[styles.fontSm, styles.italic, styles.fontWeight300, styles.lineHeight20]}>
                        Express Delivery · Paid
                      </Text>
                    </View>
                    <View style={[styles.justifyStart, styles.row, styles.marginTop5]}>
                      <Button transparent>
                        <Icon name='md-call' style={[styles.fontBlack]}/>
                      </Button>
                      <Button transparent>
                        <Icon name='md-map' style={[styles.fontBlack]}/>
                      </Button>
                      <Button transparent>
                        <Icon name='md-help-buoy' style={[styles.fontBlack]}/>
                      </Button>
                    </View>
                  </View>
                </View>
              </Content>
            </Tab>
            <Tab 
            tabStyle={[styles.bgPrimary]}
            activeTabStyle={[styles.bgPrimary]}
            textStyle={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}
            activeTextStyle={[styles.fontWhite, styles.fontDefault]}
            heading="SUCCESS">
              <Content>
                <View style={style.seqCard}>
                  <Text>
                    PKUP
                  </Text>
                </View>
              </Content>
            </Tab>
            <Tab 
            tabStyle={[styles.bgPrimary]}
            activeTabStyle={[styles.bgPrimary]}
            textStyle={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}
            activeTextStyle={[styles.fontWhite, styles.fontDefault]}
            heading="FAILED">
              <Content>
                <View style={style.seqCard}>
                  <Text>
                    PKUP
                  </Text>
                </View>
              </Content>
            </Tab>
          </Tabs>
          
        
         
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
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerBody : {
    width: '70%', 
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerRight : {
    width: '15%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerIcon: {
    width: 24
  },
  headerSearch: {
    paddingLeft: 10,
    paddingRight: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    borderRadius: 2,
    height: 55,
    color: '#fff',
    fontSize: 11
  },
  inputInnerBtn: {
    position: 'absolute',
    top: 0,
    right: 5,
    paddingLeft: 0,
    paddingRight: 0
  },
  seqCard: {
    minHeight: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10
  },
  seqCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffcc00',
    justifyContent: 'center',
    alignItems: 'center'
  },
  seqCardDetail: {
    flex: 1,
    minHeight: 70,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 15,
    borderBottomColor: '#e4e4e4',
    borderBottomWidth: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(TaskScreen)
