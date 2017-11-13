import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    TextInput,
} from 'react-native'
import { Button, Input } from 'native-base';
import feStyle from '../themes/FeStyle'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    CHECK_CURRENT_PASSWORD,
    SET_NEW_PASSWORD,
    SET_CONFIRM_NEW_PASSWORD,
    TOGGLE_SAVE_RESET_BUTTON,
} from '../lib/constants'
import {
    CONFIRM_CURRENT_PASSWORD,
    NEW_PASSWORD,
    CONFIRM_NEW_PASSWORD,
} from '../lib/AttributeConstants'
import * as profileActions from '../modules/profile/profileActions'
import * as globalActions from '../modules/global/globalActions'


function mapStateToProps(state) {
    return {
        currentPassword: state.profileReducer.currentPassword,
        newPassword: state.profileReducer.newPassword,
        confirmNewPassword: state.profileReducer.confirmNewPassword,
        isSaveResetButtonDisabled: state.profileReducer.isSaveResetButtonDisabled
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...profileActions }, dispatch)
    }
}

class ProfileReset extends Component {

    _setCurrentPassword = (text) => {
        this.props.actions.setState(CHECK_CURRENT_PASSWORD, text)
        if (this.props.currentPassword && this.props.newPassword && this.props.confirmNewPassword) {
            this.props.actions.setState(TOGGLE_SAVE_RESET_BUTTON, false)
        } else {
            this.props.actions.setState(TOGGLE_SAVE_RESET_BUTTON, true)
        }
    }
    _setNewPassword = (text) => {
        this.props.actions.setState(SET_NEW_PASSWORD, text)
        if (this.props.currentPassword && this.props.newPassword && this.props.confirmNewPassword) {
            this.props.actions.setState(TOGGLE_SAVE_RESET_BUTTON, false)
        } else {
            this.props.actions.setState(TOGGLE_SAVE_RESET_BUTTON, true)
        }
    }
    _setConfirmNewPassword = (text) => {
        this.props.actions.setState(SET_CONFIRM_NEW_PASSWORD, text)
        if (this.props.currentPassword && this.props.newPassword && this.props.confirmNewPassword) {
            this.props.actions.setState(TOGGLE_SAVE_RESET_BUTTON, false)
        } else {
            this.props.actions.setState(TOGGLE_SAVE_RESET_BUTTON, true)
        }
    }
    _onResetPress = () => {
        this.props.actions.checkAndResetPassword(this.props.currentPassword, this.props.newPassword, this.props.confirmNewPassword)
    }
    render() {
        return (
            <View style={[feStyle.bgWhite, feStyle.flex1, feStyle.column, { paddingTop: 70 }]}>

                <TextInput
                    editable={true}
                    secureTextEntry={true}
                    placeholder={CONFIRM_CURRENT_PASSWORD}
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={this._setCurrentPassword}
                    value={this.props.currentPassword}
                />
                <TextInput
                    editable={true}
                    secureTextEntry={true}
                    placeholder={NEW_PASSWORD}
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={this._setNewPassword}
                    value={this.props.newPassword}
                />
                <TextInput
                    editable={true}
                    secureTextEntry={true}
                    placeholder={CONFIRM_NEW_PASSWORD}
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={this._setConfirmNewPassword}
                    value={this.props.confirmNewPassword}
                />
                <Button onPress={this._onResetPress} disabled={this.props.isSaveResetButtonDisabled}>
                    <Text style={{ textAlign: 'center', width: '100%', color: 'white' }}>
                        SAVE
                        </Text>
                </Button>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#f7f7f7'
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(ProfileReset)