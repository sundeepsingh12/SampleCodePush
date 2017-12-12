'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { StyleSheet, View, Image, TouchableHighlight, ActivityIndicator } from 'react-native'
import Loader from '../components/Loader'
import HomeFooter from './HomeFooter'
import renderIf from '../lib/renderIf.js'
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
  Toast,
  ActionSheet
} from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import * as homeActions from '../modules/home/homeActions'
import * as globalActions from '../modules/global/globalActions'
import FareyeLogo from '../../images/fareye-default-iconset/fareyeLogoSm.png'
import CircularProgress from '../svg_components/components/CircularProgress'
import PieChart from '../components/PieChart'
import {
  BULK_ID,
  LIVE_ID,
  START_ID,
  SEQUENCEMODULE_ID,
  SORTING_ID,
  CUSTOMAPP_ID,
  CHOOSE_WEB_URL,
  NEWJOB_ID,
} from '../lib/AttributeConstants'

import {
  PIECHART,
  SUMMARY,
} from '../lib/constants'

import {
  TabScreen,
  Sequence,
  BulkConfiguration,
  Sorting,
  LiveJobs,
  Summary,
  CustomApp,
  NewJob
} from '../lib/constants'
import _ from 'lodash'

function mapStateToProps(state) {
  return {
    modules: state.home.modules,
    pieChart: state.home.pieChart,
    menu: state.home.menu,
    moduleLoading: state.home.moduleLoading,
    chartLoading: state.home.chartLoading,
    count: state.home.count,
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
    this.props.actions.fetchModulesList(this.props.modules, this.props.pieChart, this.props.menu)
  }

  navigateToScene = (appModule) => {
    switch (appModule.appModuleId) {
      case BULK_ID: {
        this.props.actions.navigateToScene(BulkConfiguration)
        break
      }
      case LIVE_ID: {
        this.props.actions.navigateToScene(LiveJobs)
        break
      }
      case SEQUENCEMODULE_ID: {
        this.props.actions.navigateToScene(Sequence)
        break
      }
      case START_ID: {
        this.props.actions.navigateToScene(TabScreen, {
          appModule
        })
        break
      }

      case SORTING_ID: {
        this.props.actions.navigateToScene(Sorting)
        break
      }

      case CUSTOMAPP_ID: {
        ((appModule.remark) && appModule.remark.length > 1) ? this.customAppSelection(appModule) : ((appModule.remark) && appModule.remark.length == 1)
          ? this.props.actions.navigateToScene(CustomApp, {
            customUrl: appModule.remark[0].customUrl,
            appModule
          }) :
          this.props.actions.navigateToScene(CustomApp, {
            appModule
          });
        break
      }

      default:
        (appModule.appModuleId == NEWJOB_ID) ? this.props.actions.navigateToScene(NewJob, {
          jobMasterIdList: appModule.jobMasterIdList
        }) : null

    }
  }
  customAppSelection(appModule) {
    let BUTTONS = appModule.remark.map(id => !(id.title) ? URL : id.title)
    BUTTONS.push('Cancel')
    ActionSheet.show(
      {
        options: BUTTONS,
        title: CHOOSE_WEB_URL,
        cancelButtonIndex: BUTTONS.length - 1,
        destructiveButtonIndex: BUTTONS.length - 1
      },
      buttonIndex => {
        (buttonIndex > -1 && buttonIndex < (BUTTONS.length - 1)) ? this.props.actions.navigateToScene(CustomApp, appModule.remark[buttonIndex].customUrl) : null
      }
    )
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
          {/* <Button transparent>
            <Icon style={style.headerIcon} name='ios-chatbubbles' />
          </Button> */}
          {/* <Button transparent>
            <Icon style={style.headerIcon} name='md-notifications' />
          </Button> */}
        </Right>
      </Header>
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
          key={modulesList[index].serialNumber}
        >
          {modulesList[index].icon}
          <Body>
            <Text
              style={[styles.fontWeight500, styles.fontLg]}>{modulesList[index].displayName}</Text>
          </Body>
          <Right>
            <Icon name="ios-arrow-forward" />
          </Right>
        </ListItem>
      )
    }
    return moduleView
  }

  _onPieChartPress = () => {
    if(this.props.pieChart[SUMMARY].enabled){
      this.props.actions.navigateToScene(Summary)
    }
  }

  pieChartView() {
    if (!this.props.pieChart[PIECHART].enabled) {
      return null
    }

    if (this.props.chartLoading) {
      return (
        <ActivityIndicator animating={this.props.chartLoading}
          style={StyleSheet.flatten([{ marginTop: 10 }])} size="small" color="green" />
      )
    }

    console.log('this.props.count', this.props.count)
    if (this.props.count) {
      return (<PieChart count={this.props.count} press={this._onPieChartPress} />)
    }

    return null
  }

  render() {
    const headerView = this.headerView()
    const moduleView = this.moduleView(_.values(this.props.modules))
    const pieChartView = this.pieChartView()

    if (this.props.moduleLoading) {
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
