'use strict'

import React, { PureComponent } from 'react'
import { Platform, BackHandler, View, StyleSheet, Text } from 'react-native'
import { Icon, Header, Body, Image } from 'native-base'
import { connect } from 'react-redux'
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation'
import SyncScreen from './SyncScreen'
import ErpSyncScreen from './ErpSyncScreen'
import styles from '../themes/FeStyle'
import * as homeActions from '../modules/home/homeActions'
import HomeStack from '../modules/navigators/HomeStackNavigator'
import MenuStack from '../modules/navigators/MenuStackNavigator'

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

        HomeStack.navigationOptions =  MenuStack.navigationOptions = ({ navigation }) => {
            let tabBarVisible = true;
            if (navigation.state.index > 0) {
                tabBarVisible = false;
            }
            return {
                tabBarVisible,
            };
        };

        const Tabs = {
            Home: {
                screen: HomeStack,
                navigationOptions: {
                    header: null,
                    tabBarIcon: ({ tintColor }) => (
                    <Icon
                        name='ios-home'
                        style={[{ fontSize: 18, color: tintColor }]}
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
                            style={[{ fontSize: 18, color: tintColor }]}
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
                        <Icon
                            name="ios-download"
                            style={[{ fontSize: 18, color: tintColor }]}
                        />
                    ),
                }
            },
            Menu: {
                screen: MenuStack,
                navigationOptions: {
                    header: null,
                    tabBarIcon: ({ tintColor }) => (
                    <Icon
                        name='md-menu'
                        style={[{ fontSize: 18, color: tintColor }]}
                    />
                ),
            }
            }
        }
        const tabStyle = {
            tabBarPosition: 'bottom',
            initialRouteName: 'Home',
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
            HomeTabNavigatorOptions = createBottomTabNavigator({
                Home: Tabs.Home,
                SyncScreen: Tabs.SyncScreen,
                ErpSyncScreen: Tabs.ErpSyncScreen,
                Menu: Tabs.Menu
            },
                tabStyle,
            );
        } else {
            HomeTabNavigatorOptions = createBottomTabNavigator({
                Home: Tabs.Home,
                SyncScreen: Tabs.SyncScreen,
                Menu: Tabs.Menu,
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