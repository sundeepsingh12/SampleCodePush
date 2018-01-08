import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
}
    from 'react-native'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import {
    Container,
    Content,
    Header,
    Left,
    Body,
    Icon,
    StyleProvider,
    Toast
} from 'native-base';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SignatureRemarks from '../components/SignatureRemarks'
import Signature from '../containers/Signature'
import NPSFeedback from '../components/NPSFeedback'
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

class SignatureAndNps extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            starCount: 0,
            isLandscape: 'landscape',
            isSaveDisabled: true
        };
    }
    componentDidMount() {
        this.props.actions.getRemarksList(this.props.navigation.state.params.formElements)
        this.props.actions.setIsRemarksValidation(this.props.navigation.state.params.currentElement.validation)
    }

    onStarRatingPress = (starCount) => {
        this.setState({
            starCount
        });
    }

    onRatingSaveEvent = (result) => {
        this.props.actions.saveSignatureAndRating(result,
            this.state.starCount,
            this.props.navigation.state.params.currentElement,
            this.props.navigation.state.params.formElements,
            this.props.navigation.state.params.isSaveDisabled,
            this.props.navigation.state.params.jobTransaction,
            this.props.navigation.state.params.latestPositionId)
        this.props.navigation.goBack()
    }

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }
    saveSign = () => {
        if (this.state.isSaveDisabled) {
            Toast.show({
                text: 'Improper signature. Please make your full signature.',
                position: "bottom" | "center",
                buttonText: 'Okay',
                duration: 5000
            })
        } else {
            this.refs["sign"].saveImage();
            this.refs["sign"].resetImage();
        }
    }

    resetSign = () => {
        this.refs["sign"].resetImage();
        this.setState({ isSaveDisabled: true })
    }

    onSaveEvent = (result) => {
        this.onRatingSaveEvent(result)
        this.setState({ isLandscape: 'portrait' })
    }
    onDragEvent = () => {
        this.setState({ isSaveDisabled: false })
    }
    goBack = () => {
        this.setState({ isLandscape: 'portrait' })
        this.props.navigation.goBack()
    }
    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Header searchBar style={[styles.bgWhite, style.header]}>
                        <Body>
                            <View
                                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                                <TouchableOpacity style={[style.headerLeft]} onPress={() => this.goBack}>
                                    <Icon name="md-arrow-back" style={[styles.fontBlack, styles.fontXl, styles.fontLeft]} />
                                </TouchableOpacity>
                                <View style={[style.headerBody]}>
                                    <Text style={[styles.fontCenter, styles.fontBlack, styles.fontLg, styles.alignCenter]}>Signature</Text>
                                </View>
                                <TouchableOpacity style={[style.headerRight]}
                                    onPress={this.resetSign} >
                                    <Text style={[styles.fontBlack, styles.fontLg, styles.fontRight]}>Clear</Text>
                                </TouchableOpacity>
                            </View>
                        </Body>
                    </Header>
                    <View style={[styles.flex1, styles.row]}>
                        {renderIf(this.props.isRemarksValidation && this.props.fieldDataList.length > 0,
                            <View style={{ borderWidth: 1 }}>
                                <SignatureRemarks fieldDataList={this.props.fieldDataList} />
                            </View>
                        )}
                        <View style={{ flex: 2 }}>
                            <SignatureCapture
                                style={[{ flex: 1 }, styles.signature]}
                                ref="sign"
                                onSaveEvent={this.onSaveEvent}
                                onDragEvent={this.onDragEvent}
                                saveImageFileInExtStorage={false}
                                showNativeButtons={false}
                                showTitleLabel={false}
                                viewMode={this.state.isLandscape} />
                        </View>
                        <View style={[style.feedback]}>
                            <View style={[{ paddingLeft: 150, paddingRight: 150 }]}>
                                <NPSFeedback onStarPress={this.onStarRatingPress} showSave={true} />
                            </View>
                        </View>
                        <TouchableOpacity style={[style.fabButton, styles.bgPrimary]}
                            onPress={this.saveSign} >
                            <Icon name="md-checkmark" style={[styles.fontWhite, styles.fontXl]} />
                        </TouchableOpacity>
                    </View>
                </Container>
            </StyleProvider >

        );
    }

}

const style = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        height: 'auto',
        padding: 0,
        paddingRight: 0,
        paddingLeft: 0
    },
    headerLeft: {
        width: '15%',
        padding: 15
    },
    headerBody: {
        width: '70%',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10
    },
    headerRight: {
        width: '15%',
        padding: 15
    },
    fabButton: {
        position: 'absolute',
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 10,
        right: 10
    },

    feedback: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(SignatureAndNps)
