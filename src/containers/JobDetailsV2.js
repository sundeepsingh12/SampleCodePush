'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { StyleSheet, View, Image, TouchableHighlight } from 'react-native'
import Loader from '../components/Loader'
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
} from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import * as homeActions from '../modules/home/homeActions'
import * as globalActions from '../modules/global/globalActions'
import FareyeLogo from '../../images/fareye-default-iconset/fareyeLogoSm.png'
import {
  BULK,
  LIVE,
  PIECHART,
  SEQUENCE,
  START,
} from '../lib/AttributeConstants'

import {
  Home
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


class JobDetailsV2 extends Component {

  static navigationOptions = ({ navigation }) => {
    return { header: null }
  }

  componentDidMount() {
    this.props.actions.fetchModulesList()
  }

  navigateToScene = (moduleName) => {
    console.log(moduleName)
    switch (moduleName) {
      case BULK: {
        break
      }
      case LIVE: {
        break
      }
      case SEQUENCE: {
        break
      }
      case START: {
        this.props.actions.navigateToScene(Home)
        break
      }
    }
  }

  headerView() {
    return (
      <Header
        style={StyleSheet.flatten([
          styles.bgWhite, styles.bgPrimary, {
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
        colors={['#262da0', '#205dbe', '#2c83c9']}
        style={style.chartBlock}>
        <View style={style.chartContainer} >
          <Text style={[style.chartCenterData, style.pieNumber]}>
            1000
        </Text>
          <Text style={[style.chartCenterData, style.pieText]}>
            pending
        </Text>
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
          <Image
            style={[style.moduleListIcon]}
            source={modulesList[index].icon} />
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
    const moduleView = this.moduleView([START, LIVE, BULK, SEQUENCE])
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
          <Footer>
            <FooterTab>
              <Button active>
                <Icon name="ios-home" />
                <Text>Home</Text>
              </Button>
              <Button>
                <Icon name="ios-sync" />
                <Text>Sync</Text>
              </Button>
              <Button>
                <Icon name="ios-menu" />
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


export default connect(mapStateToProps, mapDispatchToProps)(JobDetailsV2)
