'use strict'
import React, { PureComponent } from 'react'
import * as dataStoreActions from '../modules/dataStore/dataStoreActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SearchBar from '../components/SearchBar'
import * as globalActions from '../modules/global/globalActions'
import Loader from '../components/Loader'
import styles from '../themes/FeStyle'
import DataStoreItemDetails from '../components/DataStoreItemDetails'
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { SET_DATA_STORE_ATTR_MAP, SET_SEARCH_TEXT, SHOW_DETAILS, _id, SET_INITIAL_STATE, QrCodeScanner, DISABLE_AUTO_START_SCANNER, SHOW_LOADER_DS } from '../lib/constants'
import { FooterTab, Card, Container, Content, Button, Text, Footer, Toast } from 'native-base'
import { EXTERNAL_DATA_STORE, DATA_STORE } from '../lib/AttributeConstants'
import _ from 'lodash'
import { SUGGESTIONS, OK } from '../lib/ContainerConstants'
import TitleHeader from '../components/TitleHeader'
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
        dataStoreFilterReverseMap: state.formLayout.dataStoreFilterReverseMap,
        isFiltersPresent: state.dataStore.isFiltersPresent,
        cloneDataStoreAttrValueMap: state.dataStore.cloneDataStoreAttrValueMap,
        arrayReverseDataStoreFilterMap: state.formLayout.arrayReverseDataStoreFilterMap,
        isAllowFromFieldInExternalDS: state.dataStore.isAllowFromFieldInExternalDS,
        isDataStoreEditable: state.dataStore.isDataStoreEditable,
        keyLabelAttributeMap: state.dataStore.keyLabelAttributeMap
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...dataStoreActions, ...globalActions }, dispatch)
    }
}

class DataStore extends PureComponent {

    static navigationOptions = ({ navigation }) => {
        return { header: <TitleHeader pageName={navigation.state.params.currentElement.label} goBack={navigation.goBack} /> }
    }

    componentDidMount() {
        //case if Data store is in Array
        if (this.props.navigation.state.params.calledFromArray) {
            this.props.actions.checkForFiltersAndValidationForArray({
                currentElement: this.props.navigation.state.params.currentElement,
                formLayoutState: this.props.navigation.state.params.formLayoutState,
                jobTransaction: this.props.navigation.state.params.jobTransaction,
                arrayReverseDataStoreFilterMap: this.props.arrayReverseDataStoreFilterMap,
                arrayFieldAttributeMasterId: this.props.navigation.state.params.arrayFieldAttributeMasterId,
                rowId: this.props.navigation.state.params.rowId
            })
        } else {
            this.props.actions.checkForFiltersAndValidation(
                this.props.navigation.state.params.currentElement,
                this.props.navigation.state.params.formLayoutState,
                this.props.navigation.state.params.jobTransaction,
                this.props.dataStoreFilterReverseMap)
        }
    }

