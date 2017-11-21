'use strict'
import React, { Component } from 'react'
import * as transientStatusActions from '../modules/transient/transientActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SearchBar from '../components/SearchBar'
import * as globalActions from '../modules/global/globalActions'
import renderIf from '../lib/renderIf'
import Loader from '../components/Loader'
import styles from '../themes/FeStyle'
import CheckoutDetials from '../components/CheckoutDetials'
import { View, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native'
const {
    SET_FORM_LAYOUT_STATE,
    FormLayout
} = require('../lib/constants').default
import {
    Container,
    Header,
    Button,
    Text,
    Input,
    Body,
    Icon,
    Content,
    List,
    ListItem,
    Right,
    Footer,
    FooterTab
} from 'native-base';
import _ from 'lodash'
import {
    EXTERNAL_DATA_STORE,
} from '../lib/AttributeConstants'
import CustomAlert from "../components/CustomAlert"

function mapStateToProps(state) {
    return {
        formLayoutStates: state.transientStatus.formLayoutStates,
        currentStatus: state.transientStatus.currentStatus,
        savedJobDetails: state.transientStatus.savedJobDetails,
        loaderRunning: state.transientStatus.loaderRunning,
        isCheckoutVisible: state.transientStatus.isCheckoutVisible,
        checkoutData: state.transientStatus.checkoutData,
    }
};

/*
 * Bind all the actions
 */
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...transientStatusActions, ...globalActions }, dispatch)
    }
}

class TransientStatus extends Component {

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    componentDidMount() {
        console.log('TransientStatus', this.props.navigation.state.params)
        this.props.actions.setStateFromNavigationParams(
            this.props.navigation.state.params.formLayoutState,
            this.props.formLayoutStates,
            this.props.navigation.state.params.currentStatus,
            this.props.navigation.state.params.formElement,
            this.props.navigation.state.params.jobTransaction,
            this.props.savedJobDetails
        )
    }

    navigateToFormLayout = (statusId, statusName) => {
        this.props.actions.navigateToScene(FormLayout, {
            contactData: this.props.navigation.state.params.contactData,
            jobTransactionId: this.props.navigation.state.params.jobTransaction.id,
            jobTransaction: this.props.navigation.state.params.jobTransaction,
            statusId,
            statusName,
            jobMasterId: this.props.navigation.state.params.jobMasterId,
            navigationFormLayoutStates: this.props.formLayoutStates,
        })
    }

    goBack = () => {
        this.props.actions.setState(SET_FORM_LAYOUT_STATE,
            this.props.formLayoutStates[this.props.currentStatus.id])
        this.props.navigation.goBack(null)
    }

    renderData = (item) => {
        console.log('color status', item)
        return (
            <ListItem style={[style.jobListItem]} onPress={() => this.navigateToFormLayout(item.id, item.name)}>
                <View style={[styles.row, styles.alignCenter]}>
                    <View style={item.statusCategory == 3 ? [style.statusCircle, { backgroundColor: '#4cd964' }] :
                        item.statusCategory == 1 ? [style.statusCircle, { backgroundColor: '#006490' }] :
                            [style.statusCircle, { backgroundColor: '#FF3B30' }]}></View>
                    <Text style={[styles.fontDefault, styles.fontWeight500, styles.marginLeft10]}>{item.name}</Text>
                </View>
                <Right>
                    <Icon name="ios-arrow-forward" style={[styles.fontDefault, styles.fontBlack]} />
                </Right>
            </ListItem>
        )
    }

    deleteSingleTransaction = (...jobTransactionId) => {
        // console.log('item deleted', jobId)
        this.props.actions.deleteTransaction(jobTransactionId[0], this.props.savedJobDetails)
    }

    deleteAllTransactions = (...savedJobDetails) => {
        // console.log('item deleted', savedJobDetails)
        this.props.actions.deleteAllTransactions(savedJobDetails[0])
    }


    showAlert(title, message, positiveButtonText, negativeButtonText, actionOnPositiveButton, ...params) {
        Alert.alert(
            title,
            message,
            [
                { text: negativeButtonText, style: 'cancel' },
                { text: positiveButtonText, onPress: () => actionOnPositiveButton(params) },
            ],
        )
    }

    checkout = () => {
        console.log('checkout')
        this.props.actions.showCheckOutDetails(this.props.formLayoutStates, this.props.savedJobDetails)
    }

