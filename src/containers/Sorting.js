
'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Loader from '../components/Loader'
import renderIf from '../lib/renderIf'
import QRCode from 'react-native-qrcode-svg'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import _ from 'lodash'
import { NA } from '../lib/AttributeConstants'
import * as sortingActions from '../modules/sorting/sortingActions'
import * as globalActions from '../modules/global/globalActions'
import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native'
import { Container, Content, Header, Button, Text, Input, Body, Icon, StyleProvider, Toast, ActionSheet } from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import { SORTING_SEARCH_VALUE, QrCodeScanner, DEFAULT_ERROR_MESSAGE_IN_SORTING, SORTING_INITIAL_STATE, BluetoothListing } from '../lib/constants'
import { SORTING, SEARCH_INFO, POST_SEARCH_PLACEHOLDER, OK, STOP, DEPOT, SEARCH_RESULT, ADDRESS } from '../lib/ContainerConstants'
import BluetoothSerial from 'react-native-bluetooth-serial';
import BluetoothSorting from '../components/BluetoothSorting';
import { navigate } from '../modules/navigators/NavigationService';
import { EscPos } from 'escpos-xml';

function mapStateToProps(state) {
    return {
        searchRefereneceValue: state.sorting.searchRefereneceValue,
        sortingDetails: state.sorting.sortingDetails,
        loaderRunning: state.sorting.loaderRunning,
        errorMessage: state.sorting.errorMessage,
        isBluetoothConnected: state.sorting.isBluetoothConnected
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...sortingActions, ...globalActions }, dispatch)
    }
}
class SortingListing extends PureComponent {

    renderData = (item) => {
        return (
            <View>
                {renderIf(item.value != NA && !(_.isEmpty(item.label)),
                    <View style={[styles.marginBottom5]}>
                        <Text style={[styles.fontXs, styles.fontDarkGray, styles.fontWeight300, styles.lineHeight20]}>
                            {item.label}
                        </Text>
                        <Text
                            style={[styles.fontDefault, styles.fontWeight300, styles.lineHeight20]}>
                            {item.value}
                        </Text>
                    </View>
                )}
            </View>
        )
    }

    showSearchResultTitle() {
        return (
            <View style={[style.card, styles.row, styles.paddingTop15, styles.paddingBottom10]}>
                <Text>
                    {SEARCH_RESULT}
                </Text>
            </View>
        )
    }

    showQrCodeLogo() {
        return (
            <View style={style.qrBox}>
                <QRCode
                    value={this.props.sortingDetails[0].value}
                    size={68}
                    logoBackgroundColor='transparent'
                />
            </View>
        )
    }

    async printSortingData() {
        let a = null
        let data = {
            feName: this.props.sortingDetails[1].value,
            sequenceNumber: `${STOP}   :  ` + this.props.sortingDetails[3].value,
            hub: `${DEPOT}   :  ` + this.props.sortingDetails[2].value.split('/')[1].toLocaleUpperCase(),
        }
        if(this.props.sortingDetails[4]) {
            data.address = `${ADDRESS} : ` + this.props.sortingDetails[4].value;
        }
        let sortingXmlData = `
        <?xml version="1.0" encoding="UTF-8"?>
        <document>
        <line-feed />
        <align mode="center">
            <text-line size="1:0">{{feName}}</text-line>
            <line-feed />
            <text-line size="1:0">{{sequenceNumber}}</text-line>
            <line-feed />
            <text-line size="1:0">{{hub}}</text-line>
            <line-feed />
            <text-line size="1:0">{{address}}</text-line>
            <line-feed />
        </align>
        </document>
        `
        const buffer = EscPos.getBufferFromTemplate(sortingXmlData, data);
        await BluetoothSerial.write(this.props.sortingDetails[0].value, 150);
        await BluetoothSerial.write(buffer, 0);
    }

    render() {
        this.printSortingData()
        return (
            <View style={[styles.bgWhite]}>
                {this.showSearchResultTitle()}
                <View style={style.resultCard}>
                    {this.showQrCodeLogo()}
                    <View style={style.resultCardDetail}>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: '#f3f3f3', marginBottom: 10, paddingBottom: 10 }}>
                            <Text style={[styles.fontDefault]}>
                                {this.props.sortingDetails[0].value}
                            </Text>
                        </View>
                        <View>
                            <FlatList
                                data={(Object.values(this.props.sortingDetails))}
                                renderItem={({ item }) => this.renderData(item)}
                                keyExtractor={item => String(item.id)}
                            />
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

class Sorting extends PureComponent {

    static navigationOptions = () => {
        return { header: null };
    }

    componentDidUpdate() {
        if (_.size(this.props.errorMessage)) {
            Toast.show({
                text: this.props.errorMessage,
                position: 'bottom',
                buttonText: OK,
                type: 'danger',
                duration: 5000,
                onClose: this._setDefaultErrorMessage
            })
        }
    }

    componentWillUnmount() {
        this.props.actions.setState(SORTING_INITIAL_STATE, {})
    }

    _setDefaultErrorMessage = () => {
        this.props.actions.setState(DEFAULT_ERROR_MESSAGE_IN_SORTING, '')
    }

