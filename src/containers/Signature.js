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
import SignatureRemarks from '../components/SignatureRemarks'
import * as signatureActions from '../modules/signature/signatureActions'
import SignatureCapture from 'react-native-signature-capture';
import renderIf from '../lib/renderIf'
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
    StyleProvider
} from 'native-base';
import {
    SIGNATURE,
} from '../lib/AttributeConstants'
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

    constructor(props) {
        super(props)
        this.state = {
            isLandscape: 'landscape'
        };
    }

    componentWillMount() {
        this.props.actions.getRemarksList(this.props.navigation.state.params.formElements)
        this.props.actions.setIsRemarksValidation(this.props.navigation.state.params.currentElement.validation)
    }

    onSaveSign = async (result) => {
        if (result != null) {
            await this.props.actions.saveSignature(result,
                this.props.navigation.state.params.currentElement.fieldAttributeMasterId,
                this.props.navigation.state.params.formElements,
                this.props.navigation.state.params.nextEditable,
                this.props.navigation.state.params.isSaveDisabled)
        }
        this.props.navigation.goBack()
    }

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    saveSign = () => {
        this.refs["sign"].saveImage();
        this.refs["sign"].resetImage();
    }

    resetSign = () => {
        this.refs["sign"].resetImage();
    }

    onSaveEvent = (result) => {
        this.onSaveSign(result)
        this.setState({ isLandscape: 'portrait' })
    }
    onDragEvent() {
        console.log("dragged");
    }
    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    {renderIf(this.props.navigation.state.params.currentElement.attributeTypeId == SIGNATURE,
                        <Header searchBar style={[styles.bgWhite, style.header]}>
                            <Body>
                                <View
                                    style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                                    <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                                        <Icon name="md-arrow-back" style={[styles.fontBlack, styles.fontXl, styles.fontLeft]} />
                                    </TouchableOpacity>
                                    <View style={[style.headerBody]}>
                                        <Text style={[styles.fontCenter, styles.fontBlack, styles.fontLg, styles.alignCenter]}>Signature</Text>
                                    </View>
                                    <TouchableOpacity style={[style.headerRight]}
                                        onPress={this.resetSign} >
                                        <Text style={[styles.fontBlack, styles.fontLg, styles.fontRight]}>Clear</Text>
                                    </TouchableOpacity>
                                    <View />
                                </View>
                            </Body>
                        </Header>
                    )}
                    <View style={[styles.flex1, styles.row]}>
                        <View style={{ borderWidth: 1 }}>
                            {renderIf(this.props.isRemarksValidation && this.props.fieldDataList.length > 0,
                                <SignatureRemarks fieldDataList={this.props.fieldDataList} />
                            )}
                        </View>
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
                        {renderIf(this.props.navigation.state.params.currentElement.attributeTypeId == SIGNATURE,
                            <TouchableOpacity style={[style.fabButton, styles.bgPrimary]}
                                onPress={this.saveSign} >
                                <Icon name="md-checkmark" style={[styles.fontWhite, styles.fontXl]} />
                            </TouchableOpacity>
                        )}
                    </View>
                </Container>
            </StyleProvider >
        )
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
});
export default connect(mapStateToProps, mapDispatchToProps)(Signature)
