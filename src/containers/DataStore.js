'use strict'
import React, { Component } from 'react'
import * as dataStoreActions from '../modules/dataStore/dataStoreActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SearchBar from '../components/SearchBar'
import * as globalActions from '../modules/global/globalActions'
import renderIf from '../lib/renderIf'
import Loader from '../components/Loader'
import styles from '../themes/FeStyle'
import DataStoreItemDetails from '../components/DataStoreItemDetails'
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native'
import {
    SET_DATA_STORE_ATTR_MAP,
    SET_SEARCH_TEXT,
    SHOW_DETAILS,
    _id,
    SET_INITIAL_STATE
} from '../lib/constants'
import {
    FooterTab,
    Card,
    Container,
    Content,
    Button,
    Text,
    Footer,
    Toast
} from 'native-base';
import _ from 'underscore'
import {
    EXTERNAL_DATA_STORE,
} from '../lib/AttributeConstants'

function mapStateToProps(state) {
    return {
        isSearchEnabled: state.dataStore.isSearchEnabled,
        isAutoStartScannerEnabled: state.dataStore.isAutoStartScannerEnabled,
        isScannerEnabled: state.dataStore.isScannerEnabled,
        isMinMaxValidation: state.dataStore.isMinMaxValidation,
        dataStoreAttrValueMap: state.dataStore.dataStoreAttrValueMap,
        loaderRunning: state.dataStore.loaderRunning,
        errorMessage: state.dataStore.errorMessage,
        searchText: state.dataStore.searchText,
        detailsVisibleFor: state.dataStore.detailsVisibleFor,
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

    componentWillMount() {
        console.log(this.props.navigation.state.params.currentElement)
        this.props.actions.setState(SET_INITIAL_STATE)
        this.props.actions.setValidation(this.props.navigation.state.params.currentElement.validation)
    }

    getTextData(item) {
        let firstValue = item.dataStoreAttributeValueMap[item.matchKey]
        let secondValue
        if (item.matchKey == item.uniqueKey || item.uniqueKey == _id) {
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
            <Card>
                <TouchableOpacity
                    onPress={() => this.showDetails(item.id, firstValue, false)}>
                    <View style={[style.cardLeidft]}>
                        {renderIf(firstValue, <View style={[style.cardLeftTopRow]}>
                            <Text style={[styles.flexBasis60, styles.fontDefault, styles.padding10, styles.fontWeight500, styles.fontDefault]}>{firstValue}</Text>
                        </View>)}
                        {renderIf(secondValue, <View style={[styles.row]}>
                            <Text style={[styles.flexBasis60, styles.fontDefault, styles.padding10, styles.fontWeight400, styles.fontSm]}>{secondValue}</Text>
                        </View>)}
                    </View>
                </TouchableOpacity>
            </Card >
        )
    }

    showDetails = (itemId, dataStoreValue, isCancel) => {
        if (this.props.navigation.state.params.currentElement.attributeTypeId == EXTERNAL_DATA_STORE && this.props.isMinMaxValidation && !isCancel) {
            this.props.actions.uniqueValidationCheck(dataStoreValue,
                this.props.navigation.state.params.currentElement.fieldAttributeMasterId,
                itemId)
        } else {
            this.props.actions.setState(SHOW_DETAILS, itemId)
        }
    }

    setSearchText = (searchText) => {
        this.props.actions.setState(SET_SEARCH_TEXT, searchText)
    }

    fetchDataStoreAttrValueMap = _.debounce((searchText, manualSearch) => {
        if ((this.props.isSearchEnabled || manualSearch) && searchText.length > 2) {
            this.props.actions.getDataStoreAttrValueMap(searchText,
                this.props.navigation.state.params.currentElement.dataStoreMasterId,
                this.props.navigation.state.params.currentElement.dataStoreAttributeId,
                this.props.navigation.state.params.currentElement.externalDataStoreMasterUrl,
                this.props.navigation.state.params.currentElement.key)
        }
        if (searchText.length <= 2) {
            this.props.actions.setState(SET_DATA_STORE_ATTR_MAP, {})
        }
    }, 500)


    _goBack = () => {
        this.props.navigation.goBack(null)
    }

    onSave = (dataStoreAttributeValueMap, dataStoreValue) => {
        this.props.actions.fillKeysAndSave(dataStoreAttributeValueMap,
            this.props.navigation.state.params.currentElement.fieldAttributeMasterId,
            this.props.navigation.state.params.formElements,
            this.props.navigation.state.params.nextEditable,
            this.props.navigation.state.params.isSaveDisabled,
            dataStoreValue,
            this.props.isMinMaxValidation,
        )
        this.setDetailsFor()
        this._goBack()
    }

    setDetailsFor = () => {
        this.props.actions.setState(SHOW_DETAILS, -1)
    }

    render() {

        if (this.props.errorMessage != '') {
            Toast.show({
                text: this.props.errorMessage,
                position: "bottom" | "center",
                buttonText: 'Okay',
                type: 'danger',
                duration:5000
            })
        }
        if (this.props.detailsVisibleFor == -1) {
            return (
                < Container >
                    <SearchBar
                        title={this.props.navigation.state.params.currentElement.label}
                        isScannerEnabled={this.props.isScannerEnabled}
                        fetchDataStoreAttrValueMap={this.fetchDataStoreAttrValueMap}
                        goBack={this._goBack}
                        searchText={this.props.searchText}
                        setSearchText={this.setSearchText} />
                    <Content style={[styles.marginLeft10]}>
                        {renderIf(this.props.loaderRunning,
                            <Loader />)}
                        {renderIf(!_.isEmpty(this.props.dataStoreAttrValueMap),
                            <Text style={[styles.fontWeight400, styles.fontDarkGray, styles.fontSm]}>Suggestions</Text>)}
                        {renderIf(!this.props.loaderRunning,
                            < FlatList
                                data={Object.values(this.props.dataStoreAttrValueMap)}
                                renderItem={({ item }) => this.renderData(item)}
                                keyExtractor={item => item.id}
                            />)}
                    </Content>
                    {renderIf(this.props.isMinMaxValidation &&
                        this.props.searchText.length > 2 &&
                        this.props.navigation.state.params.currentElement.attributeTypeId != 63,
                        <Footer style={{ height: 'auto', backgroundColor: 'white' }}>
                            <FooterTab style={StyleSheet.flatten([styles.padding10, styles.bgWhite])}>
                                <Button success full style={styles.bgPrimary}
                                    onPress={() => {
                                        this.props.actions.onSave(
                                            this.props.navigation.state.params.currentElement.fieldAttributeMasterId,
                                            this.props.navigation.state.params.formElements,
                                            this.props.navigation.state.params.nextEditable,
                                            this.props.navigation.state.params.isSaveDisabled,
                                            this.props.searchText
                                        )
                                        this._goBack()
                                    }}>
                                    <Text style={[styles.fontLg, styles.fontWhite]}>Save</Text>
                                </Button>
                            </FooterTab>
                        </Footer>)
                    }
                </Container >
            )
        }
        return (
            < DataStoreItemDetails
                selectedElement={this.props.dataStoreAttrValueMap[this.props.detailsVisibleFor]}
                goBack={this.showDetails}
                onSave={this.onSave} />
        )
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
});

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(DataStore)
