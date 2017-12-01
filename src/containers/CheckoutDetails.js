import React, { Component } from 'react'
import renderIf from '../lib/renderIf'
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'

import {
    Container,
    Content,
    Header,
    Button,
    Text,
    Left,
    Body,
    Right,
    Icon,
    List,
    ListItem,
    StyleProvider,
    Footer,
    FooterTab
} from 'native-base';

const {
    Home,
    Print,
    Receipt,
    SMS,
    TotalAmount
} = require('../lib/constants').default

import {
    EMAIL,
    Return_To_Home,
    View_SignOff_Summary,
    View_Parcel_Summary,
    Sign_Off_Summary
} from '../lib/AttributeConstants'

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

/*
 * Bind all the actions
 */
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...saveActivatedActions }, dispatch)
    }
}
class CheckoutDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isParcelSummaryVisible: false,
            signOffSummary: false
        }
    }

    componentDidMount() {
        if (!this.props.navigation.state.params.calledFromNewJob) {
            this.props.actions.storeState({}, 'CheckoutDetails', this.props.navigation.state.params.jobMasterId, {
                commonData: this.props.navigation.state.params.commonData,
                recurringData: this.props.navigation.state.params.recurringData,
                signOfData: this.props.navigation.state.params.signOfData,
                totalAmount: this.props.navigation.state.params.totalAmount
            })
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

    _signOffSummary = (signOffSummary) => {
        this.setState(() => {
            return {
                signOffSummary: signOffSummary
            }
        })
    }

    render() {
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
                        <View style={[styles.bgWhite]}>
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
                                <ListItem style={[style.jobListItem]} >
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
                                <ListItem style={[style.jobListItem]} >
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
                        </View>
                        {/* List View */}
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
                                this.props.actions.clearStateAndStore()
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
export default connect(null, mapDispatchToProps)(CheckoutDetails)