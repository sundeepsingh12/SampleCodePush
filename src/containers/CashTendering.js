'use strict'
import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { Container, Button, Header, Body, Content, Icon, Toast, Footer, StyleProvider } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as globalActions from '../modules/global/globalActions'
import Loader from '../components/Loader'
import { navigate } from '../modules/navigators/NavigationService';
import CashTenderingView from '../components/CashTenderingView'
import * as cashTenderingActions from '../modules/cashTendering/cashTenderingActions'
import { IS_RECEIVE_TOGGLE, CHANGE_AMOUNT, CHANGE_AMOUNT_RETURN } from '../lib/constants'
import styles from '../themes/FeStyle'
import { MORE_MONEY_TO_PAY, LESS_MONEY_TO_PAY, AMOUNT_TO_COLLECT, AMOUNT_TO_RETURN, TOTAL_AMOUNT, TOTAL_AMOUNT_RETURNING, SAVE, OK } from '../lib/ContainerConstants'

function mapStateToProps(state) {
    return {
        isCashTenderingLoaderRunning: state.cashTenderingReducer.isCashTenderingLoaderRunning,
        cashTenderingList: state.cashTenderingReducer.cashTenderingList,
        totalAmount: state.cashTenderingReducer.totalAmount,
        isReceive: state.cashTenderingReducer.isReceive,
        totalAmountReturn: state.cashTenderingReducer.totalAmountReturn,
        cashTenderingListReturn: state.cashTenderingReducer.cashTenderingListReturn,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...cashTenderingActions, ...globalActions }, dispatch)
    }
}

class CashTendering extends PureComponent {

    componentDidMount() {
        this.props.actions.fetchCashTenderingList(this.props.navigation.state.params['currentElement'].fieldAttributeMasterId)
    }

    renderData = (item) => {
        if (item.childDataList) {
            return (
                <CashTenderingView item={item} />
            )
        }
    }

    _onSavePressReturn() {
        let cashToReturn = this.props.totalAmount - this.props.navigation.state.params['cash']
        if (cashToReturn == this.props.totalAmountReturn) {
            this.props.actions.onSave(this.props.navigation.state.params['currentElement'], this.props.navigation.state.params.formLayoutState, this.props.cashTenderingList, this.props.cashTenderingListReturn, this.props.navigation.state.params['jobTransaction'], this.props.isReceive)
            this.props.actions.setState(IS_RECEIVE_TOGGLE, true)
            this.props.actions.setState(CHANGE_AMOUNT, { cashTenderingList: {}, totalAmount: 0 })
            this.props.actions.setState(CHANGE_AMOUNT_RETURN, { cashTenderingList: {}, totalAmount: 0 })
        } else if (cashToReturn > this.props.totalAmountReturn) { Toast.show({ text: MORE_MONEY_TO_PAY, position: 'bottom', buttonText: OK, duration: 3000 }) }
        else { Toast.show({ text: LESS_MONEY_TO_PAY, position: 'bottom', buttonText: OK, duration: 3000 }) }
    }

    _onSavePress() {
        if (this.props.navigation.state.params['cash'] > 0 && this.props.navigation.state.params['cash'] == this.props.totalAmount) {
            this.props.actions.onSave(this.props.navigation.state.params['currentElement'], this.props.navigation.state.params.formLayoutState, this.props.cashTenderingList, null, this.props.navigation.state.params['jobTransaction'], this.props.isReceive)
            this.props.actions.setState(CHANGE_AMOUNT, { cashTenderingList: {}, totalAmount: 0 })
        } else if (this.props.navigation.state.params['cash'] > this.props.totalAmount) {
            Toast.show({ text: MORE_MONEY_TO_PAY, position: 'bottom', buttonText: OK, duration: 3000 })
        }
        else {
            this.props.actions.getCashTenderingListReturn(JSON.parse(JSON.stringify(this.props.cashTenderingList)))
            navigate('CashTendering',
                {
                    currentElement: this.props.navigation.state.params['currentElement'],
                    formElements: this.props.navigation.state.params.formLayoutState,
                    jobTransaction: this.props.navigation.state.params['jobTransaction'],
                    cash: this.props.navigation.state.params['cash']
                })
            this.props.actions.setState(IS_RECEIVE_TOGGLE, false)
        }
    }