    renderDataForShow = (item) => {
        return (
            <ListItem style={[style.jobListItem]}>
                <View style={[styles.flex1]}>
                    <Text style={[styles.fontDefault, styles.fontWeight500, styles.alignSelfStart]}>{item.textToShow}</Text>
                </View>
                <Icon name="md-close" style={[styles.fontDanger, styles.fontXl, styles.padding10]}
                    onPress={() => this.showAlert(
                        'Warning !',
                        'Do you want to delete this job.',
                        'Confirm',
                        'Cancel',
                        this.deleteSingleTransaction,
                        item.jobTransactionId)} />
            </ListItem>
        )
    }

    addToSyncList = () => {
        this.props.actions.addToSyncList(Object.keys(this.props.savedJobDetails))
    }

    _keyExtractor = (item, index) => item.id;

    _keyExtractorShow = (item, index) => item.jobTransactionId

    render() {
        console.log('render', this.props)
        if (this.props.loaderRunning) {
            return (
                <Loader />
            )
        }
        if (!_.isEmpty(this.props.checkoutData)) {
            return (<CheckoutDetials
                data={this.props.checkoutData}
                addToSyncList={this.addToSyncList} />)
        }
        return (
            <Container>
                <Header style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
                    <Body>
                        <View style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                            {renderIf(_.isEmpty(this.props.savedJobDetails),
                                <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                                    <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                                </TouchableOpacity>
                            )}
                            {renderIf(!_.isEmpty(this.props.savedJobDetails),
                                <View style={[style.headerLeft]}>
                                </View>
                            )}
                            <View style={[style.headerBody]}>
                                <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>
                                    {this.props.currentStatus.name}
                                </Text>
                            </View>
                            <View style={[style.headerRight]}>
                                {renderIf(!_.isEmpty(this.props.savedJobDetails),
                                    <Icon name="md-trash" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]}
                                        onPress={() => this.showAlert(
                                            'Warning !',
                                            'Do you want to delete all jobs.',
                                            'Confirm',
                                            'Cancel',
                                            this.deleteAllTransactions,
                                            this.props.savedJobDetails)} />
                                )}
                            </View>
                        </View>
                    </Body>
                </Header>


                <Content style={[styles.bgWhite]}>
                    {renderIf(!_.isEmpty(this.props.savedJobDetails),
                        <View style={[styles.flexBasis75]}>
                            <Text style={[styles.fontSm, styles.fontPrimary, styles.padding15]}>Transaction List</Text>
                            <List style={[styles.flex1]}>
                                <FlatList
                                    data={Object.values(this.props.savedJobDetails)}
                                    extraData={this.state}
                                    renderItem={(item) => this.renderDataForShow(item.item)}
                                    keyExtractor={this._keyExtractorShow}>
                                </FlatList>
                            </List>
                        </View>
                    )}
                    <View style={[styles.flexBasis25]}>
                        <Text style={[styles.fontSm, styles.fontPrimary, styles.padding15]}>Select Next Status</Text>
                        <List style={[styles.flex1]}>
                            <FlatList
                                data={this.props.currentStatus.nextStatusList}
                                extraData={this.state}
                                renderItem={(item) => this.renderData(item.item)}
                                keyExtractor={this._keyExtractor}>
                            </FlatList>
                        </List>
                    </View>
                </Content>
                {renderIf(this.props.isCheckoutVisible && !_.isEmpty(this.props.savedJobDetails),
                    <Footer style={{ height: 'auto', backgroundColor: 'white' }}>
                        <FooterTab style={StyleSheet.flatten([styles.padding5, styles.bgWhite])}>
                            <Button success full style={styles.bgPrimary} onPress={() => this.showAlert(
                                'Confirm !',
                                'Do you want to checkout.',
                                'Confirm',
                                'Cancel',
                                this.checkout)}>
                                <Text style={[styles.fontLg, styles.fontWhite]}>Checkout ({_.size(this.props.savedJobDetails)})</Text>
                            </Button>
                        </FooterTab>
                    </Footer>)
                }
            </Container>
        )
    }
}

const style = StyleSheet.create({
    jobListItem: {
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        paddingTop: 20,
        paddingBottom: 20,
        justifyContent: 'space-between'
    }
});
/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(TransientStatus)
