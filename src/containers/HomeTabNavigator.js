'use strict'

import React, { PureComponent } from 'react'
import {
    Platform,
    BackHandler,
    View
    
} from 'react-native'
import {
    Icon
} from 'native-base'
import { connect } from 'react-redux'
import {
    TabNavigator
} from 'react-navigation'
import SyncScreen from './SyncScreen'
import ErpSyncScreen from './ErpSyncScreen'

import Home from './Home'
import Menu from './Menu'
import styles from '../themes/FeStyle'
import * as homeActions from '../modules/home/homeActions'
import ErpSyncTabIcon from '../svg_components/icons/ErpSyncTabIcon'

function mapStateToProps(state) {
    return {
        customErpPullActivated: state.home.customErpPullActivated,
    }
}

class HomeTabNavigator extends PureComponent {

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    componentDidMount() {
        this.props.checkCustomErpPullActivated()
    }

    render() {
        if (!this.props.customErpPullActivated) {
            return null
        }
        const Tabs = {
            HomeScreen: {
                screen: Home,
                navigationOptions: {
                    header: null,
                    gesturesEnabled: false,
                    title: 'Home',
                    tabBarIcon: ({ tintColor }) => (
                        <Icon
                            name='ios-home'
                            style={[{ fontSize: 18, marginBottom: (Platform.OS == 'ios') ? 15 : 0, marginTop: (Platform.OS == 'ios') ? 0 : 5, color: tintColor }]}
                        />
                    ),
                }
            },
            SyncScreen: {
                screen: SyncScreen,
                navigationOptions: {
                    header: null,
                    title: 'Sync',
                    gesturesEnabled: false,
                    tabBarIcon: ({ tintColor }) => (
                        <Icon
                            name='ios-sync'
                            style={[{ fontSize: 18, marginBottom: (Platform.OS == 'ios') ? 15 : 0, marginTop: (Platform.OS == 'ios') ? 0 : 5, color: tintColor }]}
                        />
                    ),
                }
            },
            ErpSyncScreen: {
                screen: ErpSyncScreen,
                navigationOptions: {
                    header: null,
                    title: 'ERP',
                    gesturesEnabled: false,
                    tabBarIcon: ({ tintColor }) => (
                        <View 
                        style={[ styles.alignSelfCenter, styles.marginLeft5, { height: 30, paddingTop: (Platform.OS == 'ios') ? 0 : 10, marginBottom: (Platform.OS == 'ios') ? 0 : 0}]}>
                            <ErpSyncTabIcon width = {50} height = {50} color={tintColor} />
                        </View>
                    ),
                }
            },
            MenuScreen: {
                screen: Menu,
                navigationOptions: {
                    header: null,
                    title: 'Menu',
                    gesturesEnabled: false,
                    tabBarIcon: ({ tintColor }) => (
                        <Icon
                            name='md-menu'
                            style={[{ fontSize: 18, marginBottom: (Platform.OS == 'ios') ? 15 : 0, marginTop: (Platform.OS == 'ios') ? 0 : 5, color: tintColor }]}
                        />
                    ),
                }
            }
        }
        const tabStyle = {
            tabBarPosition: 'bottom',
            animationEnabled: true,
            tabBarOptions: {
                showIcon: true,
                activeTintColor: styles.bgPrimary.backgroundColor,
                inactiveTintColor: '#aaaaaa',
                style: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#f3f3f3',
                },
                labelStyle: {
                    fontSize: 12,
                    marginTop: 0,
                    fontWeight: '600'

                },
                tabStyle: {
                    alignItems: 'center',
                    height: 50,
                    paddingTop: 10,
                    paddingBottom: 10
                },
                indicatorStyle: {
                    height: 0
                }

            }
        }
        var HomeTabNavigatorOptions = null
        if (this.props.customErpPullActivated == 'activated') {
            HomeTabNavigatorOptions = TabNavigator({
                HomeScreen: Tabs.HomeScreen,
                SyncScreen: Tabs.SyncScreen,
                ErpSyncScreen: Tabs.ErpSyncScreen,
                MenuScreen: Tabs.MenuScreen
            },
                tabStyle
            );
        } else {
            HomeTabNavigatorOptions = TabNavigator({
                HomeScreen: Tabs.HomeScreen,
                SyncScreen: Tabs.SyncScreen,
                MenuScreen: Tabs.MenuScreen
            },
                tabStyle
            );
        }
        return (
            <HomeTabNavigatorOptions />
        )
    }
}

export default connect(mapStateToProps, homeActions)(HomeTabNavigator)