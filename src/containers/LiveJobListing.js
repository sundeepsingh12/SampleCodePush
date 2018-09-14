'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as globalActions from '../modules/global/globalActions'
import * as liveJobActions from '../modules/liveJob/liveJobActions'
import Loader from '../components/Loader'
import moment from 'moment'
import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableHighlight, FlatList, TouchableOpacity, TextInput, ScrollView, Vibration } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import _ from 'lodash'
import { Container, Header, Button, Text, Body, Icon, Footer, FooterTab,  Toast } from 'native-base'
import styles from '../themes/FeStyle'
import JobListItem from '../components/JobListItem'
import { SET_SEARCH, SET_LIVE_JOB_TOAST, QrCodeScanner, CLEAR_LIVE_JOB_STATE } from '../lib/constants'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { LIVE_TASKS, NO_JOBS_PRESENT, SELECT_ALL, ACCEPT, REJECT, SELECTED, OK } from '../lib/ContainerConstants'
import { navigate } from '../modules/navigators/NavigationService';
import Sound from 'react-native-sound';
import BackgroundTimer from 'react-native-background-timer'

function mapStateToProps(state) {
    return {
        liveJobList: state.liveJobList.liveJobList,
        selectedItems: state.liveJobList.selectedItems,
        loaderRunning: state.liveJobList.loaderRunning,
        searchText: state.liveJobList.searchText,
        liveJobToastMessage: state.liveJobList.liveJobToastMessage
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...liveJobActions, ...globalActions }, dispatch)
    }
}

