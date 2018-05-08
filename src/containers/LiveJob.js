'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'

import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableOpacity, } from 'react-native'
import { Container, Content, Header, Button, Text, Left, Body, Right, Icon, StyleProvider, List, ListItem, Footer, FooterTab, Card, ActionSheet, Toast } from 'native-base'
import * as globalActions from '../modules/global/globalActions'
import * as liveJobActions from '../modules/liveJob/liveJobActions'
import Loader from '../components/Loader'
import ExpandableHeader from '../components/ExpandableHeader'
import renderIf from '../lib/renderIf'
import { START, SET_LIVE_JOB_TOAST } from '../lib/constants'
import moment from 'moment'
import { NavigationActions } from 'react-navigation'
import { OK } from '../lib/ContainerConstants'
import Line1Line2View from '../components/Line1Line2View'


function mapStateToProps(state) {
    return {
        currentStatus: state.liveJob.currentStatus,
        jobDataList: state.liveJob.jobDataList,
        jobTransaction: state.liveJob.jobTransaction,
        toastMessage: state.liveJob.toastMessage,
        isLoading: state.liveJob.isLoading
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...liveJobActions }, dispatch)
    }
}

class LiveJob extends PureComponent {
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

    getLoader() {
        let loader
        if (this.props.isLoading) {
            loader = <Loader />
        }
        return loader
    }
    tick = () => {
        let jobEndTime = moment(this.props.navigation.state.params.liveJobList[this.props.navigation.state.params.job.id].jobEndTime, 'HH:mm:ss')
        let currentTime = moment()
        this.setCounterNgative(jobEndTime, currentTime)
        if (this.state.counterNegative) {
            this.setState({
                counter: moment(this.state.counter, 'HH:mm:ss').add(1, 'seconds')
            });
        } else {
            this.setState({
                counter: moment(this.state.counter, 'HH:mm:ss').subtract(1, 'seconds')
            });
        }
    }
    getDifference = (jobEndTime, currentTime) => {
        if (this.state.counterNegative)
            return moment.utc(moment(currentTime, "HH:mm:ss").diff(moment(jobEndTime, "HH:mm:ss"))).format("HH:mm:ss")
        else {
            return moment.utc(moment(jobEndTime, "HH:mm:ss").diff(moment(currentTime, "HH:mm:ss"))).format("HH:mm:ss")
        }
    }
    setCounterNgative = (jobEndTime, currentTime) => {

        if (moment(jobEndTime).diff(moment(currentTime)) <= 0) {
            this.setState({ counterNegative: true })
        }
    }
    getJobEndTime = () => {
        let jobEndTime = moment(this.props.navigation.state.params.liveJobList[this.props.navigation.state.params.job.id].jobEndTime, 'HH:mm:ss')
        let currentTime = moment()
        // if (moment(jobEndTime).diff(moment(currentTime)) <= 0) {
        //     return 'TimeUp'
        // }
        return moment.utc(moment(jobEndTime, "HH:mm:ss").diff(moment(currentTime, "HH:mm:ss"))).format("HH:mm:ss")
    }
    componentWillMount() {
        let jobEndTime = moment(this.props.navigation.state.params.liveJobList[this.props.navigation.state.params.job.id].jobEndTime, 'HH:mm:ss')
        let currentTime = moment()
        this.setCounterNgative(jobEndTime, currentTime)
    }
    componentDidMount() {
        let jobEndTime = moment(this.props.navigation.state.params.liveJobList[this.props.navigation.state.params.job.id].jobEndTime, 'HH:mm:ss')
        let currentTime = moment()
        let differenceInTime = this.getDifference(jobEndTime, currentTime)
        this.setState({
            counter: differenceInTime
        })
        let timer = setInterval(this.tick, 1000);
        this.setState({ timer });
        this.props.actions.getJobDetails(this.props.navigation.state.params.job.id)
    }
    componentDidUpdate() {
        if (this.props.toastMessage && this.props.toastMessage != '') {
            Toast.show({
                text: this.props.toastMessage,
                position: 'bottom',
                buttonText: OK,
                duration: 5000
            })
        }
    }
    renderTime() {
        if (this.props.isLoading) return
        if (this.state.counterNegative) {
            return (
                <View style={[styles.heightAuto, styles.bgWarning]}>
                    <Text style={[styles.alignSelfCenter, styles.fontWhite]}>
                        <Text>
                            {'Delayed by ' + (moment(this.state.counter, "HH:mm:ss")).hours() + ' hours ' +
                                (moment(this.state.counter, "HH:mm:ss")).minutes() + ' minutes ' +
                                (moment(this.state.counter, "HH:mm:ss")).seconds() + ' seconds'} </Text>
                    </Text>
                </View>
            )
        } else {
            return (
                <View style={[styles.heightAuto, styles.bgWarning]}>
                    <Text style={[styles.alignSelfCenter, styles.fontWhite]}>
                        <Text>
                            {(moment(this.state.counter, "HH:mm:ss")).hours() + ' hours ' +
                                (moment(this.state.counter, "HH:mm:ss")).minutes() + ' minutes ' +
                                (moment(this.state.counter, "HH:mm:ss")).seconds() + ' seconds left'}
                        </Text>
                    </Text>
                </View>)
        }
    }

