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
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import renderIf from '../lib/renderIf'
import ExpandableHeader from '../components/ExpandableHeader'
import MessageHeader from '../components/MessageHeader'
import * as jobDetailsActions from '../modules/job-details/jobDetailsActions'
import Loader from '../components/Loader'

function mapStateToProps(state) {
    return {
        jobDetailsLoading: state.jobDetails.jobDetailsLoading,
        jobDataList: state.jobDetails.jobDataList,
        fieldDataList: state.jobDetails.fieldDataList,
        messageList: state.jobDetails.messageList,
        nextStatusList: state.jobDetails.nextStatusList,
        contactList: state.jobDetails.contactList,
        addressList: state.jobDetails.addressList,
        customerCareList: state.jobDetails.customerCareList,
        smsTemplateList: state.jobDetails.smsTemplateList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...jobDetailsActions }, dispatch)
    }
}

class JobDetails extends Component {

    componentWillMount() {
        this.props.actions.getJobDetails(this.props.jobTransactionId)
    }

    renderStatusList(statusList) {
        let statusView = []
        for (let index in statusList) {
            statusView.push(
                <Button key={statusList[index].id} small primary style={{ margin: 2 }}>
                    <Text style={{ color: 'white' }}>{statusList[index].name}</Text>
                </Button>
            )
        }
        return statusView
    }

    render() {
        console.log('props render >>>> ', this.props)
        const statusView = this.renderStatusList(this.props.nextStatusList)
        if (this.props.jobDetailsLoading) {
            return (
                <Loader />
            )
        } else {
            return (
                <Container style={StyleSheet.flatten([theme.mainBg])}>
                    <Header style={StyleSheet.flatten([theme.bgPrimary])}>
                        <Left style={StyleSheet.flatten([styles.flexBasis15])}>
                            <Button transparent onPress={() => { Actions.pop() }}>
                                <Icon name='arrow-back' style={StyleSheet.flatten([styles.fontXl, styles.fontWhite])} />
                            </Button>
                        </Left>
                        <Body style={StyleSheet.flatten([styles.alignCenter, styles.flexBasis70])}>
                            <Text style={StyleSheet.flatten([styles.fontSm, styles.fontWhite, styles.fontCenter])}>Ref12345676565</Text>
                            <Text style={StyleSheet.flatten([styles.fontSm, styles.fontWhite, styles.bold, styles.fontYellow, styles.fontCenter])}>Pending</Text>
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

