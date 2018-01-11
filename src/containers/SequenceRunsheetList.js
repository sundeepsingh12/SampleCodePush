
'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Ionicons from 'react-native-vector-icons/Ionicons'
import Preloader from '../containers/Preloader'
import Loader from '../components/Loader'

import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native'

import {
    Container,
    Content,
    Header,
    Text,
    List,
    ListItem,
    Left,
    Body,
    Right,
    Icon,
    StyleProvider,
    Toast
} from 'native-base';


import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import * as sequenceActions from '../modules/sequence/sequenceActions'
import * as globalActions from '../modules/global/globalActions'
import {
    SELECT_RUNSHEET_NUMBER,
    OK
} from './../lib/ContainerConstants'
import {
    Sequence,
    CLEAR_SEQUENCE_STATE,
    SET_RESPONSE_MESSAGE
} from './../lib/constants'


function mapStateToProps(state) {
    return {
        runsheetNumberList: state.sequence.runsheetNumberList,
        responseMessage: state.sequence.responseMessage
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            ...sequenceActions,
            ...globalActions
        }, dispatch)
    }
}


class SequenceRunsheetList extends Component {

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    componentDidMount() {
        this.props.actions.getRunsheets(this.props.navigation.state.params.displayName)
    }

    componentDidUpdate() {
        if (this.props.responseMessage) {
            Toast.show({
                text: this.props.responseMessage,
                position: "bottom" | "center",
                buttonText: OK,
                type: 'danger',
                duration: 10000,
            })
        }
    }

    goBack = () => {
        this.props.actions.setState(CLEAR_SEQUENCE_STATE)
        this.props.navigation.goBack(null)
    }

    renderData = (item) => {
        return (
            <ListItem style={[style.jobListItem]} onPress={() => this.props.actions.navigateToScene(Sequence, {
                runsheetNumber: item,
                displayName: this.props.navigation.state.params.displayName
            })}>
                <Text style={[styles.fontDefault, styles.fontWeight500]}>{item}</Text>
                <Right>
                    <Icon name="ios-arrow-forward" style={[styles.fontDefault, styles.fontBlack]} />
                </Right>
            </ListItem>
        )
    }

    _keyExtractor = (item, index) => item;

    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Header style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
                        <Body>
                            <View
                                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                                <TouchableOpacity style={[style.headerLeft]}
                                    onPress={this.goBack}>
                                    <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                                </TouchableOpacity>
                                <View style={[style.headerBody]}>
                                    <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.navigation.state.params.displayName}</Text>
                                </View>
                                <View style={[style.headerRight]}>
                                </View>
                            </View>
                        </Body>
                    </Header>
                    <Content style={[styles.bgWhite]}>
                        <Text style={[styles.fontSm, styles.fontPrimary, styles.padding15]}>{SELECT_RUNSHEET_NUMBER}</Text>
                        <List>
                            <FlatList
                                data={(this.props.runsheetNumberList)}
                                extraData={this.state}
                                renderItem={(item) => this.renderData(item.item)}
                                keyExtractor={this._keyExtractor}>
                            </FlatList>
                        </List>
                    </Content>
                </Container>
            </StyleProvider>
        )
    }

};

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
    jobListItem: {
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        paddingTop: 20,
        paddingBottom: 20,
        justifyContent: 'space-between'
    },
});


export default connect(mapStateToProps, mapDispatchToProps)(SequenceRunsheetList)
