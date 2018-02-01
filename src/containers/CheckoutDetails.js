import React, { PureComponent } from 'react'
import renderIf from '../lib/renderIf'
import { StyleSheet, View, FlatList, TouchableOpacity, BackHandler, Modal } from 'react-native'

import {
    Container,
    Content,
    Header,
    Button,
    Text,
    Left,
    Body,
    Right,
    Item,
    Input,
    Icon,
    List,
    Label,
    ListItem,
    StyleProvider,
    Footer,
    FooterTab,
    Toast,
} from 'native-base';

import {
    Print,
    Receipt,
    SMS,
    TotalAmount,
    HardwareBackPress,
    CONTACT_NUMBER_TO_SEND_SMS,
    SET_SAVE_ACTIVATED_TOAST_MESSAGE,
    EMAILID_VIEW_ARRAY,
    USER,
} from '../lib/constants'

import {
    EMAIL,
    Return_To_Home,
    View_SignOff_Summary,
    View_Parcel_Summary,
    Sign_Off_Summary
} from '../lib/AttributeConstants'
import Loader from '../components/Loader'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as globalActions from '../modules/global/globalActions'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import SummaryDetails from '../components/summaryDetails'
import * as saveActivatedActions from '../modules/saveActivated/saveActivatedActions'
import ReviewSaveActivatedDetails from '../components/ReviewSaveActivatedDetails'
import _ from 'lodash'
import {
    CANCEL,
    MOBILE_NUMBER,
    ENTER_EMAIL_IDS,
    CONTACT_NUMBER_SHOULD_START_WITH_0_AND_CONTAINS_MINIMUM_OF_10_DIGITS,
    PLEASE_ENTER_A_VALID_EMAIL_ID,
} from '../lib/ContainerConstants'


