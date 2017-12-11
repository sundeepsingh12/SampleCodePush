'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'

import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'

import {
    Container,
    Content,
    Header,
    Button,
    Text,
    Left,
    Body,
    Right,
    Icon,
    StyleProvider,
    List,
    ListItem,
    Footer,
    FooterTab,
    Card,
    ActionSheet
} from 'native-base'

import * as globalActions from '../modules/global/globalActions'
import * as liveJobActions from '../modules/liveJob/liveJobActions'
import Loader from '../components/Loader'
import ExpandableHeader from '../components/ExpandableHeader'
import renderIf from '../lib/renderIf'
import {
    START
} from '../lib/constants'
import moment from 'moment'
import { NavigationActions } from 'react-navigation'


function mapStateToProps(state) {
    return {
        currentStatus: state.liveJob.currentStatus,
        jobDataList: state.liveJob.jobDataList,
        jobTransaction: state.liveJob.jobTransaction,
        modules: state.home.modules,
    }
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...liveJobActions }, dispatch)
    }
}

class LiveJob extends Component {
    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }
    state = {
        timer: null,
        counter: 0
    };

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    tick = () => {
        this.setState({
            counter: moment(this.state.counter, 'HH:mm:ss').subtract(1, 'seconds')
        });
    }
    getJobEndTime = () => {
        let jobEndTime = moment(this.props.navigation.state.params.liveJobList[this.props.navigation.state.params.job.id].jobEndTime, 'HH:mm:ss')
        let currentTime = moment()
        // if (moment(jobEndTime).diff(moment(currentTime)) <= 0) {
        //     return 'TimeUp'
        // }
        return moment.utc(moment(jobEndTime, "HH:mm:ss").diff(moment(currentTime, "HH:mm:ss"))).format("HH:mm:ss")
    }
    componentDidMount() {
        let endTime = this.getJobEndTime()
        this.setState({
            counter: endTime
        })
        let timer = setInterval(this.tick, 1000);
        this.setState({ timer });
        this.props.actions.getJobDetails(this.props.navigation.state.params.job.id)
    }
    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container style={[styles.bgLightGray]}>
                    <Header searchBar style={[styles.bgPrimary, style.header]}>
                        <Body>
                            <View
                                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                                <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                                    <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                                </TouchableOpacity>
                                <View style={[style.headerBody]}>
                                    <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>Live Task</Text>
                                </View>
                                <View style={[style.headerRight]}>
                                </View>
                                <View />
                            </View>
                        </Body>
                    </Header>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={style.seqCard}>
                            <View style={style.seqCircle}>
                                <Text style={[styles.fontWhite, styles.fontCenter, styles.fontLg]}>
                                    {this.props.navigation.state.params.job.jobMasterIdentifier}
                                </Text>
                            </View>
                            <View style={style.seqCardDetail}>
                                <View>
                                    <Text style={[styles.fontDefault, styles.fontWeight500, styles.lineHeight25]}>
                                        {this.props.navigation.state.params.job.line1}
                                    </Text>
                                    <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20]}>
                                        {this.props.navigation.state.params.job.line2}
                                    </Text>
                                    <Text
                                        style={[styles.fontSm, styles.italic, styles.fontWeight300, styles.lineHeight20]}>
                                        {this.props.navigation.state.params.job.circleLine1}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.heightAuto, styles.bgWarning]}>
                            <Text style={[styles.alignSelfCenter, styles.fontWhite]}>
                                {
                                    (moment(this.state.counter, "HH:mm:ss")).hours() + ' hours ' +
                                    (moment(this.state.counter, "HH:mm:ss")).minutes() + ' minutes ' +
                                    (moment(this.state.counter, "HH:mm:ss")).seconds() + ' seconds left'
                                }
                            </Text>
                        </View>
                        <View style={[styles.row, styles.bgWhite]}>
                            <View style={[styles.padding10, styles.paddingRight5, styles.flexBasis50]}>
                                <Button full style={[styles.bgDanger]} onPress={() => this.props.actions.acceptOrRejectJob(2, this.props.navigation.state.params.job, this.props.navigation.state.params.liveJobList)}>
                                    <Text style={[styles.fontWhite, styles.fontDefault]}>Reject</Text>
                                </Button>
                            </View>
                            <View style={[styles.padding10, styles.paddingLeft5, styles.flexBasis50]}>
                                <Button full style={[styles.bgSuccess]} onPress={() => this.props.actions.acceptOrRejectJob(1, this.props.navigation.state.params.job, this.props.navigation.state.params.liveJobList, this.props.modules[START])}>
                                    <Text style={[styles.fontWhite, styles.fontDefault]}>Accept</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                    <Content>
                        {/*Basic Details*/}
                        <View style={[styles.bgWhite, styles.marginTop10, styles.paddingTop5, styles.paddingBottom5]}>
                            <ExpandableHeader
                                title={'Basic Details'}
                                dataList={this.props.jobDataList}
                            />
                        </View>

                    </Content>
                    <Footer style={[style.footer]}>

                    </Footer>
                </Container >
            </StyleProvider >
        )
    }
}


const style = StyleSheet.create({
    //  styles.column, styles.paddingLeft0, styles.paddingRight0, {height: 'auto'}
    header: {
        borderBottomWidth: 0,
        height: 'auto',
        padding: 0,
        paddingRight: 0,
        paddingLeft: 0,
    },
    headerLeft: {
        width: '15%',
        padding: 15
    },
    headerBody: {
        width: '70%',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10
    },
    headerRight: {
        width: '15%',
        padding: 15
    },
    headerIcon: {
        fontSize: 18
    },
    seqCard: {
        minHeight: 70,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        backgroundColor: '#ffffff'
    },
    seqCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#ffcc00',
        justifyContent: 'center',
        alignItems: 'center'
    },
    seqCardDetail: {
        flex: 1,
        minHeight: 70,
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    jobListItem: {
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        paddingTop: 20,
        paddingBottom: 20
    },
    statusCircle: {
        width: 6,
        height: 6,
        borderRadius: 3
    },
    footer: {
        height: 'auto',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3',
    }

});

export default connect(mapStateToProps, mapDispatchToProps)(LiveJob)