    showHeaderView() {
        return (
            <Header searchBar style={[styles.bgPrimary, style.header]}>
                <Body>
                    <View
                        style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                        <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                            <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                        </TouchableOpacity>
                        <View style={[style.headerBody]}>
                            <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.navigation.state.params.displayName}</Text>
                        </View>
                        <View style={[style.headerRight]}>
                        </View>
                        <View />
                    </View>
                </Body>
            </Header>
        )
    }

    showJobDataList() {
        return (
            <Content>
                {renderIf(!this.props.isLoading,
                    <View style={[styles.bgWhite, styles.marginTop10, styles.paddingTop5, styles.paddingBottom5]}>
                        <ExpandableHeader
                            title={'Basic Details'}
                            dataList={this.props.jobDataList}
                        />
                    </View>)}
            </Content>
        )
    }

    showJobMasterIdentifierAndLine1() {
        return (
            <View style={style.seqCard}>
                <View style={style.seqCircle}>
                    <Text style={[styles.fontWhite, styles.fontCenter, styles.fontLg]}>
                        {this.props.navigation.state.params.job.jobMasterIdentifier}
                    </Text>
                </View>
                <Line1Line2View data={this.props.navigation.state.params.job} />
            </View>
        )
    }

    onButtonPress = (status) => {
        this.props.actions.acceptOrRejectJob(status, this.props.jobTransaction, this.props.navigation.state.params.liveJobList)
    }

    showAccepRejectButtons() {
        if (!this.state.counterNegative && !this.props.isLoading) {
            return <View style={[styles.row, styles.bgWhite]}>
                <View style={[styles.padding10, styles.paddingRight5, styles.flexBasis50]}>
                    <Button full style={[styles.bgDanger]} onPress={() => this.onButtonPress(2)}>
                        <Text style={[styles.fontWhite, styles.fontDefault]}>Reject</Text>
                    </Button>
                </View>
                <View style={[styles.padding10, styles.paddingLeft5, styles.flexBasis50]}>
                    <Button full style={[styles.bgSuccess]} onPress={() => this.onButtonPress(1)}>
                        <Text style={[styles.fontWhite, styles.fontDefault]}>Accept</Text>
                    </Button>
                </View>
            </View>
        }
    }
    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container style={[styles.bgLightGray]}>
                    {this.showHeaderView()}
                    <View style={{ flexDirection: 'column' }}>
                        {this.showJobMasterIdentifierAndLine1()}
                        {this.getLoader()}
                        {this.renderTime()}
                        {this.showAccepRejectButtons()}
                    </View>
                    {this.showJobDataList()}
                    <Footer style={[style.footer]} />
                </Container >
            </StyleProvider >
        )
    }
}


const style = StyleSheet.create({
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
