'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { StyleSheet, View, Image, TouchableHighlight } from 'react-native'
import Loader from '../components/Loader'
import Menu from './Menu'
import Home from './Home'
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
    Tab,
    TabHeading,
    Tabs
} from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import * as homeActions from '../modules/home/homeActions'
import * as globalActions from '../modules/global/globalActions'

import {
    HomeScreen
} from '../lib/constants'

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...homeActions, ...globalActions }, dispatch)
    }
}


class HomeFooter extends PureComponent {
    static navigationOptions = ({ navigation }) => {
        return { header: null }
      }

    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
            <Tabs
                tabBarPosition={'bottom'}
                style={{borderTopWidth: 1, borderTopColor: '#f3f3f3'}}
                tabBarUnderlineStyle={[styles.bgPrimary, {height: 0}]}
            >
                <Tab key={1}
                    tabStyle={[styles.bgPrimary]}
                    activeTabStyle={[styles.bgWhite]}
                    textStyle={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}
                    activeTextStyle={[styles.fontWhite, styles.fontDefault]}
                    heading={
                        <TabHeading style={[styles.bgWhite]}>
                            <View style={[styles.column, styles.justifyCenter, styles.alignCenter]}>
                                <Icon name="ios-home" style={[styles.fontXl, styles.fontBlack]} />
                                <Text style={[styles.fontDefault,styles.fontBlack]}>Home</Text>
                            </View>
                        </TabHeading>}>
                <JobDetailsV2/>
                </Tab>
                <Tab key={2}
                    tabStyle={[styles.bgPrimary]}
                    activeTabStyle={[styles.bgPrimary]}
                    textStyle={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}
                    activeTextStyle={[styles.fontWhite, styles.fontDefault]}
                    heading={
                        <TabHeading style={[styles.bgWhite]}>
                            <View style={[styles.column, styles.justifyCenter, styles.alignCenter]}>
                            <Icon name="ios-sync" style={[styles.fontXl]} />
                            <Text style={[styles.fontDefault]}>Sync</Text>
                            </View>
                        </TabHeading>}>
                </Tab>
                <Tab key={3}
                    tabStyle={[styles.bgPrimary]}
                    activeTabStyle={[styles.bgPrimary]}
                    textStyle={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}
                    activeTextStyle={[styles.fontWhite, styles.fontDefault]}
                    heading={
                        <TabHeading style={[styles.bgWhite]}>
                            <View style={[styles.column, styles.justifyCenter, styles.alignCenter]}>
                            <Icon name="ios-menu" style={[styles.fontXl]} />
                            <Text style={[styles.fontDefault]}>Menu</Text>
                            </View>
                        </TabHeading>}>
                <Menu/>
                </Tab>
            </Tabs>
            </StyleProvider>
        )
    }
}

const style = StyleSheet.create({
    footer: {
        height: 'auto',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3'
    }
});


export default connect(null, mapDispatchToProps)(HomeFooter)
