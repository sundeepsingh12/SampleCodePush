'use strict'

import React, { PureComponent } from 'react'
import { Platform, BackHandler, View, StyleSheet, Text } from 'react-native'
import { Icon, Header, Body, Image } from 'native-base'
import { connect } from 'react-redux'
import { TabNavigator } from 'react-navigation'
import SyncScreen from './SyncScreen'
import ErpSyncScreen from './ErpSyncScreen'
import Home from './Home'
import Menu from './Menu'
import styles from '../themes/FeStyle'
import * as homeActions from '../modules/home/homeActions'
import ErpSyncTabIcon from '../svg_components/icons/ErpSyncTabIcon'
import FareyeLogo from '../../images/fareye-default-iconset/fareyeLogoSm.png'

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
                    gesturesEnabled: false,
                    title: 'Home',
                    tabBarIcon: ({ tintColor }) => (
                        <Icon
                            name='ios-home'
                            style={[{ fontSize: 18, marginTop: (Platform.OS == 'ios') ? 5 : 0, color: tintColor }]}
                        />
                    ),
                }
            },
            SyncScreen: {
                screen: SyncScreen,
                navigationOptions: {
                    title: 'Sync',
                    gesturesEnabled: false,
                    tabBarIcon: ({ tintColor }) => (
                        <Icon
                            name='ios-sync'
                            style={[{ fontSize: 18, marginTop: (Platform.OS == 'ios') ? 5 : 0, color: tintColor }]}
                        />
                    ),
                }
            },
            ErpSyncScreen: {
                screen: ErpSyncScreen,
                navigationOptions: {
                    title: 'ERP',
                    gesturesEnabled: false,
                    tabBarIcon: ({ tintColor }) => (
                        <View
                            style={[styles.alignSelfCenter, styles.marginLeft5, { height: 30, marginTop: 15 }]}>
                            <ErpSyncTabIcon width={50} height={50} color={tintColor} />
                        </View>
                    ),
                }
            },
            MenuScreen: {
                screen: Menu,
                navigationOptions: {
                    title: 'Menu',
                    gesturesEnabled: false,
                    tabBarIcon: ({ tintColor }) => (
                        <Icon
                            name='md-menu'
                            style={[{ fontSize: 18, marginTop: (Platform.OS == 'ios') ? 5 : 0, color: tintColor }]}
                        />
                    ),
                }
            }
        }
        const tabStyle = {
            tabBarPosition: 'bottom',
            initialRouteName: 'HomeScreen',
            animationEnabled: true,
            tabBarOptions: {
                showIcon: true,
                activeTintColor: styles.bgPrimaryColor,
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
                    paddingBottom: 5
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
                tabStyle,
            );
        } else {
            HomeTabNavigatorOptions = TabNavigator({
                HomeScreen: Tabs.HomeScreen,
                SyncScreen: Tabs.SyncScreen,
                MenuScreen: Tabs.MenuScreen,
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