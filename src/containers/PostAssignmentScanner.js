'use strict'
import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, TouchableHighlight, Animated, Alert } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { RNCamera } from 'react-native-camera'
import { Container, Header, Body, Icon, StyleProvider, Button, Content } from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import * as postAssignmentActions from '../modules/postAssignment/postAssignmentActions'
import * as globalActions from '../modules/global/globalActions'
import Loader from '../components/Loader'
import { SET_POST_ASSIGNMENT_ERROR, SET_POST_SCAN_SUCCESS, } from '../lib/constants'
import { FORCE_ASSIGNED, POST_SEARCH_PLACEHOLDER, } from '../lib/ContainerConstants'
import { Piechart } from '../lib/AttributeConstants'
import * as homeActions from '../modules/home/homeActions'
import * as taskListActions from '../modules/taskList/taskListActions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

function mapStateToProps(state) {
    return {
        jobTransactionMap: state.postAssignment.jobTransactionMap,
        loading: state.postAssignment.loading,
        pendingCount: state.postAssignment.pendingCount,
        error: state.postAssignment.error,
        scanSuccess: state.postAssignment.scanSuccess,
        scanError: state.postAssignment.scanError,
        jobMaster: state.postAssignment.jobMaster
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...postAssignmentActions, ...globalActions, ...homeActions, ...taskListActions }, dispatch)
    }
}

