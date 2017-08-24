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
import TitleHeader from '../components/TitleHeader'

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

    constructor() {
        super();
        this.state = {
            active: false,
            parentActive: false,
            childActive: false,
            childActive2: false,
        };
    }

    componentWillMount() {
        this.props.actions.getJobDetails(this.props.jobTransactionId)
    }

    renderData = (item) => {
        return (
            <View style={StyleSheet.flatten([styles.row, styles.padding10, styles.bgWhite, { borderTopWidth: .5, borderColor: '#C5C5C5' }])}>
                <View style={StyleSheet.flatten([styles.row, styles.justifyStart, styles.alignCenter, { flex: .5 }])}>
                    <Text style={StyleSheet.flatten([styles.bold, styles.fontSm])}>
                        Child List
                    </Text>
                </View>
                <View style={StyleSheet.flatten([styles.row, styles.justifyStart, styles.alignCenter, { flex: .5 }])}>
                    <Text style={StyleSheet.flatten([styles.fontSm])}>
                        Child String Content
                    </Text>
                </View>
            </View>
        )
    }

    renderList() {
        let list = []
        for (var i = 0; i < 100; i++) {
            let obj = {
                id: i,
                name: 'xyz'
            }
            list.push(obj)
        }
        console.log(list)
        return list
    }

    render() {
        console.log('props render >>>> ', this.props)
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
                    {/* <TitleHeader/> */}
                    <Content style={StyleSheet.flatten([styles.padding5])} scrollEnabled={!this.state.parentActive}>
                        <Card>
                            <ExpandableHeader
                                title={'Job Details'}
                                dataList={this.props.jobDataList}
                            />
                            {/* <CardItem button onPress={() => { this.setState({ active: !this.state.active }) }}>
                            <Body style={StyleSheet.flatten([styles.padding10])}>
                                <View style={StyleSheet.flatten([styles.width100, styles.row, styles.justifySpaceBetween])} >
                                    <View style={StyleSheet.flatten([styles.marginRight15])}>
                                        <Icon name='ios-list-outline' style={StyleSheet.flatten([styles.fontXl, theme.textPrimary])} />
                                    </View>
                                    <Text style={StyleSheet.flatten([styles.marginRightAuto, styles.fontLg])}>
                                        Job Details
                                    </Text>
                                    <View>
                                        <Icon name={this.state.active ? 'ios-arrow-up-outline' : 'ios-arrow-down-outline'} style={StyleSheet.flatten([styles.fontXl, theme.textPrimary, styles.justifyEnd])} />
                                    </View>
                                </View>
                            </Body>
                        </CardItem> */}


                            {/*Job detail list*/}
                            {/* {renderIf(this.state.active, */}

                            {/* )} */}
                            {/*End job detail list*/}
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
                            <Button small primary style={{ margin: 2 }}>
                                <Text style={{ color: 'white' }}>Success</Text>
                            </Button>
                            <Button small primary style={{ margin: 2 }}>
                                <Text style={{ color: 'white' }}>Fail</Text>
                            </Button>
                            <Button small primary style={{ margin: 2 }}>
                                <Text style={{ color: 'white' }}>Pickup</Text>
                            </Button>
                            <Button small primary style={{ margin: 2 }}>
                                <Text style={{ color: 'white' }}>Status</Text>
                            </Button>
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

