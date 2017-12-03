import React, { Component } from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native'
import {
    NPS_FEEDBACK,
    TIME,
    DATE,
    RE_ATTEMPT_DATE
} from '../lib/AttributeConstants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TimePicker from '../components/TimePicker'
import NPSFeedback from '../components/NPSFeedback'
import { getNextFocusableAndEditableElements, updateFieldData } from '../modules/form-layout/formLayoutActions'
import {
    ON_BLUR
} from '../lib/constants'

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ getNextFocusableAndEditableElements }, dispatch)
    }
}
class OverlayAttributes extends Component {

    onSave = (value) => {
        this.props.actions.getNextFocusableAndEditableElements(this.props.navigation.state.params.currentElement.fieldAttributeMasterId,
            this.props.navigation.state.params.formElements,
            this.props.navigation.state.params.isSaveDisabled,
            value + '', ON_BLUR)
        this.props.navigation.goBack()
    }

    onCancel = () => {
        this.props.navigation.goBack()
    }

    render() {
        switch (this.props.navigation.state.params.currentElement.attributeTypeId) {
            case NPS_FEEDBACK:
                return (
                    <NPSFeedback
                        onSave={this.onSave} onCancel={this.onCancel}
                    />
                )
            case DATE:
            case RE_ATTEMPT_DATE:
            case TIME:
                return (
                    <TimePicker onSave={this.onSave} onCancel={this.onCancel} item={this.props.navigation.state.params.currentElement} />
                )
            default:
                return (
                    <Text>
                        Under construction
                    </Text>
                )
        }
    }
}
export default connect(null, mapDispatchToProps)(OverlayAttributes)

