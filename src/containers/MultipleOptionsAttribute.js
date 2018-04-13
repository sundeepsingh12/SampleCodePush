//This class works for checkBox, RadioButton, DropDown.
'use strict'
import _ from 'lodash'
import styles from '../themes/FeStyle'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import {
    View,
    Text,
    TouchableHighlight,
    Modal,
    ScrollView,
    Animated,
    Dimensions,
} from 'react-native'
import {
    Icon,
    Input,
    ListItem,
    Item,
    CheckBox,
    Radio,
    Body,
    Right
} from 'native-base'
import * as globalActions from '../modules/global/globalActions'
import * as formLayoutActions from '../modules/form-layout/formLayoutActions.js'
import * as multipleOptionsAttributeActions from '../modules/multipleOptionsAttribute/multipleOptionsAttributeActions'
import {
    CHECKBOX,
    RADIOBUTTON,
    DROPDOWN,
    OPTION_RADIO_FOR_MASTER,
    SEARCH,
    ADVANCE_DROPDOWN
} from '../lib/AttributeConstants'
import {
    SET_MODAL_FIELD_ATTRIBUTE,
    SET_OPTION_ATTRIBUTE_ERROR,
    SET_OPTION_SEARCH_INPUT,
    SET_ADV_DROPDOWN_MESSAGE_OBJECT,
    SET_ERROR_AND_ADV_DROPDOWN_MESSAGE_NULL
} from '../lib/constants'
import {
    DONE,
    NO_OPTIONS_PRESENT,
    DISMISS,
    MULTIPLE_SELECT_OPTIONS
} from '../lib/ContainerConstants'

function mapStateToProps(state) {
    return {
        optionsMap: state.multipleOptionsAttribute.optionsMap,
        error: state.multipleOptionsAttribute.error,
        searchInput: state.multipleOptionsAttribute.searchInput,
        advanceDropdownMessageObject: state.multipleOptionsAttribute.advanceDropdownMessageObject
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...multipleOptionsAttributeActions, ...globalActions, ...formLayoutActions }, dispatch)
    }
}

class MultipleOptionsAttribute extends PureComponent {

    constructor(props) {
        super(props);
        this.animatedValue = new Animated.Value(120)
    }

    componentDidMount() {
        let formElement = this.props.calledFromArray ? this.props.formLayoutState.formElement[this.props.rowId].formLayoutObject : this.props.formLayoutState.formElement
        if (this.props.currentElement.attributeTypeId == OPTION_RADIO_FOR_MASTER) {
            this.props.actions.getOptionsListFromJobData(this.props.currentElement, this.props.jobTransaction)
        } else {
            this.props.actions.getOptionsList(this.props.currentElement.fieldAttributeMasterId, formElement, this.props.currentElement.attributeTypeId)
        }
    }

    renderOptionView(item) {
        let fieldAttributeView = null, checkForIcon = false
        if (this.props.currentElement.attributeTypeId == CHECKBOX) {
            fieldAttributeView = <CheckBox
                checked={item.selected}
                color={styles.primaryColor}
                onPress={() => {
                    this.props.actions.toggleCheckStatus(this.props.optionsMap, item.id)
                }}
            />
        }
        else if (this.props.currentElement.attributeTypeId == RADIOBUTTON || this.props.currentElement.attributeTypeId == OPTION_RADIO_FOR_MASTER || (this.props.currentElement.attributeTypeId == DROPDOWN)) {
            fieldAttributeView = item.selected ? <Icon name="md-checkmark-circle" style={[styles.fontXl, styles.fontSuccess]} /> : null
            checkForIcon = true
        }
        return (
            <ListItem
                button
                key={item.id}
                onPress={() => {
                    this.props.currentElement.attributeTypeId == CHECKBOX ? this.props.actions.toggleCheckStatus(this.props.optionsMap, item.id) :
                        (this.props.currentElement.attributeTypeId == ADVANCE_DROPDOWN ? this.props.actions.showAdvanceDropdownMessage(item) :
                            this.props.actions.saveOptionsFieldData(
                                this.props.optionsMap,
                                this.props.currentElement,
                                this.props.formLayoutState,
                                this.props.jobTransaction,
                                this.props.calledFromArray,
                                this.props.rowId,
                                item
                            ))

                }}>
                {fieldAttributeView}
                <Body>
                    <Text style={[styles.marginLeft10]}>{item.name}</Text>
                </Body>
                {checkForIcon ? <Right>
                    <Icon name="ios-arrow-forward" />
                </Right> : null}
            </ListItem>
        )
    }

