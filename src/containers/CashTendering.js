'use strict'
import React, { Component } from 'react'
import { StyleSheet, View, Text, FlatList } from 'react-native'
import { Container, Button, Content, Card, CardItem, Toast } from 'native-base';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ARRAY_SAROJ_FAREYE } from '../lib/AttributeConstants'
import { FormLayout } from '../lib/constants'
import * as globalActions from '../modules/global/globalActions'
import Loader from '../components/Loader'
import CashTenderingView from '../components/CashTenderingView'
import * as cashTenderingActions from '../modules/cashTendering/cashTenderingActions'
import { IS_RECEIVE_TOGGLE, CHANGE_AMOUNT, CHANGE_AMOUNT_RETURN } from '../lib/constants'

let styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
})

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

class CashTendering extends Component {

    componentDidMount() {
        if (this.props.isReceive) {
            this.props.actions.fetchCashTenderingList(this.props.navigation.state.params['currentElement'].fieldAttributeMasterId)
        } else {
            this.props.actions.getCashTenderingListReturn(JSON.parse(JSON.stringify(this.props.cashTenderingList)))
        }
    }

    renderData = (item) => {
        if (item.childDataList) {
            return (
                <CashTenderingView item={item} />
            )
        }
    }

    _onSavePressReturn = () => {
        let cashToReturn = this.props.totalAmount - this.props.navigation.state.params['cash']
        if (cashToReturn == this.props.totalAmountReturn) {
            this.props.actions.onSave(this.props.navigation.state.params['currentElement'], this.props.navigation.state.params['formElements'], this.props.cashTenderingList, this.props.cashTenderingListReturn, this.props.navigation.state.params['isSaveDisabled'], this.props.navigation.state.params['latestPositionId'], this.props.navigation.state.params['jobTransaction'].id, this.props.isReceive)
            this.props.actions.setState(IS_RECEIVE_TOGGLE, true)
            this.props.actions.setState(CHANGE_AMOUNT, { cashTenderingList: {}, totalAmount: 0 })
            this.props.actions.setState(CHANGE_AMOUNT_RETURN, { cashTenderingList: {}, totalAmount: 0 })
            this.props.navigation.goBack('FormLayout')
        } else if (cashToReturn > this.props.totalAmountReturn) { Toast.show({ text: "More money to pay", position: 'bottom', buttonText: 'Okay' }) }
        else { Toast.show({ text: "Less money to pay", position: 'bottom', buttonText: 'OK' }) }
    }

    _onSavePress = () => {
        if (this.props.navigation.state.params['cash'] > 0 && this.props.navigation.state.params['cash'] == this.props.totalAmount) {
            this.props.actions.onSave(this.props.navigation.state.params['currentElement'], this.props.navigation.state.params['formElements'], this.props.cashTenderingList, null, this.props.navigation.state.params['isSaveDisabled'], this.props.navigation.state.params['latestPositionId'], this.props.navigation.state.params['jobTransaction'].id, this.props.isReceive)
            this.props.actions.setState(CHANGE_AMOUNT, { cashTenderingList: {}, totalAmount: 0 })
            this.props.navigation.goBack()
        } else if (this.props.navigation.state.params['cash'] > this.props.totalAmount) {
            Toast.show({ text: "More, money to pay", position: 'bottom', buttonText: 'OK' })
        }
        else {
            this.props.actions.setState(IS_RECEIVE_TOGGLE, false)
            this.props.actions.navigateToScene('CashTendering',
                {
                    currentElement: this.props.navigation.state.params['currentElement'],
                    formElements: this.props.navigation.state.params['formElements'],
                    jobStatusId: this.jobStatusId,
                    jobTransaction: this.props.navigation.state.params['jobTransaction'],
                    latestPositionId: this.props.navigation.state.params['latestPositionId'],
                    isSaveDisabled: this.props.navigation.state.params['isSaveDisabled'],
                    cash: this.props.navigation.state.params['cash']
                }
            )
        }
    }

    render() {
        if (this.props.isCashTenderingLoaderRunning) {
            return (
                <Loader />
            )
        }

        if (this.props.isReceive) {

            return (
                <Container>
                    <View style={styles.container}>
                        <Content>
                            <Card style={{ flexDirection: 'row' }}>
                                <CardItem >
                                    <Text>Amount to Collect:  {this.props.navigation.state.params['cash']}</Text>
                                </CardItem>
                            </Card>
                        </Content>
                        <FlatList
                            data={(Object.values(this.props.cashTenderingList)).
                                sort((fieldData_1, fieldData_2) =>
                                    fieldData_1.sequence - fieldData_2.sequence
                                )}
                            renderItem={({ item }) => this.renderData(item)}
                            keyExtractor={item => item.id}
                        />
                        <Text style={{ marginBottom: 10, marginTop: 10 }}>
                            Total Amount : {parseInt(this.props.totalAmount)}
                        </Text>
                        <Button onPress={this._onSavePress}>
                            <Text style={{ textAlign: 'center', width: '100%', color: 'white' }}>
                                Save
                        </Text>
                        </Button>
                    </View>
                </Container>
            )
        } else {
            return (
                <Container>
                    <View style={styles.container}>
                        <Content>
                            <Card style={{ flexDirection: 'row' }}>
                                <CardItem >
                                    <Text>Amount to Return:  {this.props.totalAmount - this.props.navigation.state.params['cash']} </Text>
                                </CardItem>
                            </Card>
                        </Content>
                        <FlatList
                            data={(Object.values(this.props.cashTenderingListReturn)).sort((fieldData_1, fieldData_2) => fieldData_1.sequence - fieldData_2.sequence)}
                            renderItem={({ item }) => this.renderData(item)}
                            keyExtractor={item => item.id}
                        />
                        <Text style={{ marginBottom: 10, marginTop: 10 }}>
                            Total Amount To Return : {parseInt(this.props.totalAmountReturn)}
                        </Text>
                        <Button
                            onPress={this._onSavePressReturn}>
                            <Text style={{ textAlign: 'center', width: '100%', color: 'white' }}>
                                Save
                        </Text>
                        </Button>
                    </View>
                </Container>
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CashTendering)