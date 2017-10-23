'use strict'
import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    FlatList,
    TouchableOpacity
}
    from 'react-native'
import { Container, Content, Footer, FooterTab, Card, CardItem, Button, Body, Header, Left, Right, Icon, List, ListItem } from 'native-base';
import styles from '../themes/FeStyle'
import theme from '../themes/feTheme'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import renderIf from '../lib/renderIf'
import ExpandableHeader from '../components/ExpandableHeader'
import MessageHeader from '../components/MessageHeader'
import * as jobDetailsActions from '../modules/job-details/jobDetailsActions'
import * as globalActions from '../modules/global/globalActions'
import Loader from '../components/Loader'

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
        smsTemplateList: state.jobDetails.smsTemplateList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...jobDetailsActions, ...globalActions }, dispatch)
    }
}

class JobDetails extends Component {

    componentWillMount() {
        this.props.actions.getJobDetails(this.props.navigation.state.params.jobTransactionId)
    }

    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }
    }

    renderStatusList(statusList) {
        let statusView = []
        for (let index in statusList) {
            statusView.push(
                <Button key={statusList[index].id} small primary style={{ margin: 2 }}
                    onPress={() => this.props.actions.navigateToScene('FormLayout', {
                        contactData: this.props.navigation.state.params.jobSwipableDetails.contactData,
                        jobTransactionId: this.props.jobTransaction.id,
                        jobTransaction: this.props.jobTransaction,
                        statusId: statusList[index].id,
                        statusName: statusList[index].name,
                    }
                    )
                    }>
                    <Text style={{ color: 'white' }}>{statusList[index].name}</Text>
                </Button>
            )
        }
        return statusView
    }

    render() {
        const statusView = this.props.currentStatus ? this.renderStatusList(this.props.currentStatus.nextStatusList) : null
        if (this.props.jobDetailsLoading) {
            return (
                <Loader />
            )
        } else {
            return (
                <Container style={StyleSheet.flatten([theme.mainBg])}>
                    <Header style={StyleSheet.flatten([theme.bgPrimary])}>
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

