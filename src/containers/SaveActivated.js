'use strict'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as globalActions from '../modules/global/globalActions'
import * as saveActivatedActions from '../modules/saveActivated/saveActivatedActions'

import renderIf from '../lib/renderIf'
import Loader from '../components/Loader'


import { StyleSheet, View, TouchableOpacity, FlatList, Alert } from 'react-native'

import {
    Container,
    Content,
    Header,
    Button,
    Text,
    Body,
    Right,
    Icon,
    List,
    ListItem,
    StyleProvider,
    Footer,
    FooterTab
} from 'native-base';

import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import CheckoutDetails from '../containers/CheckoutDetails'
import ReviewSaveActivatedDetails from '../components/ReviewSaveActivatedDetails'
import {
    FormLayout,
    Discard,
    Keep,
    Cancel,
    Checkout,
    SHOW_DISCARD_ALERT,
    SET_SAVE_ACTIVATED_DRAFT
} from '../lib/constants'
import {
    Yes_Checkout,
    Total,
} from '../lib/AttributeConstants'

import {
    Discard_these_jobs,
    Do_you_want_to_checkout,
    EDIT
} from '../lib/ContainerConstants'
import DraftModal from '../components/DraftModal'
import _ from 'lodash'

function mapStateToProps(state) {
    return {
        commonData: state.saveActivated.commonData,
        recurringData: state.saveActivated.recurringData,
        isSignOffVisible: state.saveActivated.isSignOffVisible,
        loading: state.saveActivated.loading,
        headerTitle: state.saveActivated.headerTitle,
        showDiscardAlert: state.saveActivated.showDiscardAlert,
        draftStatusInfo: state.saveActivated.draftStatusInfo
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...saveActivatedActions }, dispatch)
    }
}

