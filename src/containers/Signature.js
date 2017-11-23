import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity
}
    from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SignatureView from '../components/SignatureView'
import SignatureRemarks from '../components/SignatureRemarks'
import * as signatureActions from '../modules/signature/signatureActions'
import SignatureCapture from 'react-native-signature-capture';
import renderIf from '../lib/renderIf'

function mapStateToProps(state) {
    return {
        isRemarksValidation: state.signature.isRemarksValidation,
        fieldDataList: state.signature.fieldDataList,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...signatureActions }, dispatch)
    }
}

class Signature extends Component {

    componentWillMount() {
        this.props.actions.getRemarksList(this.props.navigation.state.params.formElements)
        this.props.actions.setIsRemarksValidation(this.props.navigation.state.params.currentElement.validation)
    }

    onSaveEvent = async (result) => {
        if (result != null) {
            await this.props.actions.saveSignature(result,
                this.props.navigation.state.params.currentElement.fieldAttributeMasterId,
                this.props.navigation.state.params.formElements,
                this.props.navigation.state.params.nextEditable,
                this.props.navigation.state.params.isSaveDisabled)
        }
        if (this.props.onRatingSaveEvent) {
            this.props.onRatingSaveEvent(result)
        }
        this.props.navigation.goBack()
    }

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }


    render() {
        if (this.props.isRemarksValidation && this.props.fieldDataList.length > 0) {
            return (
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <SignatureRemarks fieldDataList={this.props.fieldDataList} />
                    </View>
                    <View
                        style={{
                            width: 1,
                            height: 1000,
                            backgroundColor: 'black',
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                        }}
                    />
                    <View style={{ flex: 2 }}>
                        <SignatureView onSaveEvent={this.onSaveEvent} />
                    </View>
                </View>
            );
        } else {
            return (
                <SignatureView onSaveEvent={this.onSaveEvent} />
            );
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Signature)
