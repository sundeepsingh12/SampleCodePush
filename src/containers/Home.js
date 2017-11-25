'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { StyleSheet, View, Image, TouchableHighlight } from 'react-native'
import Loader from '../components/Loader'
import HomeFooter from './HomeFooter'
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
  StyleProvider,
  Toast
} from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import * as homeActions from '../modules/home/homeActions'
import * as globalActions from '../modules/global/globalActions'
import FareyeLogo from '../../images/fareye-default-iconset/fareyeLogoSm.png'
import CircularProgress from '../svg_components/components/CircularProgress'
import {
  BULK,
  LIVE,
  PIECHART,
  SEQUENCEMODULE,
  START,
  SORTING
} from '../lib/AttributeConstants'

import {
  TabScreen,
  Sequence,
  BulkConfiguration,
  Sorting
} from '../lib/constants'

function mapStateToProps(state) {
  return {
    loading: state.home.loading
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...homeActions, ...globalActions }, dispatch)
  }
}

const percentage = 95;


class Home extends Component {

  componentDidMount() {
    this.props.actions.fetchModulesList()
  }

  navigateToScene = (moduleName) => {
    console.log('modulename',moduleName)
    switch (moduleName) {
      case BULK: {
        this.props.actions.navigateToScene(BulkConfiguration)
        break
      }
      case LIVE: {
          Toast.show({
              text: `Under development!Coming Soon`,
              position: 'bottom',
              buttonText: 'OK'
            })
        break
      }
      case SEQUENCEMODULE: { 
        this.props.actions.navigateToScene(Sequence)
        break
      }
      case START: {
        this.props.actions.navigateToScene(TabScreen)
        break
      }

      case SORTING: {
        this.props.actions.navigateToScene(Sorting)
        break
      }
    }
  }

  headerView() {
    return (
      <Header
        hasTabs
        style={[styles.bgPrimary]}>
        <Left style={{
          width: 90
        }}>
          <Image
            style={StyleSheet.flatten([
              styles.width100, {
                resizeMode: 'contain'
              }
            ])}
            source={FareyeLogo} />
        </Left>
        <Right>
          <Button transparent>
            <Icon style={style.headerIcon} name='ios-search' />
          </Button>
          <Button transparent>
            <Icon style={style.headerIcon} name='ios-chatbubbles' />
          </Button>
          <Button transparent>
            <Icon style={style.headerIcon} name='md-notifications' />
          </Button>
        </Right>
      </Header>
    )
  }

  pieChartView() {
    if (!PIECHART.enabled) {
      return null
    }
    return (
      <LinearGradient
        colors={[styles.bgPrimary.backgroundColor, styles.shadeColor]}
        style={style.chartBlock}>
        <View style={[styles.justifyCenter, styles.paddingTop15, styles.paddingBottom15]}>
          <CircularProgress percentage={percentage} style={[{backgroundColor: '#green'}]}>
              <View style={[styles.justifyCenter, styles.alignCenter]}>
                <Text style={{fontSize: 40, color: '#ffffff', fontWeight: '500'}}>{percentage}</Text>
                <Text style={{fontSize: 18, color: '#ffffff'}}>pending</Text>
              </View>
          </CircularProgress>
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
    )
  }

  moduleView(modulesList) {
    let moduleView = []
    for (let index in modulesList) {
      
      if (!modulesList[index].enabled) {
        continue
      }
      moduleView.push(
        <ListItem button onPress={() => this.navigateToScene(modulesList[index])}
          style={[style.moduleList]}
          key={modulesList[index].appModuleId}
        >
          {modulesList[index].icon}
          <Body>
            <Text
              style={[styles.fontWeight500, styles.fontLg]}>{modulesList[index].displayName}</Text>
          </Body>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </ListItem>
      )
    }
    return moduleView
  }

  render() {
    const headerView = this.headerView()
    const pieChartView = this.pieChartView()
    const moduleView = this.moduleView([START, LIVE, BULK, SEQUENCEMODULE,SORTING])
    if (this.props.loading) {
      return (<Loader />)
    }
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container style={StyleSheet.flatten([styles.bgWhite])}>
          {headerView}
          <Content>
            {pieChartView}
            <List>
              {moduleView}
            </List>
          </Content>
        </Container>
      </StyleProvider>

    )
  }

}

const style = StyleSheet.create({
  chartCenterData: {
    backgroundColor: 'transparent',
    textAlign: 'center',

  },
  headerIcon: {
    fontSize: 18,
    color: '#ffffff'
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


export default connect(mapStateToProps, mapDispatchToProps)(Home)
