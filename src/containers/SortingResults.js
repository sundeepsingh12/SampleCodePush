
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
  List,
  ListItem,
  Left,
  Body,
  Right,
  Icon,
  Footer,
  CheckBox,
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


class SortingResults extends Component {

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
                  <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>Sorting</Text>  
                </View>
                <View style={[style.headerRight]}>
                </View>
                <View/>
              </View>

              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.paddingLeft10, styles.paddingRight10, styles.paddingBottom10]}>
                <View style={[styles.relative, {width: '85%', height: 30}]}>
                  <Input
                    placeholder="Filter Reference Numbers"
                    placeholderTextColor={'rgba(255,255,255,.4)'}
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
          
          <Content style={[styles.flex1, styles.bgLightGray]}>
            {/*card 1*/}
            <View style={[styles.bgWhite]}>
              <View style={[style.card, styles.row, styles.paddingTop15, styles.paddingBottom10]}>
              <Text>
                Search Result:
              </Text>
            </View>
            <View style={style.resultCard}>
                <View style={style.qrBox}>
                  <Text style={[styles.fontWhite, styles.fontCenter, styles.fontLg]}>
                    PKUP
                  </Text>
                </View>
                <View style={style.resultCardDetail}>
                  <View style={{borderBottomWidth: 1, borderBottomColor:'#f3f3f3', marginBottom: 10, paddingBottom: 10}}>
                    <Text style={[styles.fontDefault]}>
                      DemoSA1234
                    </Text>
                  </View>
                  <View style={[styles.marginBottom5]}>
                    <Text style={[styles.fontXs, styles.fontDarkGray , styles.fontWeight300, styles.lineHeight20]}>
                      Name
                    </Text>
                    <Text
                      style={[styles.fontDefault, styles.fontWeight300, styles.lineHeight20]}>
                      Aman Kumar
                    </Text>
                  </View>
                  <View style={[styles.marginBottom5]}>
                    <Text style={[styles.fontXs, styles.fontDarkGray , styles.fontWeight300, styles.lineHeight20]}>
                      Delivery Address
                    </Text>
                    <Text
                      style={[styles.fontDefault, styles.fontWeight300, styles.lineHeight20]}>
                      28 Wilkinson Summit Suite 865
                    </Text>
                  </View>
                  <View style={[styles.marginBottom5]}>
                    <Text style={[styles.fontXs, styles.fontDarkGray, styles.fontWeight300, styles.lineHeight20]}>
                      Sequence Number
                    </Text>
                    <Text
                      style={[styles.fontDefault, styles.fontWeight300, styles.lineHeight20]}>
                      1/32
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Content>
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
    backgroundColor: '#1260be',
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
  card: {
    paddingLeft: 10,
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowColor: '#d3d3d3',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  resultCard: {
    minHeight: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingLeft: 10,
    backgroundColor: '#fff'
  },
  qrBox: {
    width: 60,
    height: 60,
    backgroundColor: '#ffcc00',
    justifyContent: 'center',
    alignItems: 'center'
  },
  resultCardDetail: {
    flex: 1,
    minHeight: 70,
    paddingBottom: 10,
    marginLeft: 15,
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(SortingResults)