function mapStateToProps(state) {
    return {
        loading: state.saveActivated.loading,
        inputTextToSendSms: state.saveActivated.inputTextToSendSms,
        errorToastMessage: state.saveActivated.errorToastMessage,
        inputTextEmailIds: state.saveActivated.inputTextEmailIds,
        emailIdViewArray: state.saveActivated.emailIdViewArray,
        companyCodeDhl: state.saveActivated.companyCodeDhl
    }
};
/*
 * Bind all the actions
 */
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...saveActivatedActions }, dispatch)
    }
}
class CheckoutDetails extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            isParcelSummaryVisible: false,
            signOffSummary: false,
            isEmailVisible: false,
            isSmsBoxVisible: false,
        }
    }

    componentDidMount() {
        if (!this.props.navigation.state.params.calledFromNewJob) {
            this.props.actions.storeState({}, 'CheckoutDetails', this.props.navigation.state.params.jobMasterId, {
                commonData: this.props.navigation.state.params.commonData,
                recurringData: this.props.navigation.state.params.recurringData,
                signOfData: this.props.navigation.state.params.signOfData,
                totalAmount: this.props.navigation.state.params.totalAmount,
                emailTableElement: this.props.navigation.state.params.emailTableElement,
                emailIdInFieldData: this.props.navigation.state.params.emailIdInFieldData,
                contactNumberInFieldData: this.props.navigation.state.params.contactNumberInFieldData,
            })
        }
        this.props.actions.fetchUserData(this.props.navigation.state.params.emailIdInFieldData, this.props.inputTextEmailIds)
        BackHandler.addEventListener(HardwareBackPress, () => {
            this.props.actions.clearStateAndStore(true, this.props.navigation.state.params.jobMasterId)
            return true
        })
    }

    componentDidUpdate() {
        if (this.props.errorToastMessage && this.props.errorToastMessage != '') {
            Toast.show({
                text: this.props.errorToastMessage,
                position: 'bottom',
                buttonText: 'Okay',
                duration: 5000
            })
            this.props.actions.setState(SET_SAVE_ACTIVATED_TOAST_MESSAGE, '')
        }
    }

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    renderData = (item) => {
        return (
            <View style={[styles.row, styles.paddingRight15, styles.paddingLeft15]}>
                <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                    <Text style={[styles.fontDefault]}>{item.label}</Text>
                </View>
                <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                    <Text style={[styles.fontDefault, styles.fontBlack]}>{item.value}</Text>
                </View>
            </View>
        )
    }

    _keyExtractor = (item, index) => item.id;

    _showParcelSummary = (parcelSummaryStatus) => {
        this.setState(() => {
            return {
                isParcelSummaryVisible: parcelSummaryStatus
            }
        })
    }

    _showEmailSummary = (emailVisible) => {
        this.setState(() => {
            return {
                isEmailVisible: emailVisible
            }
        })
    }

    _showSMSModal = (smsModalVisible) => {
        this.setState(() => {
            return {
                isSmsBoxVisible: smsModalVisible
            }
        })
    }
    _sendMailToAllEmailsIds = () => {
        if ((this.props.inputTextEmailIds && this.props.inputTextEmailIds != '' && (!_.includes(this.props.inputTextEmailIds, '@') || !_.includes(this.props.inputTextEmailIds, '.'))) || (!_.size(this.props.emailIdViewArray) && (!this.props.inputTextEmailIds || this.props.inputTextEmailIds == ''))) {
            this.props.actions.setState(SET_SAVE_ACTIVATED_TOAST_MESSAGE, PLEASE_ENTER_A_VALID_EMAIL_ID)
        } else if (this.props.inputTextEmailIds && this.props.inputTextEmailIds != '' && _.includes(this.props.inputTextEmailIds, '@') && _.includes(this.props.inputTextEmailIds, '.')) {
            this._showEmailSummary(false)
            let emails = this.props.emailIdViewArray
            emails.push(this.props.inputTextEmailIds)
            this.props.actions.setState(EMAILID_VIEW_ARRAY, { email: emails, inputTextEmail: '' })
            this.props.actions.sendSmsOrEmails(this.props.navigation.state.params.totalAmount, this.props.navigation.state.params.emailTableElement, this.props.navigation.state.params.jobMasterId, this.props.emailIdViewArray, true, false)
        } else {
            this._showEmailSummary(false)
            this.props.actions.sendSmsOrEmails(this.props.navigation.state.params.totalAmount, this.props.navigation.state.params.emailTableElement, this.props.navigation.state.params.jobMasterId, this.props.emailIdViewArray, true, false)
        }
    }
    _sendSmsToTheNumberEntered = () => {
        if ((!this.props.inputTextToSendSms && (this.props.inputTextToSendSms) == '') || (this.props.inputTextToSendSms[0] != '0') || (_.size(this.props.inputTextToSendSms) < 10) || (!_.isNumber(this.props.inputTextToSendSms))) {
            this.props.actions.setState(SET_SAVE_ACTIVATED_TOAST_MESSAGE, CONTACT_NUMBER_SHOULD_START_WITH_0_AND_CONTAINS_MINIMUM_OF_10_DIGITS)
        } else {
            this._showSMSModal(false)
            this.props.actions.sendSmsOrEmails(this.props.navigation.state.params.totalAmount, this.props.navigation.state.params.emailTableElement, this.props.navigation.state.params.jobMasterId, this.props.inputTextToSendSms, false, false)
        }
    }

    _sendSMS = () => {
        if (this.props.navigation.state.params.contactNumberInFieldData) {
            this.props.actions.sendSmsOrEmails(this.props.navigation.state.params.totalAmount, this.props.navigation.state.params.emailTableElement, this.props.navigation.state.params.jobMasterId, [], false, false)
        } else {
            this._showSMSModal(true)
        }
    }

    onChangeMobileNo = (value) => {
        this.props.actions.setState(CONTACT_NUMBER_TO_SEND_SMS, value)
    }

    onChangeEmailText = (value) => {
        if (_.includes(value, ' ')) {
            if (!_.includes(value, '@') || !_.includes(value, '.')) {
                this.props.actions.setState(SET_SAVE_ACTIVATED_TOAST_MESSAGE, PLEASE_ENTER_A_VALID_EMAIL_ID)
            } else {
                let emails = this.props.emailIdViewArray
                emails.push(value.split(' ')[0])
                this.props.actions.setState(EMAILID_VIEW_ARRAY, { email: emails, inputTextEmail: '' })
            }
        } else {
            this.props.actions.setState(EMAILID_VIEW_ARRAY, { email: this.props.emailIdViewArray, inputTextEmail: value })
        }
    }

    _showSmsBoxModal = () => {
        return (
            <Modal animationType={"fade"}
                transparent={true}
                visible={true}
                onRequestClose={() => this._showSMSModal(false)}
                presentationStyle={"overFullScreen"}>
                <View style={[styles.relative, styles.alignCenter, styles.justifyCenter, { height: '100%' }]}>
                    <View style={[styles.absolute, { height: '100%', left: 0, right: 0, backgroundColor: 'rgba(0,0,0,.6)' }]}>
                    </View>
                    <View style={[styles.bgWhite, styles.shadow, styles.borderRadius3, { width: '90%' }]}>
                        <View style={[styles.padding10, styles.marginBottom10, styles.row, styles.justifySpaceBetween, styles.alignCenter, styles.borderBottomLightGray]}>
                            <Text style={[styles.bold, styles.marginBottom10]}>Recepient's Contact Number</Text>
                        </View>
                        <View style={[styles.paddingHorizontal10]}>
                            <Item >
                                <Input placeholder={MOBILE_NUMBER}
                                    value={this.props.inputTextToSendSms}
                                    keyboardType='numeric'
                                    onChangeText={this.onChangeMobileNo}
                                    style={[styles.fontSm]} />
                            </Item>
                        </View>


                        <View style={[styles.row, { borderTopColor: '#d3d3d3', borderTopWidth: 1 }]}>
                            <View style={{ width: '50%' }}>
                                <Button transparent full
                                    onPress={() => { this._showSMSModal(false) }} >
                                    <Text style={[styles.fontPrimary]}>{CANCEL}</Text>
                                </Button>
                            </View>
                            <View style={{ width: '50%', borderLeftColor: '#d3d3d3', borderLeftWidth: 1 }}>
                                <Button transparent full
                                    onPress={() => { this._sendSmsToTheNumberEntered() }} >
                                    <Text style={[styles.fontPrimary]}>Send</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    _deleteEmailId = (counter) => {
        let emails = this.props.emailIdViewArray
        let copyOfEmails = _.clone(emails)
        copyOfEmails.splice(counter, 1)
        this.props.actions.setState(EMAILID_VIEW_ARRAY, { email: copyOfEmails, inputTextEmail: this.props.inputTextEmailIds })
    }
    _showAllEmailIds = () => {
        if (_.isEmpty(this.props.emailIdViewArray)) {
            return null
        } else {
            let view = []
            let emails = this.props.emailIdViewArray
            for (let counter in emails) {
                view.push(
                    <View style={[styles.row, styles.justifySpaceBetween, styles.alignCenter, styles.padding5, styles.bgLightGray, styles.marginBottom10, styles.marginRight10, { borderRadius: 15 }]}>
                        <Text style={[styles.fontSm]}>
                            {emails[counter]}
                        </Text>
                        <View style={[{ paddingVertical: 3, paddingHorizontal: 5 }]}>
                            <Icon name="ios-close-outline" style={[styles.fontLg, styles.fontPrimary]} onPress={() => { this._deleteEmailId(counter) }} />
                        </View>
                    </View>
                )
            }
            return view
        }
    }

    _showEmailModal = () => {
        let emailIds = this._showAllEmailIds()
        return (
            <Modal animationType={"fade"}
                transparent={true}
                visible={true}
                onRequestClose={() => this._showEmailSummary(false)}
                presentationStyle={"overFullScreen"}>
                <View style={[styles.relative, styles.alignCenter, styles.justifyCenter, { height: '100%' }]}>
                    <View style={[styles.absolute, { height: '100%', left: 0, right: 0, backgroundColor: 'rgba(0,0,0,.6)' }]}>
                    </View>
                    <View style={[styles.bgWhite, styles.shadow, styles.borderRadius3, { width: '90%' }]}>
                        <View style={[styles.padding10, styles.marginBottom10, styles.row, styles.justifySpaceBetween, styles.alignCenter, styles.borderBottomLightGray]}>
                            <Text style={[styles.bold, styles.marginBottom10]}>Recepient's Email Address</Text>
                            <Text style={[styles.marginBottom10, styles.fontSm]}>
                                Total {_.size(this.props.emailIdViewArray)}
                            </Text>
                        </View>
                        <View style={[styles.padding10, styles.marginBottom10, styles.row, styles.flexWrap]}>
                            {emailIds}
                        </View>
                        <View style={[styles.paddingHorizontal10]}>
                            <Item >
                                <Input
                                    placeholder={ENTER_EMAIL_IDS}
                                    value={this.props.inputTextEmailIds}
                                    onChangeText={this.onChangeEmailText}
                                    style={[styles.fontSm]} />
                            </Item>
                        </View>


                        <View style={[styles.row, { borderTopColor: '#d3d3d3', borderTopWidth: 1 }]}>
                            <View style={{ width: '50%' }}>
                                <Button transparent full
                                    onPress={() => { this._showEmailSummary(false) }} >
                                    <Text style={[styles.fontPrimary]}>{CANCEL}</Text>
                                </Button>
                            </View>
                            <View style={{ width: '50%', borderLeftColor: '#d3d3d3', borderLeftWidth: 1 }}>
                                <Button transparent full
                                    onPress={() => { this._sendMailToAllEmailsIds() }}>
                                    <Text style={[styles.fontPrimary]}>Send</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    _signOffSummary = (signOffSummary) => {
        this.setState(() => {
            return {
                signOffSummary: signOffSummary
            }
        })
    }

    _checkForEmailSmsPrintViewButton = () => {
        if (this.props.companyCodeDhl) {
            return (
                <View style={[styles.bgWhite]} >
                    <List>
                        <ListItem style={[style.jobListItem]} >
                            <View style={[styles.row, styles.alignCenter]}>
                                <Icon name="md-print" style={[styles.fontLg, styles.fontPrimary]} />
                                <View style={[style.statusCircle, { backgroundColor: '#4cd964' }]}></View>
                                <Text style={[styles.fontDefault, styles.fontWeight400, styles.marginLeft10]}>{Print}</Text>
                            </View>
                            <Right>
                                <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontBlack]} />
                            </Right>
                        </ListItem>
                    </List>
                    <List>
                        <ListItem style={[style.jobListItem]} onPress={() => { this._showEmailSummary(true) }}>
                            <View style={[styles.row, styles.alignCenter]}>
                                <Icon name="md-mail" style={[styles.fontLg, styles.fontPrimary]} />
                                <Text style={[styles.fontDefault, styles.fontWeight400, styles.marginLeft10]}>{EMAIL}</Text>
                            </View>
                            <Right>
                                <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontBlack]} />
                            </Right>
                        </ListItem>
                    </List>
                    <List>
                        <ListItem style={[style.jobListItem]} onPress={() => { this._sendSMS() }}>
                            <View style={[styles.row, styles.alignCenter]}>
                                <Icon name="md-chatboxes" style={[styles.fontLg, styles.fontPrimary]} />
                                <View style={[style.statusCircle, { backgroundColor: '#4cd964' }]}></View>
                                <Text style={[styles.fontDefault, styles.fontWeight400, styles.marginLeft10]}>{SMS}</Text>
                            </View>
                            <Right>
                                <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontBlack]} />
                            </Right>
                        </ListItem>
                    </List>
                </View >
            )
        }
    }

    render() {
        let emailSmsPrintViewButton = this._checkForEmailSmsPrintViewButton()
        if (this.props.loading) {
            return (
                <Loader />
            )
        }
        if (this.state.isSmsBoxVisible) {
            return this._showSmsBoxModal()
        }
        if (this.state.isEmailVisible) {
            return this._showEmailModal()
        }
        if (this.state.isParcelSummaryVisible) {
            return (<SummaryDetails recurringData={this.props.navigation.state.params.recurringData} showParcelSummary={this._showParcelSummary} />)
        }
        if (this.state.signOffSummary) {
            return (
                <ReviewSaveActivatedDetails commonData={this.props.navigation.state.params.signOfData} headerTitle={Sign_Off_Summary} reviewCommonData={this._signOffSummary} />
            )
        }
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>

                    <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
                        <Body>
                            <View
                                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                                <TouchableOpacity style={[style.headerLeft]}>
                                </TouchableOpacity>
                                <View style={[style.headerBody]}>
                                    <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{Receipt}</Text>
                                </View>
                                <View style={[style.headerRight]}>
                                </View>
                                <View />
                            </View>
                        </Body>
                    </Header>

                    <Content style={[styles.flex1, styles.bgLightGray]}>
                        {emailSmsPrintViewButton}
                        <View style={[styles.marginTop10, styles.bgWhite]}>
                            <FlatList
                                data={this.props.navigation.state.params.commonData}
                                extraData={this.state}
                                renderItem={(item) => this.renderData(item.item)}
                                keyExtractor={this._keyExtractor}>
                            </FlatList>
                        </View>

                        <View style={[styles.row, styles.paddingRight15, styles.paddingLeft15, styles.bgWhite]}>
                            <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                                <Text style={[styles.fontDefault]}>{TotalAmount}</Text>
                            </View>
                            <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                                <Text style={[styles.fontDefault, styles.fontBlack]}>{this.props.navigation.state.params.totalAmount}</Text>
                            </View>
                        </View>

                        <View style={[styles.marginTop10, styles.bgWhite]}>
                            <List>
                                <ListItem style={[style.jobListItem, styles.justifySpaceBetween]} onPress={() => { this._showParcelSummary(true) }}>
                                    <View style={[styles.row, styles.alignCenter]}>
                                        <Text style={[styles.fontDefault, styles.fontWeight400]}>{View_Parcel_Summary}</Text>
                                    </View>
                                    <Right>
                                        <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontBlack]} />
                                    </Right>
                                </ListItem>
                            </List>
                        </View>
                        {renderIf(this.props.navigation.state.params.signOfData, <View style={[styles.marginTop10, styles.bgWhite]}>
                            <List>
                                <ListItem style={[style.jobListItem, styles.justifySpaceBetween]} onPress={() => { this._signOffSummary(true) }}>
                                    <View style={[styles.row, styles.alignCenter]}>
                                        <Text style={[styles.fontDefault, styles.fontWeight400]}>{View_SignOff_Summary}</Text>
                                    </View>
                                    <Right>
                                        <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontBlack]} />
                                    </Right>
                                </ListItem>
                            </List>
                        </View>)}
                    </Content>
                    <Footer style={[style.footer]}>
                        <FooterTab style={[styles.paddingLeft5, styles.paddingRight10, styles.bgWhite]}>
                            <Button onPress={() => {
                                this.props.actions.clearStateAndStore(true, this.props.navigation.state.params.jobMasterId)
                            }}>
                                <Text style={[styles.fontPrimary, styles.fontDefault]}>{Return_To_Home}</Text>
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
        width: '15%',
        padding: 15
    },
    footer: {
        height: 'auto',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3',
    },
    jobListItem: {
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        paddingTop: 20,
        paddingBottom: 20,
        justifyContent: 'space-between'
    },

});
export default connect(mapStateToProps, mapDispatchToProps)(CheckoutDetails)