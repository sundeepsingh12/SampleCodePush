'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as globalActions from '../modules/global/globalActions'
import * as liveJobActions from '../modules/liveJob/liveJobActions'
import Loader from '../components/Loader'
import moment from 'moment'
import React, { PureComponent } from 'react'
import { StyleSheet, View, Image, TouchableHighlight, Alert, FlatList, Vibration, TouchableOpacity, TextInput, ScrollView } from 'react-native'
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
    ActionSheet,
    Toast,
    Input
} from 'native-base'

import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf'
import TitleHeader from '../components/TitleHeader'
import JobListItem from '../components/JobListItem'
import SearchBarV2 from '../components/SearchBarV2'
import {
    SET_SEARCH,
    SET_LIVE_JOB_TOAST,
    QrCodeScanner
} from '../lib/constants'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {
    INVALID_SCAN,
    LIVE_TASKS,
    NO_JOBS_PRESENT,
    FILTER_REF_NO,
    SELECT_ALL,
    ACCEPT,
    REJECT,
    SELECTED,
    OK
} from '../lib/ContainerConstants'
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

    componentDidMount() {
        this.props.actions.fetchAllLiveJobsList()
        if (this.props.navigation.state.params && this.props.navigation.state.params.callAlarm == true) {
            // Vibration.vibrate()
            this.props.navigation.state.params.callAlarm = false
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
                    liveJobList: this.props.liveJobList,
                    displayName: this.props.navigation.state.params.pageObject.name ? this.props.navigation.state.params.pageObject.name : LIVE_TASKS
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
            return moment.utc(moment(jobEndTime, "HH:mm:ss").diff(moment(currentTime, "HH:mm:ss"))).format("HH:mm:ss")
        }
    }
    toggleLiveJobSelection = (id) => {
        this.props.actions.toggleLiveJobSelection(id, this.props.liveJobList, this.props.searchText)
    }
    acceptOrRejectMultiple = (status) => {
        this.props.actions.acceptOrRejectMultiple(status, this.props.selectedItems, this.props.liveJobList)
    }
    renderList() {
        let jobMasterId = JSON.parse(this.props.navigation.state.params.pageObject.jobMasterIds)[0]
        let jobTransactionArray = []
        let jobTransactionList = this.props.liveJobList
        for (let index in jobTransactionList) {
            if (jobTransactionList[index].jobMasterId == jobMasterId && this.checkTransactionForSearchText(jobTransactionList[index])) {
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
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Header searchBar style={StyleSheet.flatten([{ backgroundColor: styles.bgPrimaryColor }, styles.header])}>
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
            </StyleProvider>
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
                        <MaterialCommunityIcons name='qrcode' style={[styles.fontXxl, styles.padding5]} color={styles.fontWhite.color} />
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
            view = <Header searchBar style={[{ backgroundColor: styles.bgPrimaryColor }, style.header]}>
                <Body>
                    <View
                        style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
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
                </Body>
            </Header>
        }
        return view
    }

    showMultipleSelectList() {
        let view
        if (this.props.selectedItems && this.props.selectedItems.length > 0) {
            view = <Header style={StyleSheet.flatten([{ backgroundColor: styles.bgPrimaryColor }, style.header])}>
                <Body>
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
                            <TouchableHighlight disabled = {_.size(this.props.liveJobList) == _.size(this.props.selectedItems)} onPress={() => this.props.actions.selectAll(this.props.liveJobList)} >
                            <Text style={[styles.fontWhite]}> {SELECT_ALL} </Text>
                            </TouchableHighlight>
                        </View>
                        {this.searchBar()}
                    </View>
                </Body>
            </Header>
        }
        return view
    }
    getSelectedReferenceNo() {
        let referenceList = ''
        this.props.selectedItems.forEach((item) => { referenceList += this.props.liveJobList[item].referenceNumber  + ",  " })
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
                </Footer>)
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
                    <StyleProvider style={getTheme(platform)}>
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
                    </StyleProvider>
                )
            }
        }
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
        height: 'auto',
        borderTopWidth: 1,
        borderTopColor: '#f9f9f9'
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(LiveJobListing)