    componentDidUpdate() {
        if (this.props.isAutoStartScannerEnabled) {
            this.scanner()
            this.props.actions.setState(DISABLE_AUTO_START_SCANNER, false)
        }
        if (this.props.errorMessage != '') {
            Toast.show({
                text: this.props.errorMessage,
                position: "bottom",
                buttonText: OK,
                type: 'danger',
                duration: 3000
            })
        }
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
                    <View style={[style.cardLeft]}>
                        {firstValue && <View style={[style.cardLeftTopRow]}>
                            <Text style={[styles.flexBasis60, styles.fontDefault, styles.padding10, styles.fontWeight500, styles.fontDefault]}>{firstValue}</Text>
                        </View>}
                        {secondValue && <View style={[styles.row]}>
                            <Text style={[styles.flexBasis60, styles.fontDefault, styles.padding10, styles.fontWeight400, styles.fontSm]}>{secondValue}</Text>
                        </View>}
                    </View>
                </TouchableOpacity>
            </Card>
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

    searchDataStoreAttributeValueMap = (searchText) => {
        if (searchText != '') {
            this.props.actions.searchDataStoreAttributeValueMap(searchText, this.props.dataStoreAttrValueMap, this.props.cloneDataStoreAttrValueMap)
        } else {
            this.props.actions.setState(SET_DATA_STORE_ATTR_MAP, {
                dataStoreAttrValueMap: this.props.cloneDataStoreAttrValueMap,
                searchText: ''
            })
        }
    }

    fetchDataStoreAttrValueMap = _.debounce((searchText, manualSearch) => {
        if ((this.props.isSearchEnabled || manualSearch) && searchText.length > 2) {
            this.props.actions.checkOfflineDS(searchText,
                this.props.navigation.state.params.currentElement.dataStoreMasterId,
                this.props.navigation.state.params.currentElement.dataStoreAttributeId,
                this.props.navigation.state.params.currentElement.externalDataStoreMasterUrl,
                this.props.navigation.state.params.currentElement.key,
                this.props.navigation.state.params.currentElement.attributeTypeId
            )
        }
        if (searchText.length <= 2) {
            this.props.actions.setState(SET_DATA_STORE_ATTR_MAP, {
                dataStoreAttrValueMap: this.props.cloneDataStoreAttrValueMap,
                searchText
            })
        }
    }, 500)


    _goBack = () => {
        this.props.actions.setState(SET_INITIAL_STATE)
        this.props.navigation.goBack(null)
    }

    onSave = (dataStoreAttributeValueMap, dataStoreValue) => {
        this.props.actions.fillKeysAndSave(dataStoreAttributeValueMap,
            this.props.navigation.state.params.currentElement.fieldAttributeMasterId,
            this.props.navigation.state.params.formLayoutState,
            dataStoreValue,
            this.props.navigation.state.params.calledFromArray,
            this.props.navigation.state.params.rowId,
            this.props.navigation.state.params.jobTransaction,
        )
    }

    _searchDataStore = (value) => {
        this.fetchDataStoreAttrValueMap(value, false)
        this.setSearchText(value)
    }

    scanner = () => {
        this.props.navigation.navigate(QrCodeScanner, { returnData: this._searchDataStore.bind(this) })
    }

    flatListView() {
        let flatListView
        if (!this.props.loaderRunning && !_.isEmpty(this.props.dataStoreAttrValueMap)) {
            flatListView = < FlatList
                data={Object.values(this.props.dataStoreAttrValueMap)}
                renderItem={({ item }) => this.renderData(item)}
                keyExtractor={item => String(item.id)}
            />
        }
        return flatListView
    }

    getLoader() {
        if (this.props.loaderRunning) {
            return <Loader />
        }
    }

    getSuggestionsText() {
        if (!this.props.loaderRunning && !_.isEmpty(this.props.dataStoreAttrValueMap)) {
            return <Text style={[styles.fontWeight400, styles.fontDarkGray, styles.fontSm]}>{SUGGESTIONS}</Text>
        }
    }

    render() {
        if (this.props.detailsVisibleFor == -1) {
            return (
                <Container>
                    <SearchBar
                        title={this.props.navigation.state.params.currentElement.label}
                        isScannerEnabled={this.props.isScannerEnabled}
                        isAutoStartScannerEnabled={this.props.isAutoStartScannerEnabled}
                        fetchDataStoreAttrValueMap={this.fetchDataStoreAttrValueMap}
                        goBack={this._goBack}
                        searchText={this.props.searchText}
                        setSearchText={this.setSearchText}
                        scanner={this.scanner}
                        isFiltersPresent={this.props.isFiltersPresent}
                        searchDataStoreAttributeValueMap={this.searchDataStoreAttributeValueMap}
                        isDataStoreEditable={this.props.isDataStoreEditable} />

                    <Content style={[styles.marginLeft10]}>
                        {this.getLoader()}
                        {this.getSuggestionsText()}
                        {this.flatListView()}
                    </Content>
                    {(((this.props.isMinMaxValidation && this.props.navigation.state.params.currentElement.attributeTypeId == DATA_STORE) || this.props.isAllowFromFieldInExternalDS) && _.size(this.props.searchText) > 2) &&
                        <SafeAreaView style={{ backgroundColor: 'white' }}>
                            <Footer style={{ height: 'auto', backgroundColor: 'white' }}>
                                <FooterTab style={StyleSheet.flatten([styles.padding10, styles.bgWhite])}>
                                    <Button success full style={{ backgroundColor: styles.bgPrimaryColor }}
                                        onPress={() => {
                                            this.props.actions.onSave(
                                                this.props.navigation.state.params.currentElement.fieldAttributeMasterId,
                                                this.props.navigation.state.params.formLayoutState,
                                                this.props.searchText,
                                                this.props.navigation.state.params.calledFromArray,
                                                this.props.navigation.state.params.rowId,
                                                this.props.navigation.state.params.jobTransaction,
                                            )
                                        }}>
                                        <Text style={[styles.fontLg, styles.fontWhite]}>Save</Text>
                                    </Button>
                                </FooterTab>
                            </Footer>
                        </SafeAreaView>}
                </Container >
            )
        }
        return (
            <DataStoreItemDetails
                selectedElement={this.props.dataStoreAttrValueMap[this.props.detailsVisibleFor]}
                goBack={this.showDetails}
                onSave={this.onSave}
                keyLabelAttributeMap={this.props.keyLabelAttributeMap} />
        )
    }

    /**
     * clear state when container unMount
     */
    componentWillUnmount() {
        this.props.actions.setState(SET_INITIAL_STATE)
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
