'use strict'
import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    FlatList,
    TouchableOpacity,
    Alert
}
    from 'react-native'
import { Container, Content, Footer, FooterTab, Card, CardItem, Button, Body, Header, Left, Right, Icon, List, ListItem } from 'native-base'
import styles from '../themes/FeStyle'
import { connect } from 'react-redux'
import CustomAlert from "../components/CustomAlert"
import { bindActionCreators } from 'redux'
import renderIf from '../lib/renderIf'
import ExpandableHeader from '../components/ExpandableHeader'
import MessageHeader from '../components/MessageHeader'
import * as jobDetailsActions from '../modules/job-details/jobDetailsActions'
import * as globalActions from '../modules/global/globalActions'
import Loader from '../components/Loader'
import {
    IS_MISMATCHING_LOCATION
} from '../lib/constants'

function mapStateToProps(state) {
    return {
        addressList: state.jobDetails.addressList,
        contactList: state.jobDetails.contactList,
        customerCareList: state.jobDetails.customerCareList,
        currentStatus: state.jobDetails.currentStatus,
        fieldDataList: state.jobDetails.fieldDataList,
        jobDetailsLoading: state.jobDetails.jobDetailsLoading,
        jobDataList: state.jobDetails.jobDataList,
        jobTransaction: state.jobDetails.jobTransaction,
        messageList: state.jobDetails.messageList,
        smsTemplateList: state.jobDetails.smsTemplateList,
        isEnableRestriction:state.jobDetails.isEnableRestriction,
        isEnableOutForDelivery: state.jobDetails.isEnableOutForDelivery,
        statusList: state.jobDetails.statusList,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...jobDetailsActions, ...globalActions }, dispatch)
    }
}

class JobDetails extends Component {

    componentWillMount() {
        // this.props.actions.checkOutForDelivery(this.props.navigation.state.params.jobTransactionId)
        this.props.actions.getJobDetails(this.props.navigation.state.params.jobTransactionId)
    }

    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }
    }

    _onGoToNextStatus = () => {
        this.props.actions.navigateToScene('FormLayout', {
            contactData: this.props.navigation.state.params.jobSwipableDetails.contactData,
            jobTransactionId: this.props.jobTransaction.id,
            jobTransaction: this.props.jobTransaction,
            statusId: this.props.statusList.id,
            statusName: this.props.statusList.name,
            jobMasterId: this.props.jobTransaction.jobMasterId
        }
        )
        this._onCancel();
    }
    _onCancel = () => {
        this.props.actions.setState(IS_MISMATCHING_LOCATION, null)
    }
    _onCheckLocationMismatch = (statusList, jobTransaction) => {
        const FormLayoutObject = {
            contactData: this.props.navigation.state.params.jobSwipableDetails.contactData,
            jobTransaction,
            statusList
        }
        this.props.actions.checkForLocationMismatch(FormLayoutObject, this.props.currentStatus.statusCategory)
    }

    renderStatusList(statusList) {
        let statusView = []
        for (let index in statusList) {
            statusView.push(
                <Button key={statusList[index].id} small primary style={{ margin: 2 }}
                    onPress={() => this._onCheckLocationMismatch(statusList[index], this.props.jobTransaction)}>
                    <Text style={{ color: 'white' }}>{statusList[index].name}</Text>
                </Button>
            )
        }
        return statusView
    }

    render() {
        const statusView = this.props.currentStatus && this.props.isEnableRestriction && this.props.isEnableOutForDelivery? this.renderStatusList(this.props.currentStatus.nextStatusList) : null
        if (this.props.jobDetailsLoading) {
            return (
                <Loader />
            )
        } else {
            return (
                <Container style={StyleSheet.flatten([styles.mainBg])}>
                    <View>
                        {renderIf(this.props.statusList,
                            <CustomAlert
                                title="Details"
                                message="You are not at location. Do you want to continue?"
                                onOkPressed={this._onGoToNextStatus}
                                onCancelPressed={this._onCancel} />)}
                    </View>
                    <Header style={StyleSheet.flatten([styles.bgPrimary])}>
                        <Left style={StyleSheet.flatten([styles.flexBasis15])}>
                            <Button transparent onPress={() => { this.props.navigation.goBack(null) }}>
                                <Icon name='arrow-back' style={StyleSheet.flatten([styles.fontXl, styles.fontWhite])} />
                            </Button>
                        </Left>
                        <Body style={StyleSheet.flatten([styles.alignCenter, styles.flexBasis70])}>
                            <Text style={StyleSheet.flatten([styles.fontSm, styles.fontWhite, styles.fontCenter])}>{this.props.jobTransaction ? this.props.jobTransaction.referenceNumber : null}</Text>
                            <Text style={StyleSheet.flatten([styles.fontSm, styles.fontWhite, styles.bold, styles.fontYellow, styles.fontCenter])}>{this.props.currentStatus ? this.props.currentStatus.name : null}</Text>
                        </Body>
                        <Right style={StyleSheet.flatten([styles.flexBasis15])}>
                        </Right>
                    </Header>
                    {renderIf(this.props.isEnableRestriction == false,
                             <View style={StyleSheet.flatten([styles.column, { padding: 12, backgroundColor: 'white' }])}>
                                 <Text style={StyleSheet.flatten([styles.bold, styles.fontCenter, styles.fontSm, styles.fontWarning])}>
                                    Please finish previous items first
                                  </Text>
                             </View>
 
                         )}
                    {renderIf(this.props.isEnableOutForDelivery == false,
                            <View style={StyleSheet.flatten([styles.column, { padding: 12, backgroundColor: 'white' }])}>
                                <Text style={StyleSheet.flatten([styles.bold, styles.fontCenter, styles.fontSm, styles.fontWarning])}>
                                    Please Scan all Parcels First
                                 </Text>
                            </View>

                        )}
                    <Content style={StyleSheet.flatten([styles.padding5])}>
                        <Card>
                            <ExpandableHeader
                                title={'Job Details'}
                                dataList={this.props.jobDataList}
                            />
                        </Card>
                        <Card>
                            <ExpandableHeader
                                title={'Field Details'}
                                dataList={this.props.fieldDataList} />
                        </Card>
                        <Card>
                            <MessageHeader />
                        </Card>
                    </Content>
                    <View style={StyleSheet.flatten([styles.column, { padding: 3, backgroundColor: '#FF0000' }])}>
                        <Text style={StyleSheet.flatten([styles.bold, styles.fontCenter, styles.fontSm, styles.fontWhite])}>
                            2hr 3min 34s Left
                    </Text>
                    </View>
                    <View style={StyleSheet.flatten([styles.column, styles.bgWhite, styles.padding5, { borderTopWidth: 1, borderTopColor: '#d3d3d3' }])}>
                        <View style={StyleSheet.flatten([styles.row, styles.flexWrap, styles.justifyCenter, styles.alignCenter])}>
                            {statusView}
                        </View>
                    </View>
                    <Footer>
                        <FooterTab>
                            <Button>
                                <Icon name="ios-chatbubbles-outline" />
                            </Button>
                            <Button>
                                <Icon name="ios-call-outline" />
                            </Button>
                            <Button active>
                                <Icon active name="ios-navigate-outline" />
                            </Button>
                            <Button>
                                <Icon name="ios-help-circle-outline" />
                            </Button>
                        </FooterTab>
                    </Footer>
                </Container>
            )
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(JobDetails)

