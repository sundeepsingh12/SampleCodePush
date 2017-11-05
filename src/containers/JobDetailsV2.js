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
import {StyleSheet, View, Image, TouchableHighlight, PanResponder} from 'react-native'

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
import LinearGradient from 'react-native-linear-gradient';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import * as homeActions from '../modules/home/homeActions'
import * as globalActions from '../modules/global/globalActions'
import renderIf from '../lib/renderIf';
import TitleHeader from '../components/TitleHeader'

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
const MAX_POINTS = 200;

/**
 * ## App class
 */
class JobDetailsV2 extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isMoving: false,
      pointsDelta: 0,
      points: 67
    }
  }

  static navigationOptions = ({navigation}) => {
    return {header: null}
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        this.setState({isMoving: true, pointsDelta: 0});
      },

      onPanResponderMove: (evt, gestureState) => {
        // For each 2 pixels add or subtract 1 point
        this.setState({
          pointsDelta: Math.round(-gestureState.dy / 2)
        });
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        let points = this.state.points + this.state.pointsDelta;
        console.log(Math.min(points, MAX_POINTS));
        this.setState({
          isMoving: false,
          points: points > 0
            ? Math.min(points, MAX_POINTS)
            : 0,
          pointsDelta: 0
        });
      }
    });
  }

  render() {
    const fill = this.state.points / MAX_POINTS * 100;
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          <Header
            style={StyleSheet.flatten([
            styles.bgWhite, {
              borderBottomColor: '#F2F2F2'
            }
          ])}>
            <Left style={{
              width: 90
            }}>
              <Image
                style={StyleSheet.flatten([
                styles.width100, {
                  resizeMode: 'contain'
                }
              ])}
                source={require('../../images/fareye-default-iconset/fareyeLogoSm.png')}/>
            </Left>
            <Body></Body>
            <Right>
              <Button transparent>
                <Icon style={style.headerIcon} name='ios-search'/>
              </Button>
              <Button transparent>
                <Icon style={style.headerIcon} name='ios-chatbubbles'/>
              </Button>
              <Button transparent>
                <Icon style={style.headerIcon} name='md-notifications'/>
              </Button>
            </Right>
          </Header>
          <Content>
            <LinearGradient
              colors={['#262da0', '#205dbe', '#2c83c9']}
              style={style.chartBlock}>
              <View style={style.chartContainer} {...this._panResponder.panHandlers}>
              </View>
              <View style={[styles.row, styles.justifySpaceAround]}>
                <View>
                  <Text
                    style={[styles.fontWhite, styles.fontXl, styles.bold, styles.fontCenter]}>200</Text>
                  <Text
                    style={[styles.fontWhite, styles.fontSm, styles.fontCenter]}>total</Text>
                </View>
                <View>
                  <Text
                    style={[styles.fontWhite, styles.fontXl, styles.bold, styles.fontCenter]}>165</Text>
                  <Text
                    style={[styles.fontWhite, styles.fontSm, styles.fontCenter]}>done</Text>
                </View>
              </View>
            </LinearGradient>

            <List>
              <ListItem
                style={[style.moduleList]}>
                <Image
                  style={[style.moduleListIcon]}
                  source={require('../../images/fareye-default-iconset/homescreen/tasks.png')}/>
                <Body>
                  <Text
                    style={[styles.fontWeight500, styles.fontLg]}>All Tasks</Text>
                </Body>
                <Right>
                  <Icon name="arrow-forward"/>
                </Right>
              </ListItem>
              <ListItem
                style={[style.moduleList]}>
                <Image
                  style={[style.moduleListIcon]}
                  source={require('../../images/fareye-default-iconset/homescreen/live.png')}/>
                <Body>
                  <Text
                    style={[styles.fontWeight500, styles.fontLg]}>Live</Text>
                </Body>
                <Right>
                  <Icon name="arrow-forward"/>
                </Right>
              </ListItem>
              <ListItem
                style={[style.moduleList]}>
                <Image
                  style={[style.moduleListIcon]}
                  source={require('../../images/fareye-default-iconset/homescreen/bulk.png')}/>
                <Body>
                  <Text
                    style={[styles.fontWeight500, styles.fontLg]}>Bulk Update</Text>
                </Body>
                <Right>
                  <Icon name="arrow-forward"/>
                </Right>
              </ListItem>
              <ListItem
                style={[style.moduleList]}>
                <Image
                  style={[style.moduleListIcon]}
                  source={require('../../images/fareye-default-iconset/homescreen/sequence.png')}/>
                <Body>
                  <Text
                    style={[styles.fontWeight500, styles.fontLg]}>Sequence</Text>
                </Body>
                <Right>
                  <Icon name="arrow-forward"/>
                </Right>
              </ListItem>
            </List>
          </Content>
          <Footer>
            <FooterTab>
              <Button active>
                <Icon name="ios-home"/>
                <Text>Home</Text>
              </Button>
              <Button>
                <Icon name="ios-sync"/>
                <Text>Sync</Text>
              </Button>
              <Button>
                <Icon name="ios-menu"/>
                <Text>Menu</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </StyleProvider>

    )
  }

};

const style = StyleSheet.create({
  chartCenterData: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: '#ffffff'

  },
  headerIcon: {
    fontSize: 18
  },
  pieData: {
    position: 'absolute',
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pieNumber: {
    fontSize: 40,
    fontWeight: "bold"
  },
  pieText: {
    fontSize: 16
  },
  chartContainer: {
    height: 190,
    paddingTop: 25,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chartBlock: {
    margin: 10,
    height: 240,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.3,
    shadowRadius: 2
  },
  moduleList: {
    height: 90,
    borderBottomColor: '#F2F2F2'
  },
  moduleListIcon: {
    width: 30,
    height: 30,
    marginRight: 15
  }
});

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(JobDetailsV2)
