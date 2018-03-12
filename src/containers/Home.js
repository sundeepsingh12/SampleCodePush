'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { StyleSheet, View, Image, TouchableHighlight, ActivityIndicator, PushNotificationIOS, Animated } from 'react-native'
import Loader from '../components/Loader'
import PieChart from '../components/PieChart'
import renderIf from '../lib/renderIf'
import * as globalActions from '../modules/global/globalActions'
import * as homeActions from '../modules/home/homeActions'
import {
  Container,
  Content,
  Header,
  Button,
  Text,
  List,
  ListItem,
  Separator,
  Left,
  Body,
  Right,
  Icon,
  Title,
  Footer,
  FooterTab,
  StyleProvider,
  Toast,
  ActionSheet,
} from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import FareyeLogo from '../../images/fareye-default-iconset/fareyeLogoSm.png'

function mapStateToProps(state) {
  return {
    pages: state.home.pages,
    utilities: state.home.utilities,
    pagesLoading: state.home.pagesLoading,
    pieChartSummaryCount: state.home.pieChartSummaryCount,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...globalActions, ...homeActions }, dispatch)
  }
}

class Home extends PureComponent {
  componentDidMount() {
    this.props.actions.fetchPagesAndPiechart();
  }

  getPageListItemsView() {
    const pageList = this.props.pages;
    let pageListView = []
    _.each(pageList, (page => {
      pageListView.push(
        <ListItem button style={[style.moduleList]} key={page.id} onPress={() => this.props.actions.navigateToPage(page)}>
          <Icon name={page.icon} style={[styles.fontLg, styles.fontWeight500, style.moduleListIcon]} />
          <Body><Text style={[styles.fontWeight500, styles.fontLg]}>{page.name}</Text></Body>
          <Right><Icon name="ios-arrow-forward" /></Right>
        </ListItem>
      )
    }));
    return pageListView
  }

  render() {
    console.log('pages', this.props)
    const pageListItemsView = this.getPageListItemsView();
    if (this.props.pagesLoading) {
      return (<Loader />)
    }
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container style={StyleSheet.flatten([styles.bgWhite])}>
          <Header searchBar style={StyleSheet.flatten([styles.bgWhite, style.header])}>
            <Body>
              <View style={[styles.row, styles.width100, styles.justifySpaceBetween]}><View style={[style.headerBody]}><View style={{ width: 90 }}>
                <Image style={StyleSheet.flatten([styles.width100, { resizeMode: 'contain' }])} source={FareyeLogo} />
              </View></View></View>
            </Body>
          </Header>
          <Content>
            {renderIf(this.props.utilities.pieChartEnabled,
              <PieChart count={this.props.pieChartSummaryCount} />
            )}
            <List>{pageListItemsView}</List>
          </Content>
        </Container>
      </StyleProvider>
    )
  }
}

const style = StyleSheet.create({
  moduleList: {
    height: 70
  },
  moduleListIcon: {
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#d6d7da',
    padding: 5,
    backgroundColor: styles.primaryColor
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(Home)