    _checkIfCashCollectOrReturn = () => {
        let amountToCollectOrReturn
        if (this.props.isReceive) {
            amountToCollectOrReturn = (
                <View style={[styles.paddingHorizontal10, styles.paddingVertical15, styles.bgWhite]}>
                    <Text style={[styles.fontLg, styles.fontBlack]}>{AMOUNT_TO_COLLECT} {this.props.navigation.state.params['cash']}</Text>
                </View>
            )
        } else {
            amountToCollectOrReturn = (
                <View style={[styles.paddingHorizontal10, styles.paddingVertical15, styles.bgWhite]}>
                    <Text style={[styles.fontLg, styles.fontBlack]}>{AMOUNT_TO_RETURN}  {this.props.totalAmount - this.props.navigation.state.params['cash']} </Text>
                </View>
            )
        }
        return amountToCollectOrReturn
    }

    _totalAmountInCashTenderingToCollectOrReturn = () => {
        let totalAmountInCashTendering
        if (this.props.isReceive) {
            totalAmountInCashTendering = (
                <Text
                    style={[styles.fontSm, styles.marginBottom10]}>{TOTAL_AMOUNT} {parseInt(this.props.totalAmount)}</Text>
            )
        } else {
            totalAmountInCashTendering = (
                <Text
                    style={[styles.fontSm, styles.marginBottom10]}>{TOTAL_AMOUNT_RETURNING} {parseInt(this.props.totalAmountReturn)}</Text>
            )
        }
        return totalAmountInCashTendering
    }

    showHeaderView() {
        return (
                <Header searchBar style={[{ backgroundColor: styles.bgPrimaryColor }, style.header]}>
                    <Body>
                        <View
                            style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                            <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                                <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                            </TouchableOpacity>
                            <View style={[style.headerBody]}>
                                <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{(this.props.isReceive) ? 'Collect Cash' : 'Return Cash'}</Text>
                            </View>
                            <View style={[style.headerRight]}>
                            </View>
                            <View />
                        </View>
                    </Body>
                </Header>
        )
    }

    showFlatList() {
        return (
            <Content style={[styles.flex1, styles.bgWhite, styles.marginTop5]}>
                <FlatList
                    data={(Object.values((this.props.isReceive) ? this.props.cashTenderingList : this.props.cashTenderingListReturn)).sort((fieldData_1, fieldData_2) => fieldData_1.sequence - fieldData_2.sequence)}
                    renderItem={({ item }) => this.renderData(item)}
                    keyExtractor={item => String(item.id)}
                />
            </Content>
        )
    }

    render() {
        if (this.props.isCashTenderingLoaderRunning) {
            return (
                <Loader />
            )
        }
        let totalAmountInCashTendering = this._totalAmountInCashTenderingToCollectOrReturn()
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container style={[styles.bgLightGray]}>
                    {this.showHeaderView()}
                    {this._checkIfCashCollectOrReturn()}
                    {this.showFlatList()}
                    <SafeAreaView style={[styles.bgWhite]}>
                        <Footer style={[style.footer, styles.column, styles.padding10]}>
                            {totalAmountInCashTendering}
                            <Button success full onPress={() => (this.props.isReceive) ? this._onSavePress() : this._onSavePressReturn()}>
                                <Text style={[styles.fontLg, styles.fontWhite]}>{SAVE}</Text>
                            </Button>
                        </Footer>
                    </SafeAreaView>
                </Container>
            </StyleProvider>
        )
    }
}
const style = StyleSheet.create({
    footer:{
        height:'auto'
    },
    header: {
        borderBottomWidth: 0,
        height: 'auto',
        padding: 0,
        paddingRight: 0,
        paddingLeft: 0
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
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CashTendering)