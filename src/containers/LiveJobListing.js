'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as globalActions from '../modules/global/globalActions'
import * as liveJobActions from '../modules/liveJob/liveJobActions'
import Loader from '../components/Loader'
import moment from 'moment'
import React, { Component } from 'react'
import { StyleSheet, View, Image, TouchableHighlight, Alert, FlatList, Vibration } from 'react-native'
import _ from 'lodash'
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
    Spinner,
    ActionSheet
} from 'native-base'

import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf'
import TitleHeader from '../components/TitleHeader'
import JobListItem from '../components/JobListItem'


function mapStateToProps(state) {
    return {
        liveJobList: state.liveJobList.liveJobList,
        selectedItems: state.liveJobList.selectedItems,
        loaderRunning: state.liveJobList.loaderRunning
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...liveJobActions, ...globalActions }, dispatch)
    }
}

class LiveJobListing extends Component {

    componentWillMount() {
        this.props.actions.fetchAllLiveJobsList()
        if (this.props.navigation.state.params && this.props.navigation.state.params.callAlarm == true) {
            Vibration.vibrate()
            this.props.navigation.state.params.callAlarm = false
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }
    }
    navigateToScene = (item) => {
        if (item.isChecked == 'false' || !item.isChecked && this.props.selectedItems.length == 0) {
            this.props.actions.navigateToScene('LiveJob',
                {
                    job: item,
                    liveJobList: this.props.liveJobList
                }
            )
        } else {
            this.toggleLiveJobSelection(item.id)
        }
    }
    renderData = (item) => {
        let time = this.getJobEtaTime(item.id)
        if (time != 'TimeUp') {
            return (
                <JobListItem data={item.jobTransactionCustomization} jobEndTime={time}
                    onPressItem={() => { this.navigateToScene(item.jobTransactionCustomization) }}
                    onLongPressItem={() => this.toggleLiveJobSelection(item.id)}
                />
            )
        }
    }
    getJobEtaTime = (id) => {
        if (this.props.liveJobList[id]) {
            let jobEndTime = moment(this.props.liveJobList[id].jobEndTime, 'HH:mm:ss')
            let currentTime = moment()
            if (moment(jobEndTime).diff(moment(currentTime)) <= 0) {
                return 'TimeUp'
            }
            return moment.utc(moment(jobEndTime, "HH:mm:ss").diff(moment(currentTime, "HH:mm:ss"))).format("HH:mm:ss")
        }
    }
    toggleLiveJobSelection = (id) => {
        this.props.actions.toggleLiveJobSelection(id, this.props.liveJobList)
    }
    acceptOrRejectMultiple = (status) => {
        this.props.actions.acceptOrRejectMultiple(status, this.props.selectedItems, this.props.liveJobList)
    }
    render() {
        if (this.props.loaderRunning) {
            return <Loader />
        }
        else {
            if (_.isEmpty(this.props.liveJobList)) {
                return (
                    <StyleProvider style={getTheme(platform)}>
                        <Container>
                            <Header style={StyleSheet.flatten([styles.bgPrimary])}>
                                <Left>
                                    <Button transparent onPress={() => {
                                        this.props.navigation.goBack(null)
                                    }}>
                                        <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]} />
                                    </Button>
                                </Left>
                                <Body>
                                    <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>Live Tasks</Text>
                                </Body>
                                <Right />
                            </Header>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                                <Text style={[styles.margin30, styles.fontDefault, styles.fontDarkGray]}>No jobs present</Text>
                            </View>
                        </Container>
                    </StyleProvider>
                )
            } else {
                return (
                    <StyleProvider style={getTheme(platform)}>
                        <Container>
                            <Header style={StyleSheet.flatten([styles.bgPrimary])}>
                                <Left>
                                    <Button transparent onPress={() => {
                                        this.props.navigation.goBack(null)
                                    }}>
                                        <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]} />
                                    </Button>
                                </Left>
                                <Body>
                                    <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>Live Tasks</Text>
                                </Body>
                                <Right>
                                    {renderIf(this.props.selectedItems && this.props.selectedItems.length > 0,
                                        <View>
                                            <Text onPress={() => this.acceptOrRejectMultiple(1)}> Accept </Text>
                                            <Text onPress={() => this.acceptOrRejectMultiple(2)}> Reject </Text>
                                        </View>
                                    )}
                                </Right>
                            </Header>
                            <FlatList
                                data={Object.values(this.props.liveJobList)}
                                renderItem={({ item }) => this.renderData(item)}
                                keyExtractor={item => item.key}
                            />
                        </Container>
                    </StyleProvider>
                )
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveJobListing)