    _onChangeReferenceValue = (value) => {
        this.props.actions.setState(SORTING_SEARCH_VALUE, { value })
    }

    _searchForReferenceValue = (value) => {
        this.props.actions.getDataForSortingAndPrinting(value)
    }

    _renderContent() {
        if (this.props.loaderRunning) {
            return <Loader />
        }
        if (((this.props.searchRefereneceValue === '') && !(_.isEmpty(this.props.sortingDetails)) && this.props.sortingDetails[0].value !== NA)) {
            return <SortingListing sortingDetails={this.props.sortingDetails} />
        } else {
            return <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                <Text style={[styles.margin30, styles.fontDefault, styles.fontDarkGray]}>{SEARCH_INFO}</Text>
            </View>
        }
    }

    showReferenceNoInputView() {
        return (
            <View style={[styles.relative, { width: '85%', height: 33, zIndex: 1 }]}>
                <Input
                    value={this.props.searchRefereneceValue.value}
                    onChangeText={this._onChangeReferenceValue}
                    placeholder={POST_SEARCH_PLACEHOLDER}
                    returnKeyType={"search"}
                    keyboardAppearance={"dark"}
                    placeholderTextColor={'rgba(255,255,255,.6)'}
                    selectionColor={'rgba(224, 224, 224,.5)'}
                    underlineColorAndroid={'transparent'}
                    style={[style.headerSearch]}
                    onSubmitEditing={() => this._searchForReferenceValue(this.props.searchRefereneceValue.value)}
                />
                <Button small transparent style={[style.inputInnerBtn]} onPress={() => this._searchForReferenceValue(this.props.searchRefereneceValue.value)}>
                    <Icon name="md-search" style={[styles.fontWhite, styles.fontXl]} />
                </Button>
            </View>
        )
    }

    showTitleAndBackArrow() {
        let headerView = this.props.navigation.state.params.displayName ? this.props.navigation.state.params.displayName : SORTING
        return (
            <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack() }}>
                    <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                </TouchableOpacity>
                <View style={[style.headerBody]}>
                    <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{headerView}</Text>
                </View>
                <TouchableOpacity style={[style.headerRight]} onPress={() => { this.showOptionMenu() }}>
                    {this.props.isBluetoothConnected ?
                        <Icon name="ios-more" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                        : null}
                </TouchableOpacity>
            </View>
        )
    }

    showOptionMenu() {
        let optionMenu = ['BluetoothSetup', 'Cancel']
        ActionSheet.show(
            {
                options: optionMenu,
                cancelButtonIndex: optionMenu.length - 1,
                title: 'Select'
            },
            buttonIndex => {
                if (buttonIndex != optionMenu.length - 1 && buttonIndex >= 0) {
                    navigate(BluetoothListing)
                }
            }
        )
    }

    render() {
        const renderView = this._renderContent();
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Header searchBar style={[{ backgroundColor: styles.bgPrimaryColor }, style.header]}>
                        <Body>
                            {this.showTitleAndBackArrow()}
                            {this.props.isBluetoothConnected ?
                                <View style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.paddingLeft10, styles.paddingRight10, styles.paddingBottom10]}>
                                    {this.showReferenceNoInputView()}
                                    <TouchableOpacity style={[{ width: '15%' }, styles.marginLeft15]} onPress={() => this.props.navigation.navigate(QrCodeScanner, { returnData: this._searchForReferenceValue.bind(this) })} >
                                        <MaterialCommunityIcons name='qrcode' style={[styles.fontXxl, styles.padding5]} color={styles.fontWhite.color} />
                                    </TouchableOpacity>
                                </View>
                                : null}
                        </Body>
                    </Header>
                    {this.props.isBluetoothConnected ?
                        <Content style={[styles.flex1, styles.bgLightGray]}>
                            {renderView}
                        </Content> : <BluetoothSorting />
                    }
                </Container>
            </StyleProvider>
        )
    }
};

const style = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        height: 'auto',
        padding: 0,
        paddingRight: 0,
        paddingLeft: 0
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
    headerIcon: {
        width: 24
    },
    loadar: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerSearch: {
        paddingLeft: 10,
        paddingRight: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.20)',
        borderRadius: 2,
        lineHeight: 10,
        paddingTop: 0,
        paddingBottom: 0,
        height: 30,
        color: '#fff',
        fontSize: 11
    },
    inputInnerBtn: {
        position: 'absolute',
        top: 0,
        right: 5,
        paddingLeft: 0,
        paddingRight: 0
    },
    card: {
        paddingLeft: 10,
        backgroundColor: '#ffffff',
        elevation: 1,
        shadowColor: '#d3d3d3',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 2
    },
    resultCard: {
        minHeight: 70,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 10,
        paddingLeft: 10,
        backgroundColor: '#fff'
    },
    qrBox: {
        width: 68,
        height: 68,
        backgroundColor: '#ffcc00',
        justifyContent: 'center',
        alignItems: 'center'
    },
    resultCardDetail: {
        flex: 1,
        minHeight: 70,
        paddingBottom: 10,
        marginLeft: 15,
        flexDirection: 'column',
        justifyContent: 'space-between'
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(Sorting)
