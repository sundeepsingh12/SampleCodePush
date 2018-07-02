'use strict'
import { Container, StyleProvider, Footer, Item, Content } from 'native-base';
import { FlatList, View, Text, StyleSheet, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import TitleHeader from '../components/TitleHeader';
import * as globalActions from '../modules/global/globalActions';
import * as messageActions from '../modules/message/messageActions';
import styles from '../themes/FeStyle';
import React, { Component } from 'react'
import {
    FIELDEXECUTIVE_INTERACTION,
    MANAGER_INTERACTION
} from '../lib/ContainerConstants'
import Loader from '../components/Loader'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import JobListItem from '../components/JobListItem';
import {
    JobDetailsV2
} from '../lib/constants'
import MessageSendIcon from '../svg_components/icons/MessageSendIcon'
import MessageReceiveIcon from '../svg_components/icons/MessageReceiveIcon'
import _ from 'lodash'

function mapStateToProps(state) {
    return {
        messageList: state.messageReducer.messageList,
        isLoading: state.messageReducer.isLoading,
        jobTransactionCustomizationList: state.listing.jobTransactionCustomizationList,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...messageActions }, dispatch)
    }
}

class MessageBox extends Component {

    state = {
        messageText: ''
    }
    static navigationOptions = ({ navigation }) => {
        return { header: <TitleHeader pageName='Messages' goBack={navigation.goBack} /> }
    }

    componentDidMount() {
        this.props.actions.getAllMessages()
    }



    goBack = () => {
        this.props.navigation.goBack()
    }

    getLoader() {
        let loader
        if (this.props.isLoading) {
            loader = <Loader />
        }
        return loader
    }
    getTransactionView(item, transactionIdToCustomisationMap) {
        let view
        if (item.transactionId && transactionIdToCustomisationMap[item.transactionId]) {
            view =
                <View style={[styles.marginTop10, styles.marginBottom10]}>
                    <JobListItem
                        data={transactionIdToCustomisationMap[item.transactionId]}
                        onPressItem={() => { this.navigateToScene(transactionIdToCustomisationMap[item.transactionId]) }}
                    />
                </View>
        }
        return view

    }
    navigateToScene = (item) => {
        this.props.actions.navigateToScene(JobDetailsV2,
            {
                jobSwipableDetails: item.jobSwipableDetails,
                jobTransaction: item,
            },
            this.props.navigation.navigate
        )
    }

    renderData = (item, transactionIdToCustomisationMap) => {
        if (item.type == FIELDEXECUTIVE_INTERACTION) {
            return (
                <View style={[styles.column, styles.marginBottom10]}>
                    <View style={[style.eachMsg, styles.flex1, styles.relative, { justifyContent: 'flex-end' }]}>
                        <View style={[styles.absolute, { top: 3, right: 0 }]}>
                            <MessageSendIcon />
                        </View>
                        <View style={[style.msgBlock, styles.marginRight10, { backgroundColor: '#A0A0AF' }]} >
                            <Text style={[styles.fontWhite, styles.fontDefault]}>{item.messageBody}</Text>
                        </View>

                    </View>
                    <View style={[styles.row, {
                        alignItems: 'flex-end',
                        alignSelf: 'flex-end'
                    }, styles.paddingRight15]}>
                        <Text style={[styles.fontDarkGray, styles.fontSm]}>{(item.messageSendingStatus) ? item.messageSendingStatus : 'Sent'}</Text>
                        <Text style={[styles.fontDarkGray, styles.fontSm]}> | </Text>
                        <Text style={[styles.fontDarkGray, styles.fontSm]}>{item.dateTimeOfSending}</Text>
                    </View>
                </View>
            )
        } else if (item.type == MANAGER_INTERACTION) {
            return (
                <View style={[styles.column, styles.marginBottom10]}>
                    <View style={[style.eachMsg, styles.flex1, styles.relative]}>
                        <View style={[styles.absolute, { top: 3, left: 0 }]}>
                            <MessageReceiveIcon />
                        </View>
                        <View style={[style.msgBlock,styles.flex1, styles.marginLeft10, { backgroundColor: '#E5E5EA' }]}>

                            <Text style={[styles.fontBlack, styles.fontDefault, styles.bold]}>MANAGER</Text>
                            {this.getTransactionView(item, transactionIdToCustomisationMap)}
                            <Text style={[styles.fontBlack, styles.fontDefault]}>{item.messageBody}</Text>
                        </View>
                    </View>
                    <View style={[styles.row, {
                        alignItems: 'flex-end',
                    }, styles.paddingLeft15]}>
                        <Text style={[styles.fontDarkGray, styles.fontSm]}>{item.dateTimeOfSending}</Text>
                    </View>
                </View>
            )
        }
    }


    renderList() {
        const list = _.sortBy(this.props.messageList, ['dateTimeOfSending'])
        return list
    }

    getMessagesList() {
        let flatListView, transactionIdToCustomisationMap = _.mapKeys(this.props.jobTransactionCustomizationList, 'id')
        if (!_.isEmpty(this.props.messageList)) {
            flatListView = <FlatList
                data={this.renderList()}
                renderItem={({ item }) => this.renderData(item, transactionIdToCustomisationMap)
                }
                keyExtractor={item => String(item.id)}
            />
            return flatListView
        }
    }

    getMessageInputBox() {
        let view
        view =
            <Footer
                style={[style.footer, styles.bgWhite, styles.row]}>
                <TextInput
                    autoCapitalize="none"
                    placeholder='Type a message'
                    placeholderTextColor={styles.fontLowGray.color}
                    returnKeyType='done'
                    multiline={true}
                    style={[styles.flexBasis80, styles.paddingBottom10]}
                    underlineColorAndroid='transparent'
                    value={this.state.messageText}
                    onChangeText={(text) => this.setState({ messageText: text })}
                />
                <View style={[styles.borderRadius50, styles.justifyCenter, { backgroundColor: (this.state.messageText == '' ? '#c3eff4' : '#1214CF'), width: 45, height: 45 }]}>
                    <MaterialIcons name='send' style={[styles.fontXxxl, styles.alignSelfCenter, styles.fontWhite, styles.padding5]} onPress={() => {
                        this.props.actions.sendMessage(this.state.messageText, this.props.messageList)
                        this.setState({ messageText: '' })
                    }
                    }
                    />
                </View>
            </Footer >

        return view
    }
    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Content style={[styles.flex1, styles.bgWhite]}>
                        {this.getMessagesList()}
                        {this.getLoader()}
                    </Content>
                    {this.getMessageInputBox()}
                </Container>
            </StyleProvider>)
    }
}

const style = StyleSheet.create({
    cardLeft: {
        flex: 0.85,
        borderRightColor: '#f3f3f3',
        borderRightWidth: 1
    },
    cardLeftTopRow: {
        flexDirection: 'row',
        borderBottomColor: '#f3f3f3',
        borderBottomWidth: 1
    },
    footer: {
        height: 'auto',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3',
        padding: 10
    },


    msgBlock: {
        maxWidth: 250,
        borderRadius: 5,
        backgroundColor: '#E5E5EA',
        shadowColor: '#3d3d3d',
        shadowRadius: 2,
        shadowOpacity: 0.2,
        padding: 10,
        shadowOffset: {
            height: 1,
        }
    },
    eachMsg: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        margin: 5,
    },
    rightMsg: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        margin: 5,
        alignSelf: 'flex-end',
    },
    msgTxt: {
        fontSize: 15,
        color: '#555',
        fontWeight: '600',
    },
    rightTxt: {
        fontSize: 15,
        color: '#202020',
        fontWeight: '600',
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(MessageBox)
