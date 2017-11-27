'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as globalActions from '../modules/global/globalActions'
import * as liveJobActions from '../modules/liveJob/liveJobActions'
import Loader from '../components/Loader'
import moment from 'moment'
import React, { Component } from 'react'
import { StyleSheet, View, Image, TouchableHighlight, Alert, FlatList } from 'react-native'

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
import _ from 'underscore'
import { NEXT_POSSIBLE_STATUS } from '../lib/AttributeConstants'
import { FormLayout, RESET_STATE } from '../lib/constants'


function mapStateToProps(state) {
    return {
        liveJobList: state.liveJob.liveJobList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...liveJobActions, ...globalActions }, dispatch)
    }
}

class LiveJobListing extends Component {

    componentDidMount() {
        this.props.actions.fetchAllLiveJobsList()
    }

    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }
    }
    renderData = (item) => {
        let time = this.getJobEtaTime(item.id)
        return (
            <JobListItem data={item} jobEndTime={time}
            />
        )
    }
    getJobEtaTime = (id) => {
        let jobEndTime = moment(this.props.liveJobList.jobMap[id].jobEndTime, 'HH:mm:ss')
        let currentTime = moment()
        //  let diff = jobEndTime.diff(moment().format('HH:mm:ss'))
        // let diff = moment().subtract(jobEndTime)
        //  return diff
        //  return moment(diff).format('HH:mm:ss')
        //    
        return moment.utc(moment(jobEndTime, "HH:mm:ss").diff(moment(currentTime, "HH:mm:ss"))).format("HH:mm:ss")
    }
    render() {
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
                    <FlatList
                        data={this.props.liveJobList.jobTransactionCustomizationList}
                        renderItem={({ item }) => this.renderData(item)}
                        keyExtractor={item => item.key}
                    />
                </Container>
            </StyleProvider>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveJobListing)

