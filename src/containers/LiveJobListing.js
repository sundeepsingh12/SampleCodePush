'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as globalActions from '../modules/global/globalActions'
import * as liveJobActions from '../modules/liveJob/liveJobActions'
import Loader from '../components/Loader'
import moment from 'moment'
import React, { PureComponent } from 'react'
import { StyleSheet, View, Image, TouchableHighlight, Alert, FlatList, Vibration, TouchableOpacity } from 'react-native'
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
    Toast
} from 'native-base'

import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf'
import TitleHeader from '../components/TitleHeader'
import JobListItem from '../components/JobListItem'
import SearchBarV2 from '../components/SearchBarV2'
import {
    SET_SEARCH
} from '../lib/constants'
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

    componentWillMount() {
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
                buttonText: 'Okay',
            })
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
    renderList() {
        if (!this.props.searchText || this.props.searchText == '') {
            return Object.values(this.props.liveJobList)
        }
        else {
            let jobTransactionArray = []
            let searchText = this.props.searchText
            _.forEach(this.props.liveJobList, function (value) {
                let values = [value.referenceNo]
                if (_.some(values, (data) => _.includes(_.toLower(data), _.toLower(searchText)))) {
                    jobTransactionArray.push(value)
                }
            })
            return jobTransactionArray;
        }
    }

    render() {
        let headerView = this.props.navigation.state.params.displayName ? this.props.navigation.state.params.displayName : 'Live Tasks'
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
                                    <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>{headerView}</Text>
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
                            {renderIf(!this.props.selectedItems || this.props.selectedItems.length <= 0,
                                <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
                                    <Body>
                                        <View
                                            style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                                            <TouchableOpacity style={[style.headerLeft]} onPress={() => {
                                                this.props.navigation.goBack(null)
                                            }}>
                                                <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                                            </TouchableOpacity>
                                            <View style={[style.headerBody]}>
                                                <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>Live Tasks</Text>
                                            </View>
                                            <View style={[style.headerRight]}>
                                            </View>
                                            <View />
                                        </View>
                                        <SearchBarV2 placeholder='Filter Reference Numbers' setSearchText={(searchText) => this.props.actions.setState(SET_SEARCH, searchText)} navigation={this.props.navigation} returnValue={(searchText) => this.props.actions.setState(SET_SEARCH, searchText)} searchText={this.props.searchText} />
                                    </Body>
                                </Header>
                            )}
                            {renderIf(this.props.selectedItems && this.props.selectedItems.length > 0,
                                <Header style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
                                    <Body>
                                        <View style={[styles.column, { alignSelf: 'stretch' }]}>
                                            <View style={[styles.row, styles.justifySpaceBetween, styles.alignCenter, styles.paddingLeft10, styles.paddingRight10]}>
                                                <View style={[styles.row, styles.justifySpaceAround, styles.alignCenter]}>
                                                    <TouchableOpacity
                                                        style={[styles.margin5, styles.padding10, styles.paddingLeft0]}
                                                        onPress={() => {
                                                            this.props.actions.selectNone(this.props.liveJobList)
                                                        }}>
                                                        <Icon name="md-close" style={[styles.fontWhite, styles.fontXl]} />
                                                    </TouchableOpacity>
                                                    <Text style={[styles.fontWhite]}> {this.props.selectedItems.length + ' Selected'} </Text>
                                                </View>
                                                <Text style={[styles.fontWhite]} onPress={() => this.props.actions.selectAll(this.props.liveJobList)}> SELECT ALL </Text>
                                            </View>
                                            <View style={[styles.row]}>
                                                <Text style={[styles.fontWhite, styles.padding10]} onPress={() => this.acceptOrRejectMultiple(1)}> ACCEPT </Text>
                                                <Text style={[styles.fontWhite, styles.padding10]} onPress={() => this.acceptOrRejectMultiple(2)}> REJECT </Text>
                                            </View>
                                        </View>
                                    </Body>
                                </Header>
                            )}
                            <FlatList
                                data={this.renderList()}
                                renderItem={({ item }) => this.renderData(item)}
                                keyExtractor={item => String(item.id)}
                            />
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
        paddingBottom: 10
    },
    headerLeft: {
        width: '15%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    headerBody: {
        width: '70%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    headerRight: {
        width: '15%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    headerSearch: {
        paddingLeft: 10,
        paddingRight: 30,
        backgroundColor: '#1260be',
        borderRadius: 2,
        height: 40,
        color: '#fff',
        fontSize: 14
    },
    headerQRButton: {
        position: 'absolute',
        right: 5,
        paddingLeft: 0,
        paddingRight: 0
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(LiveJobListing)

