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
import StarRating from 'react-native-star-rating';
import Signature from '../containers/Signature'
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
        console.log('==rating', this.state.starCount)
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
                <StarRating
                    maxStars={5}
                    rating={this.state.starCount}
                    selectedStar={rating => this.onStarRatingPress(rating)}
                />
            </View>
        );
    }
}

export default connect(null, mapDispatchToProps)(SignatureAndNps)
