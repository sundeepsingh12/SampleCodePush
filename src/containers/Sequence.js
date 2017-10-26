/**
 * # Main.js
 *  This is the main app screen
 *
 */
'use strict'
/*
 * ## Imports
 *
 * Imports from redux
 */
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

/**
 * The actions we need
 */
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Preloader from '../containers/Preloader'
import Loader from '../components/Loader'
import ResyncLoader from '../components/ResyncLoader'

/**
 * The components needed from React
 */
import React, {Component} from 'react'
import {StyleSheet, View, Image, TouchableHighlight} from 'react-native'

import {
  Container,
  Content,
  Header,
  Button,
  Text,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Icon,
  Title,
  Footer,
  FooterTab,
  StyleProvider
} from 'native-base';

import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import * as homeActions from '../modules/home/homeActions'
import * as globalActions from '../modules/global/globalActions'
import renderIf from '../lib/renderIf';
import TitleHeader from '../components/TitleHeader'
import SortableListView from 'react-native-sortable-listview'

let data = {
  hello: {
    text: 'REF32546245 / Test 1 REF32'
  },
  how: {
    text: 'REF32546245 / Test 2'
  },
  test: {
    text: 'REF32546245 / Test 3'
  },
  this: {
    text: 'REF32546245 / Test 4'
  }
}

let order = Object.keys(data) //Array of keys

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

class RowComponent extends React.Component {
  render() {
    return (
      <TouchableHighlight underlayColor={'#eee'} {...this.props.sortHandlers}>
        <View style={style.seqCard}>
          <View style={style.seqCircle}>
            <Text style={[styles.fontWhite, styles.fontCenter, styles.fontLg]}>
              PKUP
            </Text>
          </View>
          <View style={style.seqCardDetail}>
            <View>
              <Text style={[styles.fontDefault, styles.fontWeight500, styles.lineHeight25]}>
                {this.props.data.text}
              </Text>
              <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20]}>
                Plot 345, Saket
              </Text>
              <Text
                style={[styles.fontSm, styles.italic, styles.fontWeight300, styles.lineHeight20]}>
                Express Delivery · Paid
              </Text>
            </View>
            <View
              style={{
              width: 30,
              alignSelf: 'center'
            }}>
              <Icon
                name="ios-menu"
                style={[
                styles.fontXl, {
                  color: '#c9c9c9'
                }
              ]}/>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

/**
 * ## App class
 */
class Sequence extends Component {

  // constructor(props) {   super(props)   this.state = {     isMoving: false,
  // pointsDelta: 0,     points: 67   } }

  static navigationOptions = ({navigation}) => {
    return {header: null}
  }

  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          <Header
            style={StyleSheet.flatten([
            styles.bgPrimary, {
              borderBottomWidth: 0
            }
          ])}>
            <Left>
              <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]}  onPress={() => { this.props.navigation.goBack(null) }}/>
            </Left>
            <Body>
              <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>Sequence</Text>
            </Body>
            <Right/>
          </Header>
          <View style={[styles.flex1]}>

            <SortableListView
              style={{
              flex: 1
            }}
              data={data}
              order={order}
              onRowMoved={e => {
              order.splice(e.to, 0, order.splice(e.from, 1)[0]) 
              this.forceUpdate()
            }}
              activeOpacity={1}
              sortRowStyle={{
              backgroundColor: '#f2f2f2'
            }}
              renderRow={row => <RowComponent data={row}/>}/>
          </View>
          <Footer style={{
            height: 'auto'
          }}>
            <FooterTab style={StyleSheet.flatten([styles.padding10])}>
              <Button success full>
                <Text style={[styles.fontLg, styles.fontWhite]}>Update Sequence</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </StyleProvider>

    )
  }

};

const style = StyleSheet.create({
  headerIcon: {
    fontSize: 18
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
    flexDirection: 'row',
    justifyContent: 'space-between'
  }

});

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(Sequence)
