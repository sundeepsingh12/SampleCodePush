import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    TouchableHighlight,
    ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as sortingActions from '../modules/sorting/sortingActions'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf';
import QRCode from 'react-native-qrcode-svg';
import Loader from '../components/Loader'
import _ from 'underscore';
import { NA,SORTING_PLACEHOLDER } from '../lib/AttributeConstants'
import {
    Container,
    Text,
    List,
    ListItem,
    Icon,
    Header,
    Title,
    Footer,
    Button,
    FooterTab,
    InputGroup,
    Input,
    Body, 
    Content,
    Item,
    Toast,
} from 'native-base';
function mapStateToProps(state) {
    return {
        searchRefereneceValue: state.sorting.searchRefereneceValue,
        sortingDetails: state.sorting.sortingDetails,
        loaderRunning: state.sorting.loaderRunning,
        errorMessage: state.sorting.errorMessage,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...sortingActions }, dispatch)
    }
}

class SortingListing extends Component {

    renderData = (item) => {
        return (
            <View>
                {renderIf(item.value != NA,
                    <View>
                        <Text style={[styles.fontDefault, styles.fontWeight500, styles.lineHeight25]}>
                            {item.label}
                        </Text>
                        <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20]}>
                            {item.value}
                        </Text>
                    </View>
                ) }
            </View>
        )
    }

    render() {
        return (
            <View style = {{flex : 1, flexDirection : 'row'}}>
                <View style = {{flex : 3}}>
                    <QRCode
                        value={this.props.sortingDetails[0].value}
                        logoSize={30}
                        logoBackgroundColor='transparent'
                    />
                </View>
                <View style = {{flex : 6}}>
                    <FlatList
                        data={(Object.values(this.props.sortingDetails))}
                        renderItem={({ item }) => this.renderData(item)}
                        keyExtractor={item => item.id}
                    />
                </View>
            </View>
        )
    }
}


class Sorting extends Component {

    _onChangeReferenceValue(value) {
        this.props.actions.searchReferenceValue(value)
    }

    _searchForReferenecceValue(referenceNumber) {
        this.props.actions.getDataForSortingAndPrinting(referenceNumber)
    }

    render() {
        if ((this.props.errorMessage != null && this.props.errorMessage != undefined && this.props.errorMessage.length != 0)) {
            Toast.show({
                text: this.props.errorMessage,
                position: 'bottom',
                buttonText: 'Okay'
            })
        }
        return (
            <View style = {{flex: 1,flexDirection: 'column'}} >
                <View style = {{flex : 4}}>
                    <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
                        <Body>
                            <View style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.marginBottom10, styles.marginTop15]}>
                                <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]} onPress={() => { this.props.navigation.goBack(this._onChangeReferenceValue('')) }} />
                                <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter, styles.justifyCenter]}>Sorting</Text>
                            </View>
                            <View style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.relative]}>
                                <Input
                                    value={this.props.searchRefereneceValue.value}
                                    onChangeText={value => this._onChangeReferenceValue(value)}
                                    placeholder={SORTING_PLACEHOLDER}
                                    placeholderTextColor={'rgba(255,255,255,.4)'}
                                    style={[style.headerSearch]} />
                                <Button small transparent style={[style.headerQRButton]} onPress={() => { this._searchForReferenecceValue(this.props.searchRefereneceValue) }}>
                                    <Icon name="md-qr-scanner" style={[styles.fontWhite, styles.fontXl]} />
                                </Button>
                            </View>
                        </Body>
                    </Header>
                </View>
                <View style = {{flex : 6}}>
                    {renderIf(this.props.loaderRunning,
                        <ActivityIndicator animating={this.props.loaderRunning} style={StyleSheet.flatten([{ marginTop: 30, alignItems: 'center', justifyContent: 'center' }])} size="large" color="blue" />)}
                    {renderIf(!(this.props.loaderRunning), ((this.props.searchRefereneceValue === '') && !(_.isEmpty(this.props.sortingDetails)) && this.props.sortingDetails[0].value !== NA) ?
                        <SortingListing searchRefereneceValue={this.props.searchRefereneceValue} sortingDetails={this.props.sortingDetails} /> :
                        <Text style={[ styles.margin30, styles.fontDefault, styles.fontDarkGray]}>Search/Scan QR code in the top bar to Start</Text>
                    )}
                </View>
            </View>
        )
    }
}
const style = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        height: 'auto',
        paddingTop: 10,
        paddingBottom: 10
    },
    headerSearch: {
        paddingLeft: 15,
        paddingRight: 35,
        backgroundColor: '#1260be',
        borderRadius: 2,
        height: 40,
        color: '#fff',
        fontSize: 14
    },
    headerQRButton: {
        position: 'absolute',
        right: 5,
        paddingLeft: 0,
        paddingRight: 0
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(Sorting)