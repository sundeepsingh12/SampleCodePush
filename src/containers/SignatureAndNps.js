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
//import * as signatureAndNpsActions from '../modules/signature-and-nps/signatureAndNpsActions'
import SignatureCapture from 'react-native-signature-capture';
import renderIf from '../lib/renderIf'
import StarRating from 'react-native-star-rating';

function mapStateToProps(state) {
    return {
        // isRemarksValidation : state.signature.isRemarksValidation,
        // fieldDataList: state.signature.fieldDataList,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //  actions: bindActionCreators({ ...signatureActions }, dispatch)
    }
}

class SignatureAndNps extends Component {

    constructor(props) {
        super(props)
        // this.params = this.props.navigation.state.params.currentElement;
        // this.formElement = this.props.navigation.state.params.formElements;
        // this.nextEditable = this.props.navigation.state.params.nextEditable;
        // this.isSaveDisabled = this.props.navigation.state.params.isSaveDisabled;
        this.state = {
            starCount: 0
        };
    }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }
    componentWillMount() {
        // this.props.actions.getRemarksList(this.formElement)
        // this.props.actions.setIsRemarksValidation(this.params.validation)
    }

    onSaveEvent = async (result) => {
        // if (result != null) {
        //     await this.props.actions.saveSignature(result, this.params.fieldAttributeMasterId, this.formElement, this.nextEditable, this.isSaveDisabled)
        // }
        // this.props.navigation.goBack()
    }

    render() {
        // if (this.props.isRemarksValidation && this.props.fieldDataList.length > 0) { 
        //     return (
        //         <View style={{ flex: 1, flexDirection: 'row' }}>
        //             <View style={{ flex: 1 }}>
        //                 <SignatureRemarks fieldDataList={this.props.fieldDataList} />
        //             </View>
        //             <View
        //                 style={{
        //                     width: 1,
        //                     height: 1000,
        //                     backgroundColor: 'black',
        //                     borderBottomColor: 'black',
        //                     borderBottomWidth: 1,
        //                 }}
        //             />
        //             <View style={{ flex: 2 }}>
        //                 <SignatureView onSaveEvent={this.onSaveEvent} />
        //             </View>
        //         </View>
        //     );
        // } else {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <SignatureView onSaveEvent={this.onSaveEvent} />
                <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={this.state.starCount}
                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                />
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignatureAndNps)