class PostAssignmentScanner extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            showTransactionList: false,
            torchStatus: false,
            bounceValue: new Animated.Value(240),
            searchText: ''
        };
        this.animatedValue = new Animated.Value(120)
    }

    onSwipeUp(gestureState) {
        if (!this.state.showTransactionList) {
            this.setState({ showTransactionList: true })
            this._toggleTransactionView(0)
        }
    }

    onSwipeDown(gestureState) {
        if (this.state.showTransactionList) {
            this.setState({ showTransactionList: false })
            this._toggleTransactionView(240)
        }
    }

    callToast() {
        Animated.timing(
            this.animatedValue,
            {
                toValue: 0,
            }).start()
    }

    closeToast() {
        Animated.timing(
            this.animatedValue,
            {
                toValue: 120,
            }).start()
        this.props.actions.setState(SET_POST_SCAN_SUCCESS, {})
    }


    _toggleTransactionView(toValue) {
        Animated.spring(
            this.state.bounceValue,
            {
                toValue: toValue,
                velocity: 0,
                tension: 0,
                friction: 20,
            }
        ).start();
    }

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    componentDidMount() {
        this.props.actions.fetchUnseenJobs(JSON.parse(this.props.navigation.state.params.pageObject.jobMasterIds)[0])
    }

    _onBarcodeRead(barcodeResult) {
        if (!this.props.error) {
            this.props.actions.checkScannedJob(barcodeResult.data, this.props.jobTransactionMap, this.props.jobMaster, JSON.parse(this.props.navigation.state.params.pageObject.additionalParams).isForceAssignmentAllowed, this.props.pendingCount, true)
        }
    }

    getTransactionIconView(jobTransaction) {
        if (!jobTransaction.isScanned) {
            return null
        }

        if (!jobTransaction.status) {
            return (
                <Icon name="md-checkmark-circle" style={[styles.fontXl, styles.fontSuccess]} />
            )
        }

        if (jobTransaction.status == FORCE_ASSIGNED) {
            return (
                <Text> {jobTransaction.status} </Text>
            )
        }

        return (
            <View style={[styles.row]}>
                <TouchableHighlight
                    onPress={() => {
                        this.props.actions.setState(SET_POST_SCAN_SUCCESS, {
                            scanError: jobTransaction.status
                        })
                    }}
                    style={[style.helpIcon]}>
                    <Icon name="md-help" style={[styles.fontDefault]} />
                </TouchableHighlight>
                <Icon name="md-information-circle" style={[styles.fontXl, styles.fontDanger]} />
            </View>
        )
    }

    checkJobTransaction(referenceNumber, search) {
        const isForceAssignmentAllowed = JSON.parse(this.props.navigation.state.params.pageObject.additionalParams).isForceAssignmentAllowed
        if (!search && !this.props.navigation.state.params.pageObject.manualSelection) {
            return
        }
        this.props.actions.checkScannedJob(referenceNumber, this.props.jobTransactionMap, this.props.jobMaster, isForceAssignmentAllowed, this.props.pendingCount, search)
        this.setState({ searchText: '' })
    }

    getTransactionView(jobTransactionMap) {
        let transactionView = []
        for (let index in jobTransactionMap) {
            let transactionIconView = this.getTransactionIconView(jobTransactionMap[index])
            transactionView.push(
                <TouchableHighlight onPress={() => { this.checkJobTransaction(jobTransactionMap[index].referenceNumber) }} key={index}>
                    <View style={[styles.row, styles.padding10, styles.justifySpaceBetween, styles.alignCenter]}>
                        <Text style={[styles.fontBlack]}>
                            {jobTransactionMap[index].referenceNumber}
                        </Text>
                        {transactionIconView}
                    </View>
                </TouchableHighlight>
            )
        }
        return transactionView
    }

    getAlertView() {
        if (this.props.error) {
            Alert.alert('Error', this.props.error,
                [{
                    text: 'OK', onPress: () => this.props.actions.setState(SET_POST_ASSIGNMENT_ERROR, {
                        error: null
                    }), style: 'cancel'
                }],
                { cancelable: false })
        }
        return null
    }

    componentWillUnmount() {
        if (Piechart.enabled) {
            this.props.actions.pieChartCount()
        }
        this.props.actions.fetchJobs()
    }

    getSearchPlaceHolder() {
        return (
            <View style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.paddingLeft10, styles.paddingRight10]}>
                <View style={[styles.relative, { width: '100%', height: 30 }]}>
                    <TextInput
                        placeholder={POST_SEARCH_PLACEHOLDER}
                        placeholderTextColor={'rgba(255,255,255,.6)'}
                        underlineColorAndroid='transparent'
                        style={[styles.headerSearch]}
                        onChangeText={value => this.setState({ searchText: value })}
                        onSubmitEditing={event => this.checkJobTransaction(this.state.searchText, true)}
                        value={this.state.searchText} />
                    <Button onPress={() => { this.checkJobTransaction(this.state.searchText, true) }} small transparent style={[styles.inputInnerBtn]}>
                        <Icon name="md-search" style={[styles.fontWhite, styles.fontXl]} />
                    </Button>
                </View>
            </View>
        )
    }

    getHeader() {
        return (
            <SafeAreaView style={{ backgroundColor: styles.bgPrimaryColor }}>
                <Header searchBar style={StyleSheet.flatten([{ backgroundColor: styles.bgPrimaryColor }, styles.header])} hasTabs>
                    <Body>
                        <View
                            style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                            <TouchableOpacity style={[styles.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                                <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                            </TouchableOpacity>
                            <View style={[styles.headerBody]}>
                                <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.navigation.state.params.pageObject.name}</Text>
                            </View>
                            <View style={[styles.headerRight]}>
                            </View>
                        </View>
                        {this.getSearchPlaceHolder()}
                    </Body>
                </Header>
            </SafeAreaView>
        )
    }

    getCameraView() {
        return (
            <RNCamera
                ref="cam"
                flashMode={this.state.torchStatus ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
                onBarCodeRead={this._onBarcodeRead.bind(this)}
                style={style.preview}>

                <View style={{ width: 200, height: 200, justifyContent: 'space-between' }}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                        <View style={{ width: 50, height: 50, borderTopWidth: 3, borderLeftWidth: 3, borderTopColor: styles.bgPrimaryColor, borderLeftColor: styles.bgPrimaryColor }}></View>
                        <View style={{ width: 50, height: 50, borderTopWidth: 3, borderRightWidth: 3, borderTopColor: styles.bgPrimaryColor, borderRightColor: styles.bgPrimaryColor }}></View>
                    </View>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                        <View style={{ width: 50, height: 50, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomColor: styles.bgPrimaryColor, borderLeftColor: styles.bgPrimaryColor }}></View>
                        <View style={{ width: 50, height: 50, borderBottomWidth: 3, borderRightWidth: 3, borderBottomColor: styles.bgPrimaryColor, borderRightColor: styles.bgPrimaryColor }}></View>
                    </View>
                </View>
                {this.props.scanSuccess ?
                    <View style={{ width: 74, height: 74, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 167 }}>
                        <Image
                            style={style.imageSync}
                            source={require('../../images/fareye-default-iconset/syncscreen/All_Done.png')}
                        />
                    </View> : null
                }
            </RNCamera>
        )
    }

    getCameraAndGestureRecognizer() {
        return (
            <View style={[styles.relative, styles.flex1]}>
                {this.getCameraView()}
                <TouchableHighlight onPress={() => { this.setState({ torchStatus: !this.state.torchStatus }) }} style={[styles.alignCenter, styles.justifyCenter, { position: 'absolute', borderRadius: 5, top: 10, left: 10, backgroundColor: 'rgba(158, 158, 158,.6)', padding: 5 }]}>
                    <View>
                        {this.state.torchStatus ? <MaterialCommunityIcons name='flashlight' style={[styles.fontXxl, styles.padding5]} color={styles.fontBlack.color} /> : <MaterialCommunityIcons name='flashlight-off' style={[styles.fontXxl, styles.padding5]} color={styles.fontBlack.color} />}
                    </View>
                </TouchableHighlight>
                {this.state.showTransactionList ?
                    <GestureRecognizer
                        onSwipeDown={(state) => this.onSwipeDown(state)}
                        style={[styles.flex1, { position: 'absolute', backgroundColor: 'rgba(0,0,0,.8)', top: 0, bottom: 0, left: 0, right: 0 }]}>
                    </GestureRecognizer> : null
                }
            </View>
        )
    }

    render() {
        if (this.props.scanError && this.props.scanError !== '') {
            this.callToast()
        } else {
            this.closeToast()
        }
        const alertView = this.getAlertView()
        if (this.props.loading) {
            return <Loader />
        }
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    {this.getHeader()}

                    {this.getCameraAndGestureRecognizer()}

                    <Animated.View
                        style={[style.subView,
                        { transform: [{ translateY: this.state.bounceValue }] }]}
                    >
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}
                        >
                            <GestureRecognizer

                                onSwipeUp={(state) => this.onSwipeUp(state)}
                                onSwipeDown={(state) => this.onSwipeDown(state)}
                                config={{
                                    velocityThreshold: 0.1,
                                    directionalOffsetThreshold: 80
                                }}
                                style={[styles.justifyCenter, styles.width100, styles.alignCenter, styles.padding10, { backgroundColor: 'transparent' }]}>
                                <Text style={[styles.fontBlack]}>
                                    <Icon onPress={() => this.state.showTransactionList ? this.onSwipeDown(this.state) : this.onSwipeUp(this.state)} name={this.state.showTransactionList ? 'ios-arrow-down' : 'ios-arrow-up'} style={[styles.fontXxxl, styles.fontWhite]} />
                                </Text>
                            </GestureRecognizer>
                            <View style={{ width: '95%', flex: 1, backgroundColor: '#ffffff', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomColor: '#f3f3f3', borderBottomWidth: 3 }}>
                                <GestureRecognizer

                                    onSwipeUp={(state) => this.onSwipeUp(state)}
                                    onSwipeDown={(state) => this.onSwipeDown(state)}
                                    config={{
                                        velocityThreshold: 0.1,
                                        directionalOffsetThreshold: 80
                                    }}>

                                    <View style={{ backgroundColor: '#ffffff', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomColor: '#f3f3f3', borderBottomWidth: 3, paddingTop: 15, paddingBottom: 15, paddingLeft: 10, paddingRight: 10 }}>
                                        <Text style={[styles.fontBlack]}>
                                            Pending : {this.props.pendingCount}
                                        </Text>
                                    </View>
                                </GestureRecognizer>
                                <Content style={[styles.bgWhite]}>
                                    {this.getTransactionView(this.props.jobTransactionMap)}
                                </Content>
                            </View>
                        </View>
                    </Animated.View>
                    <Animated.View style={{ transform: [{ translateY: this.animatedValue }], flexDirection: 'row', height: 60, backgroundColor: '#000000', position: 'absolute', left: 0, bottom: 0, right: 0, justifyContent: 'space-between', alignItems: 'center', zIndex: 10, paddingHorizontal: 10 }}>
                        <Text style={[styles.fontLg, styles.fontWhite]}>
                            {this.props.scanError}
                        </Text>
                        <Text onPress={() => this.closeToast()} style={[styles.fontLg, styles.padding10, { color: '#FFE200' }]}>DISMISS</Text>
                    </Animated.View>
                </Container>
            </StyleProvider>
        );
    }
}

const style = StyleSheet.create({
    preview: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 100
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        marginTop: 66
    },
    button: {
        padding: 8,
    },
    directionIcon: {
        fontSize: 17,
        color: "#007AFF"
    },
    subView: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 345,
    },
    imageSync: {
        width: 74,
        height: 74,
        resizeMode: 'contain'
    },
    helpIcon: {
        width: 17,
        height: 17,
        borderRadius: 9,
        backgroundColor: '#fbfab4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 2,
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PostAssignmentScanner)