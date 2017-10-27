'use strict'
import React, { Component } from 'react'
// import { StyleSheet, View, FlatList } from 'react-native'
import * as dataStoreActions from '../modules/dataStore/dataStoreActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SearchBar from '../components/SearchBar'
import { ARRAY_SAROJ_FAREYE } from '../lib/AttributeConstants'
import * as globalActions from '../modules/global/globalActions'
import FixedSKUListItem from '../components/FixedSKUListItem'
import renderIf from '../lib/renderIf'
import Loader from '../components/Loader'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import { StyleSheet, View, Image, TouchableHighlight } from 'react-native'
import {
    Container,
    Content,
    Header,
    Button,
    Text,
    Input,
    List,
    ListItem,
    Left,
    Body,
    Right,
    Icon,
    Footer,
    CheckBox,
    StyleProvider
} from 'native-base';

function mapStateToProps(state) {
    return {
        isSearchEnabled: state.dataStore.isSearchEnabled,
        isAutoStartScannerEnabled: state.dataStore.isAutoStartScannerEnabled,
        isScannerEnabled: state.dataStore.isScannerEnabled,
        isAllowFromField: state.dataStore.isAllowFromField,
        dataStoreAttrValueMap: state.dataStore.dataStoreAttrValueMap
    }
};

/*
 * Bind all the actions
 */
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...dataStoreActions, ...globalActions }, dispatch)
    }
}

class DataStore extends Component {

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }
    getTextData(item) {
        let firstValue = item.dataStoreAttributeValueMap[item.matchKey]
        let secondValue
        if (item.matchKey == item.uniqueKey) {
            for (let singleItem in item.dataStoreAttributeValueMap) {
                if (item.dataStoreAttributeValueMap[singleItem] != firstValue) {
                    secondValue = item.dataStoreAttributeValueMap[singleItem]
                    break
                }
            }
        } else {
            secondValue = item.dataStoreAttributeValueMap[item.uniqueKey]
        }
        return {
            firstValue,
            secondValue
        }
    }

    renderData = (item) => {
        let { firstValue, secondValue } = this.getTextData(item)
        return (
            <View>
                <Card>
                    {renderIf(firstValue,
                        <Text>{firstValue}</Text>)}
                    {renderIf(secondValue,
                        <Text>{secondValue}</Text>)}
                </Card>
            </View>
        )
    }


    componentWillMount() {
        console.log('abhishek', this.props.navigation.state.params.currentElement)
        this.props.actions.setValidation(this.props.navigation.state.params.currentElement.validation)
    }

    fetchDataStoreAttrValueMap = (searchText) => {
        console.log('searchText', searchText)
        this.props.actions.getDataStoreAttrValueMap(searchText, this.props.navigation.state.params.currentElement.dataStoreMasterId, this.props.navigation.state.params.currentElement.dataStoreAttributeId)
    }

    render() {
        console.log('render', this.props)
        return (
            <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
                <Body>
                    <View
                        style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.marginBottom10, styles.marginTop15]}>
                        <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]} onPress={() => { this.props.navigation.goBack(null) }} />
                        <Text
                            style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>Search Merchant Name</Text>
                        <View />
                    </View>
                    <View
                        style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.relative]}>
                        <Input
                            placeholder="Filter Reference Numbers"
                            placeholderTextColor={'rgba(255,255,255,.4)'}
                            style={[style.headerSearch]} />
                        <Button small transparent style={[style.headerQRButton]}>
                            <Icon name="md-qr-scanner" style={[styles.fontWhite, styles.fontXl]} />
                        </Button>
                    </View>
                </Body>
            </Header>

            // <Container>
            //     <View>
            //         <SearchBar isSearchEnabled={this.props.isSearchEnabled} isScannerEnabled={this.props.isScannerEnabled} isAllowFromField={this.props.isAllowFromField} getDataStoreAttrValueMap={this.fetchDataStoreAttrValueMap} />
            //         {/* <FlatList
            //             data={Object.values(this.props.dataStoreAttrValueMap)}
            //             renderItem={({ item }) => this.renderData(item)}
            //             keyExtractor={item => item.id}
            //         />
            //         {renderIf(this.props.isAllowFromField,
            //             <Button>
            //                 <Text style={{ textAlign: 'center', width: '100%', color: 'white' }}>Save</Text>
            //             </Button>)} */}

            //     </View>
            // </Container>
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
    headerIcon: {
        width: 24
    },
    headerSearch: {
        paddingLeft: 10,
        paddingRight: 30,
        backgroundColor: '#1260be',
        borderRadius: 2,
        height: 30,
        color: '#fff',
        fontSize: 10
    },
    headerQRButton: {
        position: 'absolute',
        right: 5,
        paddingLeft: 0,
        paddingRight: 0
    },
    card: {
        paddingLeft: 10,
        marginBottom: 10,
        backgroundColor: '#ffffff',
        elevation: 1,
        shadowColor: '#d3d3d3',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 2
    },
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
    cardRight: {
        width: 40,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardCheckbox: {
        alignSelf: 'center',
        backgroundColor: 'green',
        position: 'absolute',
        marginLeft: 10,
        borderRadius: 0,
        left: 0
    }

});

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(DataStore)
