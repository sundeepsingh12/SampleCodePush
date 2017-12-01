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

} from '../lib/AttributeConstants'
import moment from 'moment'
import { NavigationActions } from 'react-navigation'


function mapStateToProps(state) {
    return {
        currentStatus: state.liveJob.currentStatus,
        jobDataList: state.liveJob.jobDataList,
        jobTransaction: state.liveJob.jobTransaction,
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
        if (moment(jobEndTime).diff(moment(currentTime)) <= 0) {
            return 'TimeUp'
        }
        return moment.utc(moment(jobEndTime, "HH:mm:ss").diff(moment(currentTime, "HH:mm:ss"))).format("HH:mm:ss")
    }
    componentDidMount() {
        let endTime = this.getJobEndTime()
        // if (endTime =='TimeUp') {
        //     endTime=
        // }
        this.setState({
            counter: endTime
        })
        let timer = setInterval(this.tick, 1000);
        this.setState({ timer });
        this.props.actions.getJobDetails(this.props.navigation.state.params.job.id)
    }
    componentWillUnmount() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              //  NavigationActions.navigate({ routeName: 'Profile' })
            ]
        })
        this.props.navigation.dispatch(resetAction)
    }
    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container style={[styles.bgLightGray]}>
                    <Header
                        style={StyleSheet.flatten([
                            styles.bgPrimary, {
                                borderBottomWidth: 0
                            }
                        ])}>
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
                            <Text style={styles.justifyCenter}>
                                {moment(this.state.counter).format('HH:mm:ss')}
                            </Text>
                        </View>
                        <View style={[styles.row, style.footer, styles.padding10]}>
                            <Button full style={[styles.bgDanger, styles.flexBasis50]} onPress={() => this.props.actions.acceptOrRejectJob(2, this.props.navigation.state.params.job, this.props.navigation.state.params.liveJobList)}>
                                <Text style={[styles.fontWhite, styles.fontDefault]}>Reject</Text>
                            </Button>
                            <Button full style={[styles.bgSuccess, styles.flexBasis50]} onPress={() => this.props.actions.acceptOrRejectJob(1, this.props.navigation.state.params.job, this.props.navigation.state.params.liveJobList)}>
                                <Text style={[styles.fontWhite, styles.fontDefault]}>Accept</Text>
                            </Button>
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
        flexDirection: 'column',
        paddingLeft: 0,
        paddingRight: 0,
        height: 'auto',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f3f3'
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