class LiveJobListing extends PureComponent {


    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }
    }
    constructor(props) {
        super(props);
        var alarm;
    }

    componentDidMount() {
        this.props.actions.fetchAllLiveJobsList()
        if (this.props.navigation.state.params && this.props.navigation.state.params.ringAlarm) {
            Vibration.vibrate([1000, 2000, 3000], true)
            this.props.navigation.state.params.ringAlarm = false
            Sound.setCategory('Playback');
            this.alarm = new Sound('alarm_notification.mp3', Sound.MAIN_BUNDLE, (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                    return;
                }
                // loaded successfully
                this.alarm.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                        // reset the player to its uninitialized state (android only)
                        // this is the only option to recover after an error occured and use the player again
                        this.alarm.reset();
                    }
                });
                this.alarm.setNumberOfLoops(-1);
            });
            BackgroundTimer.setTimeout(() => {
                Vibration.cancel()
                this.alarm.stop()
            }, 30000)
        }
    }

    componentDidUpdate() {
        if (this.props.liveJobToastMessage && this.props.liveJobToastMessage != '') {
            Toast.show({
                text: this.props.liveJobToastMessage,
                position: 'bottom',
                buttonText: OK,
                duration: 5000
            })
            this.props.actions.setState(SET_LIVE_JOB_TOAST, '')
        }
    }

    componentWillUnmount() {
        this.props.actions.setState(CLEAR_LIVE_JOB_STATE)
        if (this.alarm) {
            Vibration.cancel()
            this.alarm.stop()
        }
    }

    navigateToScene = (item) => {
        if (item.isChecked == 'false' || !item.isChecked && this.props.selectedItems.length == 0) {
            navigate('LiveJob',
                {
                    job: item,
                    liveJobList: this.props.liveJobList,
                    displayName: this.props.navigation.state.params.pageObject.name ? this.props.navigation.state.params.pageObject.name : LIVE_TASKS
                })
        } else {
            this.toggleLiveJobSelection(item.id)
        }
        if (this.alarm) {
            Vibration.cancel();
            this.alarm.stop();
        }
    }

    renderData = (item) => {
        let time = this.getJobEtaTime(item.id)
        if (time != 'TimeUp') {
            return (
                <JobListItem data={item} jobEndTime={time}
                    onPressItem={() => { this.navigateToScene(item) }}
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
            return this.props.liveJobList[id].jobEndTime
        }
    }

    toggleLiveJobSelection = (id) => {
        this.props.actions.toggleLiveJobSelection(id, this.props.liveJobList, this.props.searchText)
    }

    acceptOrRejectMultiple = (status) => {
        this.props.actions.acceptOrRejectMultiple(status, this.props.selectedItems, this.props.liveJobList)
    }

    renderList() {
        let jobMasterIdList = JSON.parse(this.props.navigation.state.params.pageObject.jobMasterIds)
        let jobTransactionArray = []
        let jobTransactionList = this.props.liveJobList
        for (let index in jobTransactionList) {
            if (jobMasterIdList.includes(jobTransactionList[index].jobMasterId) && this.checkTransactionForSearchText(jobTransactionList[index])) {
                jobTransactionArray.push(jobTransactionList[index])
            }
        }
        return jobTransactionArray
    }

    checkTransactionForSearchText(jobTransaction) {
        let trimmedSearchText = _.trim(this.props.searchText);
        if (!_.trim(trimmedSearchText)) {
            return true
        }
        let result = false;
        let searchText = _.toLower(trimmedSearchText);
        if (_.includes(_.toLower(jobTransaction.referenceNumber), searchText)) {
            result = true
        }
        return result;
    }

    emptyListView() {
        return (
                <Container>
                    <Header searchBar style={[{ backgroundColor: styles.bgPrimaryColor }, styles.header]}>
                        <Body>
                            <View
                                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                                <TouchableOpacity style={[styles.profileHeaderLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                                    <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                                </TouchableOpacity>
                                <View style={[styles.headerBody, styles.paddingTop15]}>
                                    <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.navigation.state.params.pageObject.name ? this.props.navigation.state.params.pageObject.name : LIVE_TASKS}</Text>
                                </View>
                                <View style={[styles.headerRight]}>
                                </View>
                                <View />
                            </View>
                        </Body>
                    </Header>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                        <Text style={[styles.margin30, styles.fontDefault, styles.fontDarkGray]}>{NO_JOBS_PRESENT}</Text>
                    </View>
                </Container>
        )
    }

    searchBar() {
        return (
            <View style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.paddingLeft10, styles.paddingRight10]}>
                <View style={[styles.relative, { width: '100%', height: 40 }]}>
                    <TextInput
                        placeholder={'Filter Reference Numbers'}
                        placeholderTextColor={'rgba(255,255,255,.6)'}
                        selectionColor={'rgba(224, 224, 224,.5)'}
                        onChangeText={(searchText) => {
                            this.props.actions.setState(SET_SEARCH, searchText)
                        }}
                        returnKeyType={"search"}
                        keyboardAppearance={"dark"}
                        underlineColorAndroid={'transparent'}
                        value={this.props.searchText}
                        onSubmitEditing={this.toggleItemOnSearchText}
                        style={[style.headerSearch]} />
                    <Button small transparent
                        style={[style.headerQRButton]}
                        onPress={() => this.props.navigation.navigate(QrCodeScanner, { returnData: this.toggleItemOnSearchBar.bind(this) })} >
                        <MaterialCommunityIcons name='qrcode' style={[styles.fontLg]} color={styles.fontWhite.color} />
                    </Button>
                </View>
            </View>
        )
    }

    setSearchText = (searchText) => {
        this.props.actions.setState(SET_SEARCH, searchText)
    }

    toggleItemOnSearchText = () => {
        this.props.actions.toggleItemOnSearchText(this.props.searchText, this.props.liveJobList)
    }
    toggleItemOnSearchBar = (searchText) => {
        this.props.actions.toggleItemOnSearchText(searchText, this.props.liveJobList)
    }

    showListWithSearchBar() {
        let view
        if (!this.props.selectedItems || this.props.selectedItems.length == 0) {
            view =
                <SafeAreaView style={[{ backgroundColor: styles.bgPrimaryColor }, style.header]}>
                    <View style={[{ backgroundColor: styles.bgPrimaryColor }, style.header]}>
                        <View style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                            <TouchableOpacity style={[style.headerLeft]} onPress={() => {
                                this.props.navigation.goBack(null)
                            }}>
                                <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                            </TouchableOpacity>
                            <View style={[style.headerBody]}>
                                <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.navigation.state.params.pageObject.name ? this.props.navigation.state.params.pageObject.name : LIVE_TASKS}</Text>
                            </View>
                            <View style={[style.headerRight]}>
                                <Text style={[styles.fontWhite]} onPress={() => this.props.actions.selectAll(this.props.liveJobList)}> {SELECT_ALL} </Text>
                            </View>
                            <View />
                        </View>
                        {this.searchBar()}
                    </View>
                </SafeAreaView>
        }
        return view
    }

    showMultipleSelectList() {
        let view
        if (this.props.selectedItems && this.props.selectedItems.length > 0) {
            view =
                <SafeAreaView style={[{ backgroundColor: styles.bgPrimaryColor }, style.header]}>
                    <View style={[{ backgroundColor: styles.bgPrimaryColor }, style.header]}>
                        <View style={[styles.column, { alignSelf: 'stretch' }]}>
                            <View style={[styles.row, styles.justifySpaceBetween, styles.alignCenter, styles.paddingLeft10, styles.paddingRight10]}>
                                <View style={[styles.row, styles.justifySpaceAround, styles.alignCenter]}>
                                    <TouchableOpacity
                                        style={[styles.margin5, styles.padding10, styles.paddingLeft0]}
                                        onPress={() => this.props.actions.selectNone(this.props.liveJobList)}>
                                        <Icon name="md-close" style={[styles.fontWhite, styles.fontXl]} />
                                    </TouchableOpacity>
                                    <Text style={[styles.fontWhite]}> {this.props.selectedItems.length + SELECTED} </Text>
                                </View>
                                <TouchableHighlight disabled={_.size(this.props.liveJobList) == _.size(this.props.selectedItems)} onPress={() => this.props.actions.selectAll(this.props.liveJobList)} >
                                    <Text style={[styles.fontWhite]}> {SELECT_ALL} </Text>
                                </TouchableHighlight>
                            </View>
                            {this.searchBar()}
                        </View>
                    </View>
                </SafeAreaView>
        }
        return view
    }

    getSelectedReferenceNo() {
        let referenceList = ''
        this.props.selectedItems.forEach((item) => { referenceList += this.props.liveJobList[item].referenceNumber + ",  " })
        return (
            <ScrollView horizontal={true} style={[styles.padding10]}>
                <Text>{referenceList}</Text>
                <View style={{ position: 'absolute', width: 5, backgroundColor: '#d9d9d9', zIndex: 1 }}></View>
            </ScrollView>
        )
    }

    showFooterView() {
        if (this.props.selectedItems && this.props.selectedItems.length > 0) {
            let referenceNumberView = this.getSelectedReferenceNo()
            return (
                <SafeAreaView>
                    <Footer style={[style.footer, styles.column]}>
                        {referenceNumberView}
                        <FooterTab style={[styles.paddingLeft10, styles.paddingRight10, { paddingBottom: 60 }, styles.paddingTop10, styles.row, styles.justifySpaceBetween]}>
                            <Button danger full
                                onPress={() => this.acceptOrRejectMultiple(2)}
                                style={[styles.marginRight10]}
                            >
                                <Text style={[styles.fontWhite, styles.padding10]} > {REJECT} </Text>
                            </Button>
                            <Button success full
                                onPress={() => this.acceptOrRejectMultiple(1)}
                            >
                                <Text style={[styles.fontWhite, styles.padding10]} > {ACCEPT} </Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </SafeAreaView>
            )
        }
    }

    render() {
        if (this.props.loaderRunning) {
            return <Loader />
        }
        else {
            if (_.isEmpty(this.props.liveJobList)) {
                return this.emptyListView()
            } else {
                return (
                        <Container>
                            {this.showListWithSearchBar()}
                            {this.showMultipleSelectList()}
                            <FlatList
                                data={this.renderList()}
                                renderItem={({ item }) => this.renderData(item)}
                                keyExtractor={item => String(item.id)}
                            />
                            {this.showFooterView()}
                        </Container>
                )
            }
        }
    }
}

const style = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        padding: 0,
        paddingRight: 0,
        paddingLeft: 0,
    },
    headerLeft: {
        width: '15%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    headerBody: {
        width: '60%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    headerRight: {
        width: '35%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    headerSearch: {
        paddingLeft: 10,
        paddingRight: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.20)',
        borderRadius: 2,
        paddingTop: 0,
        paddingBottom: 0,
        height: 30,
        color: '#fff',
        fontSize: 11
    },
    headerQRButton: {
        position: 'absolute',
        right: 5,
        paddingLeft: 0,
        paddingRight: 0
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#f9f9f9'
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(LiveJobListing)

