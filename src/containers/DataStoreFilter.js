'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as globalActions from '../modules/global/globalActions'
import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    Modal,
    ScrollView,
    FlatList,
} from 'react-native'
import { List, ListItem, Item, Icon, Input } from 'native-base'
import * as dataStoreFilterActions from '../modules/dataStoreFilter/dataStoreFilterActions'
import Loader from '../components/Loader'
import styles from '../themes/FeStyle'
import {
    SET_DSF_SEARCH_TEXT,
    DATA_STORE_FILTER_LIST,
    SET_DSF_INITIAL_STATE,
} from '../lib/constants'
import { SEARCH } from '../lib/AttributeConstants'

function mapStateToProps(state) {
    return {
        isLoaderForDSFRunning: state.dataStoreFilterReducer.isLoaderForDSFRunning,
        dataStoreFilterList: state.dataStoreFilterReducer.dataStoreFilterList,
        DSFSearchText: state.dataStoreFilterReducer.DSFSearchText,
        cloneDataStoreFilterList: state.dataStoreFilterReducer.cloneDataStoreFilterList,
        dataStoreFilterReverseMap: state.formLayout.dataStoreFilterReverseMap,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...dataStoreFilterActions, ...globalActions }, dispatch)
    }
}

class DataStoreFilter extends PureComponent {

    componentDidMount() {
        this.props.actions.getDSFListContent(this.props.currentElement,
            this.props.formElement,
            this.props.jobTransaction,
            this.props.dataStoreFilterReverseMap)
    }

    _dropModal() {
        this.props.actions.setState(SET_DSF_INITIAL_STATE)
        this.props.onClose()
    }

    dataStoreFilterItemDetails(item) {
        return <ListItem style={[style.jobListItem]}
            onPress={() => {
                this.props.actions.onSave(
                    this.props.currentElement.fieldAttributeMasterId,
                    this.props.formElement,
                    this.props.isSaveDisabled,
                    item,
                    this.props.latestPositionId,
                    this.props.jobTransaction,
                    this.props.dataStoreFilterReverseMap,
                    this.props.fieldAttributeMasterParentIdMap)
                this._dropModal()
            }}>
            <View style={[styles.row, styles.alignCenter]}>
                <Text style={[styles.fontDefault, styles.fontWeight300]}>{item}</Text>
            </View>
        </ListItem>
    }

    getLoaderView() {
        if (this.props.isLoaderForDSFRunning) {
            return <Loader />
        }
    }

    onSearch(searchText) {
        this.props.actions.setState(SET_DSF_SEARCH_TEXT, searchText)
        if (searchText != '') {
            this.props.actions.getFilteredResults(this.props.dataStoreFilterList, this.props.cloneDataStoreFilterList, searchText)
        } else if (!_.isEmpty(this.props.cloneDataStoreFilterList)) {
            this.props.actions.setState(DATA_STORE_FILTER_LIST, this.props.cloneDataStoreFilterList)
        }
    }

    scrollDSFilterListView() {
        if (!this.props.isLoaderForDSFRunning) {
            return <ScrollView style={[styles.bgWhite, styles.flex1, styles.paddingBottom30, styles.flexBasis80, styles.marginTop5, { height: '100%' }]}>
                <View
                    style={[styles.flex1, { alignSelf: 'stretch' }]}>
                    <List style={[styles.flexBasis100]}>
                        < FlatList
                            data={this.props.dataStoreFilterList}
                            renderItem={({ item }) => this.dataStoreFilterItemDetails(item)}
                            keyExtractor={item => item}
                        />
                    </List>
                </View>
            </ScrollView>
        }
    }

    render() {
        let loaderView = this.getLoaderView()
        let scrollDSFilterList = this.scrollDSFilterListView()
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={true}
                onRequestClose={() => this._dropModal()}>
                <TouchableHighlight
                    onPress={() => this._dropModal()}
                    style={[styles.flex1, styles.column, styles.justifyEnd, { backgroundColor: 'rgba(0,0,0,.5)' }]}>
                    <TouchableHighlight style={{ backgroundColor: '#ffffff', flex: .6 }}>
                        <View>
                            <View style={[styles.bgLightGray]}>
                                <View style={[styles.row, styles.justifySpaceBetween, styles.bgLightGray]}>
                                    <Text style={[styles.padding10]}>{this.props.currentElement.label}</Text>
                                </View>
                                <View>
                                    <View searchBar style={[styles.padding5]}>
                                        <Item rounded style={{ height: 30, backgroundColor: '#ffffff' }}>
                                            <Input placeholder={SEARCH}
                                                style={[styles.fontSm, styles.justifyCenter, { marginTop: 0, lineHeight: 10 }]}
                                                onChangeText={(searchText) => {
                                                    this.onSearch(searchText)
                                                }}
                                                value={this.props.DSFSearchText}
                                            />
                                            <Icon style={[styles.fontSm]} name="md-close"
                                                onPress={() => {
                                                    this.onSearch('')
                                                }}
                                            />
                                        </Item>
                                    </View>
                                </View>
                            </View >
                            <View style={{ height: '100%' }}>
                                {loaderView}
                                {scrollDSFilterList}
                            </View>
                        </View>
                    </TouchableHighlight>
                </TouchableHighlight>
            </Modal >
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
});

export default connect(mapStateToProps, mapDispatchToProps)(DataStoreFilter)