    renderListViewData(optionsList) {
        if (optionsList.length == 0) {
            return (
                <Text style={[styles.fontCenter, styles.fontDarkGray]}>{NO_OPTIONS_PRESENT}</Text>
            )
        }
        let view = []
        for (let index in optionsList) {
            view.push(
                this.renderOptionView(optionsList[index])
            )
        }
        return view
    }

    sortOptionsMap() {
        let optionsList = _.sortBy(this.props.optionsMap, function (option) {
            return option.sequence
        })
        if (!this.props.searchInput || this.props.searchInput.trim() == '') {
            return optionsList
        }
        return (optionsList.filter(item => (item.name.toUpperCase()).startsWith(this.props.searchInput.toUpperCase())))
    }

    callToast() {
        Animated.timing(
            this.animatedValue,
            {
                toValue: 0,
            }).start()
    }

    closeToast() {
        Animated.timing(
            this.animatedValue,
            {
                toValue: 120,
            }).start()
        this.props.actions.setState(SET_OPTION_ATTRIBUTE_ERROR, { error: null })
    }

    getSearchBarView() {
        return (
            <View>
                <View searchBar style={[styles.padding5]}>
                    <Item rounded style={{ height: 30, backgroundColor: '#ffffff' }}>
                        <Input placeholder={SEARCH}
                            style={[styles.fontSm, styles.justifyCenter, { marginTop: 0, lineHeight: 10 }]}
                            value={this.props.searchInput}
                            keyboardType={(this.props.currentElement.attributeTypeId == ADVANCE_DROPDOWN) ? 'numeric' : 'default'}
                            returnKeyType='done'
                            onChangeText={(text) => {
                                this.props.actions.setState(SET_OPTION_SEARCH_INPUT, { searchInput: text })
                            }}
                        />
                        <Icon style={[styles.fontSm]} name="md-close"
                            onPress={() => {
                                this.props.actions.setState(SET_OPTION_SEARCH_INPUT, { searchInput: null })
                            }}
                        />
                    </Item>
                </View>
            </View>
        )
    }
    getAdvanceDropDownModal() {
        return (<View style={[styles.flex1, styles.column]}>
            <View style={{ flex: .4 }}>
                <TouchableHighlight
                    style={{ backgroundColor: 'rgba(0,0,0,.5)', flex: 1 }}
                    onPress={() => {
                        this.props.actions.setState(SET_ADV_DROPDOWN_MESSAGE_OBJECT, {})
                        if (!this.props.calledFromArray) {
                            this.props.actions.setState(SET_MODAL_FIELD_ATTRIBUTE, null)
                        } else {
                            this.props.onCloseModal()
                        }
                    }}
                >
                    {/* Added empty view because touchableheghlight must have a child */}
                    <View />
                </TouchableHighlight>
            </View>
            <View style={{ backgroundColor: '#ffffff', flex: .6 }}>
                <View style={{ height: '100%' }}>
                    <View style={[styles.bgLightGray]}>
                        <View style={[styles.row, styles.justifySpaceBetween, styles.bgLightGray]}>
                            <Text style={[styles.padding10]}>{MULTIPLE_SELECT_OPTIONS}</Text>
                            <TouchableHighlight
                                onPress={() => {
                                    this.props.actions.saveOptionsFieldData(
                                        this.props.optionsMap,
                                        this.props.currentElement,
                                        this.props.formLayoutState,
                                        this.props.jobTransaction,
                                        this.props.calledFromArray,
                                        this.props.rowId,
                                        this.props.advanceDropdownMessageObject
                                    )
                                }}>
                                <Text style={[styles.fontPrimary, styles.padding10]}> {DONE} </Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View searchBar style={[styles.padding5]}>
                        <Item rounded style={{ height: 30, backgroundColor: '#ffffff' }}>
                            <Input
                                style={[styles.fontSm, styles.fontDarkGray, styles.justifyCenter, { marginTop: 0, lineHeight: 10, marginBottom: 0 }]}
                                value={this.props.advanceDropdownMessageObject.code}
                                editable={false}
                            />
                            <Icon style={[styles.fontSm]} name="md-close"
                                onPress={() => {
                                    this.props.actions.setState(SET_ADV_DROPDOWN_MESSAGE_OBJECT, {})
                                }}
                            />
                        </Item>
                    </View>
                    <ScrollView style={[styles.paddingBottom10]}>
                        <View>
                            <Text style={[styles.padding10]}>
                                {this.props.advanceDropdownMessageObject.itemMessage}
                            </Text>
                        </View>
                        {/*This view is empty because bottom sheet margin from bottom  */}
                    </ScrollView>
                </View>
            </View>
        </View>)
    }
    getModalView() {
        let optionsList = this.sortOptionsMap()
        let listView = this.renderListViewData(optionsList)
        let searchBarView = null
        if (this.props.error) {
            this.callToast()
        }
        if ((this.props.currentElement.attributeTypeId == DROPDOWN && (optionsList.length > 29 || this.props.searchInput)) || this.props.currentElement.attributeTypeId == ADVANCE_DROPDOWN) {
            searchBarView = this.getSearchBarView()
        }
        let view
        if (!_.isEmpty(this.props.advanceDropdownMessageObject)) {
            view = this.getAdvanceDropDownModal()
        } else {
            view =
                <View style={[styles.flex1, styles.column]}>
                    <View style={{ flex: .4 }}>
                        <TouchableHighlight
                            style={{ backgroundColor: 'rgba(0,0,0,.5)', flex: 1 }}
                            onPress={() => {
                                if (!this.props.calledFromArray) {
                                    this.props.actions.setState(SET_MODAL_FIELD_ATTRIBUTE, null)
                                } else {
                                    this.props.onCloseModal()
                                }
                                this.props.actions.setState(SET_OPTION_ATTRIBUTE_ERROR, { error: null })
                            }}
                        >
                            {/* Added empty view because touchableheghlight must have a child */}
                            <View />
                        </TouchableHighlight>
                    </View>
                    <View style={{ backgroundColor: '#ffffff', flex: .6 }}>
                        <View style={{ height: '100%' }}>
                            <View style={[styles.bgLightGray]}>
                                <View style={[styles.row, styles.justifySpaceBetween, styles.bgLightGray]}>
                                    <Text style={[styles.padding10]}>{this.props.currentElement.label}</Text>
                                    {this.props.currentElement.attributeTypeId == CHECKBOX ?
                                        <TouchableHighlight
                                            onPress={() => {
                                                this.props.actions.saveOptionsFieldData(
                                                    this.props.optionsMap,
                                                    this.props.currentElement,
                                                    this.props.formLayoutState,
                                                    this.props.jobTransaction,
                                                    this.props.calledFromArray,
                                                    this.props.rowId,
                                                )
                                            }}>
                                            <Text style={[styles.fontPrimary, styles.padding10]}> {DONE} </Text>
                                        </TouchableHighlight> : null
                                    }
                                </View>
                                {searchBarView}
                            </View>
                            <ScrollView style={[styles.paddingBottom30]}>
                                {listView}
                                {/*This view is empty because bottom sheet margin from bottom  */}
                                <View style={{ height: 40 }} />
                            </ScrollView>
                            <Animated.View style={{ transform: [{ translateY: this.animatedValue }], flexDirection: 'row', height: 60, backgroundColor: '#000000', position: 'absolute', left: 0, bottom: 0, right: 0, justifyContent: 'space-between', alignItems: 'center', zIndex: 10, paddingHorizontal: 10 }}>
                                <Text style={[styles.fontLg, styles.fontWhite]}>
                                    {this.props.error}
                                </Text>
                                <Text onPress={() => this.closeToast()} style={[styles.fontLg, styles.padding10, { color: '#FFE200' }]}>{DISMISS}</Text>
                            </Animated.View>
                        </View>
                    </View>
                </View>
        }
        return view
    }
    render() {
        let modalView = this.getModalView()
        return (
            <Modal
                // animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    if (!this.props.calledFromArray) {
                        this.props.actions.setState(SET_MODAL_FIELD_ATTRIBUTE, null)
                    } else {
                        this.props.onCloseModal()
                    }
                    this.props.actions.setState(SET_ERROR_AND_ADV_DROPDOWN_MESSAGE_NULL)
                }}
            >
                {modalView}
            </Modal>

        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MultipleOptionsAttribute)
