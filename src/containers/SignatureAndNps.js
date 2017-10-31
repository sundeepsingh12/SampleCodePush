import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
}
    from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SignatureView from '../components/SignatureView'
import Signature from '../containers/Signature'
import NPSFeedback from '../components/NPSFeedback'
import * as signatureActions from '../modules/signature/signatureActions'

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...signatureActions }, dispatch)
    }
}

class SignatureAndNps extends Component {

    constructor(props) {
        super(props)
        this.state = {
            starCount: 0
        };
    }

    onStarRatingPress(starCount) {
        this.setState({
            starCount
        });
    }

    onRatingSaveEvent = (result) => {
        this.props.actions.saveSignatureAndRating(result,
            this.state.starCount,
            this.props.navigation.state.params.currentElement,
            this.props.navigation.state.params.formElements,
            this.props.navigation.state.params.nextEditable,
            this.props.navigation.state.params.isSaveDisabled,
            this.props.navigation.state.params.jobTransaction,
            this.props.navigation.state.params.latestPositionId)
        this.props.navigation.goBack()

    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Signature navigation={this.props.navigation} onRatingSaveEvent={this.onRatingSaveEvent} />
                <NPSFeedback onStarPress={this.onStarRatingPress} showSave={true} />
            </View>
        );
    }
}

export default connect(null, mapDispatchToProps)(SignatureAndNps)
