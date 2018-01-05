import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux'
import * as formLayoutActions from '../modules/form-layout/formLayoutActions.js'
import * as globalActions from '../modules/global/globalActions'
import { connect } from 'react-redux'
import DateTimePicker from 'react-native-modal-datetime-picker'
import moment from 'moment'

class TimePicker extends PureComponent {

    constructor(props) {
        super(props)
        this.state = { 'isVisible': false }
    }
    componentDidMount() {
        this.setState({ 'isVisible': true })
    }

    _onCancel = () => {
        this.setState({ 'isVisible': false })
        if (this.props.onCancel)
            this.props.onCancel()
    }

    _onConfirm = (date) => {
        this.setState({ 'isVisible': false })
        const newDateTime = (this.props.item.attributeTypeId == 5) ? moment(date).format('HH:mm') : moment(date).format('YYYY-MM-DD')
        this.props.onSave(newDateTime.toString(), this.props.item)
    }

    _minimumDate = () => {
        const leftValidation = (!this.props.item.validation) ? null : this.props.item.validation[0].leftKey
        let date = (leftValidation) ? new Date() : undefined;
        if (leftValidation && date && !(this.props.item.attributeTypeId == 5)) {
            let leftKey = leftValidation.split(',')
            if (leftKey[1] == "+") {
                date.setDate(date.getDate() + parseInt(leftKey[2]));
            } else {
                date.setDate(date.getDate() - parseInt(leftKey[2]));
            }
        } else if (leftValidation && date) {
            let leftKey = leftValidation.split(',')
            date.setTime(date.getTime() + (parseInt(leftKey[2]) * 1000));
        }
        return date;
    }

    _maximumDate = () => {
        const leftValidation = (!this.props.item.validation) ? null : this.props.item.validation[0].rightKey
        let date = (leftValidation) ? new Date() : undefined;
        if (leftValidation && date && !(this.props.item.attributeTypeId == 5)) {
            let leftKey = leftValidation.split(',')
            if (leftKey[1] == "+") {
                date.setDate(date.getDate() + parseInt(leftKey[2]));
            } else {
                date.setDate(date.getDate() - parseInt(leftKey[2]));
            }
        } else if (leftValidation && date) {
            let leftKey = leftValidation.split(',')
            date.setTime(date.getTime() + (parseInt(leftKey[2]) * 1000));
        }
        return date;
    }


    render() {
        const mode = (this.props.item.attributeTypeId == 5) ? 'time' : 'date';
        const minimum = (this.state.isVisible) ? this._minimumDate() : undefined;
        let maximum = (this.state.isVisible) ? this._maximumDate() : undefined;
        return (
            <DateTimePicker
                isVisible={this.state.isVisible}
                onConfirm={this._onConfirm}
                onCancel={this._onCancel}
                mode={mode}
                minimumDate={minimum}
                maximumDate={maximum}
            />
        )
    }
}

export default TimePicker