class SaveActivated extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            isDetailPageVisible: false,
            detailPageData: '',
            isEditVisible: false,
            headerTitle: '',
            itemId: 0
        }
    }

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    componentDidUpdate() {
        if (this.props.showDiscardAlert) {
            this.discardAlert()
            this.props.actions.setState(SHOW_DISCARD_ALERT, false)
        }
    }

    componentDidMount() {
        if (!this.props.navigation.state.params.calledFromNewJob) {
            this.props.actions.addTransactionAndPopulateView(
                this.props.navigation.state.params.formLayoutState,
                this.props.recurringData,
                this.props.commonData,
                this.props.headerTitle, {
                    jobTransaction: this.props.navigation.state.params.jobTransaction,
                    contactData: this.props.navigation.state.params.contactData,
                    currentStatus: this.props.navigation.state.params.currentStatus,
                    jobMasterId: this.props.navigation.state.params.jobMasterId
                },
                this.props.navigation.state.params.navigationFormLayoutStates
            )
        }
        this.props.actions.checkIfDraftExists(this.props.navigation.state.params.jobMasterId)
    }

    signOff = (statusId) => {
        this.props.actions.navigateToScene(FormLayout, {
            contactData: this.props.navigation.state.params.contactData,
            jobTransactionId: this.props.navigation.state.params.jobTransaction.id,
            jobTransaction: this.props.navigation.state.params.jobTransaction,
            statusId,
            statusName: Checkout,
            jobMasterId: this.props.navigation.state.params.jobMasterId,
            navigationFormLayoutStates: this.props.navigation.state.params.navigationFormLayoutStates,
            saveActivatedStatusData: {
                commonData: this.props.commonData,
                recurringData: this.props.recurringData,
            }
        })
    }

    navigateToFormLayout = (statusId, statusName) => {
        let cloneJobTransaction = _.cloneDeep(this.props.navigation.state.params.jobTransaction)
        let lastIndex = parseInt(_.findLastKey(this.props.recurringData))
        if (!lastIndex) {
            lastIndex = 0
        }
        cloneJobTransaction.jobId = cloneJobTransaction.id = --lastIndex
        this.props.actions.navigateToScene(FormLayout, {
            contactData: this.props.navigation.state.params.contactData,
            jobTransactionId: cloneJobTransaction.id,
            jobTransaction: cloneJobTransaction,
            statusId,
            statusName,
            jobMasterId: this.props.navigation.state.params.jobMasterId,
            navigationFormLayoutStates: this.props.navigation.state.params.navigationFormLayoutStates,
        })
    }

    _discard = () => {
        this.props.actions.clearStateAndStore(this.props.navigation.state.params.jobMasterId)
    }

    _goBack = () => {
        this.discardAlert()
    }

    discardAlert() {
        Alert.alert(
            Discard_these_jobs,
            '',
            [
                { text: Discard, onPress: () => this._discard() },
                { text: Keep, style: 'cancel' },
            ],
        )
    }

    _keyExtractor = (item, index) => String(item.id);


    renderData = (item) => {
        return (
            <View style={[styles.row]}>
                <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                    <Text style={[styles.fontDefault]}>{item.label}</Text>
                </View>
                <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                    <Text style={[styles.fontDefault, styles.fontBlack]}>{item.value}</Text>
                </View>
            </View>
        )
    }

    renderRecurringData = (item, textCounter) => {
        let showText = (item.textToShow) ? item.textToShow : textCounter
        return (
            <View style={[styles.bgWhite, { borderBottomColor: '#f5f5f5', borderBottomWidth: 1 }]}>
                <ListItem style={[style.jobListItem, styles.justifySpaceBetween]} >
                    <TouchableOpacity style={[styles.flexBasis90, styles.row, styles.alignCenter]}
                        onPress={() => { this.review(true, item.fieldDataArray, true, item.textToShow, item.id) }}>
                        <Text style={[styles.fontDefault]}>{showText}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.flexBasis10]}
                        onPress={() => {
                            this.props.actions.deleteItem(
                                item.id,
                                this.props.recurringData,
                                this.props.commonData, {
                                    navigationFormLayoutStates: this.props.navigation.state.params.navigationFormLayoutStates,
                                    jobTransaction: this.props.navigation.state.params.jobTransaction,
                                    contactData: this.props.navigation.state.params.contactData,
                                    currentStatus: this.props.navigation.state.params.currentStatus,
                                    jobMasterId: this.props.navigation.state.params.jobMasterId
                                },
                                this.props.headerTitle
                            )
                        }}>
                        <Icon name="md-trash" style={[styles.fontXl, styles.fontDarkGray, styles.alignSelfCenter]} />
                    </TouchableOpacity>
                </ListItem>
            </View>
        )
    }

    showAlert() {
        Alert.alert(
            Do_you_want_to_checkout,
            '',
            [
                { text: Cancel, style: 'cancel' },
                { text: Yes_Checkout, onPress: () => this.checkout() },
            ],
        )
    }

    checkout = () => {
        this.props.actions.checkout(
            this.props.navigation.state.params.navigationFormLayoutStates,
            this.props.recurringData,
            this.props.navigation.state.params.jobMasterId,
            this.props.commonData,
            this.props.navigation.state.params.currentStatus.id
        )
    }

    review = (isDetailPageVisible, detailPageData, isEditVisible, headerTitle, itemId) => {
        this._setSearchVisibility(
            isDetailPageVisible,
            detailPageData,
            isEditVisible,
            headerTitle,
            itemId
        )
    }

    _setSearchVisibility = (isDetailPageVisible, detailPageData, isEditVisible, headerTitle, itemId) => {
        this.setState(previousState => {
            return {
                isDetailPageVisible,
                detailPageData,
                isEditVisible,
                headerTitle,
                itemId
            }
        })
    }

    _edit = (itemId) => {
        this.review(false, {})
        let jobTransaction = {
            id: itemId,
            jobMasterId: this.props.navigation.state.params.jobMasterId,
            jobId: itemId,
        }
        this.props.actions.navigateToScene(FormLayout, {
            contactData: this.props.navigation.state.params.contactData,
            jobTransactionId: itemId,
            jobTransaction,
            statusId: this.props.navigation.state.params.currentStatus.id,
            statusName: EDIT,
            jobMasterId: this.props.navigation.state.params.jobMasterId,
            navigationFormLayoutStates: this.props.navigation.state.params.navigationFormLayoutStates,
            editableFormLayoutState: this.props.recurringData[itemId].formLayoutState
        })
    }
    draftOkPress = () => {
        this.props.actions.restoreDraft(this.props.draftStatusInfo, this.props.navigation.state.params.contactData, this.props.recurringData, this.props.navigation.state.params.jobMasterId, this.props.navigation.state.params.navigationFormLayoutStates)
    }
    draftModal() {
        if (!_.isEmpty(this.props.draftStatusInfo)) {
            return <DraftModal draftStatusInfo={this.props.draftStatusInfo} onOkPress={this.draftOkPress} onCancelPress={() => this.props.actions.setState(SET_SAVE_ACTIVATED_DRAFT, {})} onRequestClose={() => this.props.actions.setState(SET_SAVE_ACTIVATED_DRAFT, {})} />

        }
        return null
    }
    render() {
        let textCounter = 1
        let draftModalView = this.draftModal()
        if (this.props.loading) {
            return (
                <Loader />
            )
        }

        if (this.state.isDetailPageVisible) {
            return (
                <ReviewSaveActivatedDetails commonData={this.state.detailPageData} headerTitle={this.state.headerTitle} isEditVisible={this.state.isEditVisible} reviewCommonData={this.review} edit={this._edit} itemId={this.state.itemId} />
            )
        }

        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>

                    <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
                        <Body>
                            <View
                                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                                <TouchableOpacity style={[style.headerLeft]} onPress={() => { this._goBack() }}>
                                    <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                                </TouchableOpacity>
                                <View style={[style.headerBody]}>
                                    <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.headerTitle}</Text>
                                </View>
                                <View style={[style.headerRight]}>
                                </View>
                                <View />
                            </View>
                        </Body>
                    </Header>

                    <Content style={[styles.flex1, styles.bgLightGray]}>
                        {draftModalView}
                        {/*Senders Details*/}
                        <View style={[styles.bgWhite]}>
                            <List>
                                <ListItem style={[style.jobListItem, styles.justifySpaceBetween]} onPress={() => this.review(true, this.props.commonData.commonData, false, this.props.headerTitle)}>
                                    <View style={[styles.row, styles.alignCenter]}>
                                        <Text style={[styles.fontDefault]}>{this.props.headerTitle}</Text>
                                    </View>
                                    <Right>
                                        <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontBlack]} />
                                    </Right>
                                </ListItem>
                            </List>
                        </View>

                        {/* Add Parcel Button */}


                        <View style={[styles.row, styles.bgWhite, styles.justifySpaceBetween, styles.alignCenter, styles.padding10, { borderBottomColor: '#f5f5f5', borderBottomWidth: 1 }, styles.marginTop10]}>

                            <Button style={{ borderColor: '#338FFC', paddingLeft: 5, paddingRight: 5, height: 25 }} bordered small
                                onPress={() => this.navigateToFormLayout(this.props.navigation.state.params.currentStatus.id, this.props.navigation.state.params.currentStatus.name)}>
                                <Icon name="md-add" style={[styles.fontLg, styles.fontPrimary]} />
                                <Text style={[styles.fontPrimary]}>Add</Text>
                            </Button>
                            <View>
                                <Text style={[styles.fontCenter, styles.fontBlack, styles.fontDefault, styles.alignCenter]}>
                                    {Total} {_.size(this.props.recurringData)}
                                </Text>
                            </View>
                        </View>

                        {/* List View */}

                        <FlatList
                            data={_.values(this.props.recurringData)}
                            extraData={this.state}
                            renderItem={(item) => this.renderRecurringData(item.item, textCounter++)}
                            keyExtractor={this._keyExtractor}>
                        </FlatList>
                    </Content>
                    <Footer style={[style.footer]}>
                        {renderIf(this.props.isSignOffVisible, <FooterTab style={[styles.paddingLeft10, styles.paddingRight5, styles.bgLightGray, styles.marginLeft10]}>
                            <Button onPress={() => {
                                this.signOff(
                                    this.props.navigation.state.params.currentStatus.nextStatusList[0].id,
                                )
                            }}>
                                <Text style={[styles.fontPrimary, styles.fontDefault]}>Signature</Text>
                            </Button>
                        </FooterTab>)}
                        <FooterTab style={[styles.paddingLeft5, styles.paddingRight10, styles.bgWhite]}>
                            <Button style={[styles.bgSuccess]} onPress={() => {
                                this.showAlert()
                            }}>
                                <Text style={[styles.fontWhite, styles.fontDefault]}>{Checkout}</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </Container>
            </StyleProvider>

        )
    }
}
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
        width: '20%',
        paddingTop: 15,
        paddingBottom: 15,
        paddingRight: 15
    },
    footer: {
        height: 'auto',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3',
        paddingTop: 10,
        paddingBottom: 10
    },
    jobListItem: {
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        paddingTop: 20,
        paddingBottom: 20,
        justifyContent: 'space-between'
    },

});
/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(SaveActivated)
