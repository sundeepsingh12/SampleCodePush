'use strict'
import React, { PureComponent } from 'react'
import * as transientStatusActions from '../modules/transientStatus/transientActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as globalActions from '../modules/global/globalActions'
import Loader from '../components/Loader'
import styles from '../themes/FeStyle'
import { View, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native'
import { SET_FORM_LAYOUT_STATE, FormLayout, SET_TRANSIENT_BACK_PRESSED } from '../lib/constants'
import { Select_Next_Status } from '../lib/AttributeConstants'
import { Container, Header, Text, Body, Icon, Content, List, ListItem, Right, } from 'native-base'
import _ from 'lodash'

function mapStateToProps(state) {
    return {
        formLayoutStates: state.transientStatus.formLayoutStates,
        loaderRunning: state.transientStatus.loaderRunning,
        transientBackPressed: state.transientStatus.transientBackPressed
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...transientStatusActions, ...globalActions }, dispatch)
    }
}

class Transient extends PureComponent {

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    componentDidMount() {
        this.props.actions.setStateFromNavigationParams(
            this.props.navigation.state.params,
            this.props.formLayoutStates)
    }

    navigateToFormLayout(statusId, statusName) {
        this.props.actions.navigateToScene(FormLayout, {
            contactData: this.props.navigation.state.params.contactData,
            jobTransactionId: this.props.navigation.state.params.jobTransaction.id,
            jobTransaction: this.props.navigation.state.params.jobTransaction,
            statusId,
            statusName,
            jobMasterId: this.props.navigation.state.params.jobMasterId,
            navigationFormLayoutStates: this.props.formLayoutStates,
            jobDetailsScreenKey: this.props.navigation.state.params.jobDetailsScreenKey,
            pageObjectAdditionalParams: this.props.navigation.state.params.pageObjectAdditionalParams
        })
    }

    componentDidUpdate() {
        if (this.props.transientBackPressed) {
            this._goBack()
            this.props.actions.setState(SET_TRANSIENT_BACK_PRESSED, false)
        }
    }

    _goBack = () => {
        this.props.navigation.goBack()
        this.props.actions.setState(SET_FORM_LAYOUT_STATE, {
            editableFormLayoutState: this.props.formLayoutStates[this.props.navigation.state.params.currentStatus.id],
            statusName: this.props.navigation.state.params.currentStatus.name
        })
    }

    renderData = (item) => {
        return (
            <ListItem style={[style.jobListItem]} onPress={() => this.navigateToFormLayout(item.id, item.name)}>
                <View style={[styles.row, styles.alignCenter]}>
                    <View style={[style.statusCircle, { backgroundColor: item.buttonColor }]}></View>
                    <Text style={[styles.fontDefault, styles.fontWeight500, styles.marginLeft10]}>{item.name}</Text>
                </View>
                <Right>
                    <Icon name="ios-arrow-forward" style={[styles.fontDefault, styles.fontBlack]} />
                </Right>
            </ListItem>
        )
    }

    _keyExtractor = (item, index) => String(item.id);


    render() {
        if (this.props.loaderRunning) {
            return (
                <Loader />
            )
        }
        return (
            <Container>
                <SafeAreaView style={{ backgroundColor: styles.bgPrimaryColor }}>
                    <Header style={StyleSheet.flatten([{ backgroundColor: styles.bgPrimaryColor }, style.header])}>
                        <Body>
                            <View
                                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                                <TouchableOpacity style={[style.headerLeft]} onPress={this._goBack}>
                                    <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                                </TouchableOpacity>
                                <View style={[style.headerBody]}>
                                    <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>
                                        {this.props.navigation.state.params.currentStatus.name}
                                    </Text>
                                </View>
                                <View style={[style.headerRight]}>
                                </View>
                            </View>
                        </Body>
                    </Header>
                </SafeAreaView>

                <Content style={[styles.bgWhite]}>
                    <View style={[styles.flexBasis25]}>
                        <Text style={[styles.fontSm, { color: styles.fontPrimaryColor }, styles.padding15]}>{Select_Next_Status}</Text>
                        <List style={[styles.flex1]}>
                            <FlatList
                                data={this.props.navigation.state.params.currentStatus.nextStatusList}
                                extraData={this.state}
                                renderItem={(item) => this.renderData(item.item)}
                                keyExtractor={this._keyExtractor}>
                            </FlatList>
                        </List>
                    </View>
                </Content>
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
    },
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
    statusCircle: {
        width: 10,
        height: 10,
        borderRadius: 5
    }
});
/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(Transient)
