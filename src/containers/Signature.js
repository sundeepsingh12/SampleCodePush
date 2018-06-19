import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SignatureRemarks from '../components/SignatureRemarks'
import * as signatureActions from '../modules/signature/signatureActions'
import SignatureCapture from 'react-native-signature-capture'
import renderIf from '../lib/renderIf'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import { Container, Content, Header, Left, Body, Icon, StyleProvider, Toast, Footer, FooterTab } from 'native-base'
import { SIGNATURE } from '../lib/AttributeConstants'
import { OK, IMPROPER_SIGNATURE } from '../lib/ContainerConstants'

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

class Signature extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            isLandscape: 'landscape',
            isSaveDisabled: true
        };
    }

    componentDidMount() {
        this.props.actions.getRemarksList(this.props.navigation.state.params.currentElement, this.props.navigation.state.params.formLayoutState.formElement)
    }

    onSaveSign = async (result) => {
        if (result != null) {
            await this.props.actions.saveSignature(result,
                this.props.navigation.state.params.currentElement.fieldAttributeMasterId,
                this.props.navigation.state.params.formLayoutState,
                this.props.navigation.state.params.jobTransaction,
                this.props.navigation.goBack

            )
        }
        this.setState({ isLandscape: 'portrait' })
    }

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    saveSign = () => {
        if (this.state.isSaveDisabled) {
            Toast.show({
                text: IMPROPER_SIGNATURE,
                position: "bottom" | "center",
                buttonText: OK,
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
        this.onSaveSign(result)
    }
    onDragEvent = () => {
        this.setState({ isSaveDisabled: false })
    }

    headerView() {
        return (
            <SafeAreaView style={[styles.bgWhite]}>
                <Header searchBar style={[styles.bgWhite, style.header]}>
                    <Body>
                        <View
                            style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                            <TouchableOpacity style={[style.headerLeft]} onPress={() => {
                                this.setState({ isLandscape: 'portrait' })
                                this.props.navigation.goBack(null)
                            }}>
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
            </SafeAreaView>
        )
    }
    saveSignButton() {
        return (
            <TouchableOpacity style={[style.fabButton, { backgroundColor: styles.bgPrimaryColor }]}
                onPress={this.saveSign} >
                <Icon name="md-checkmark" style={[styles.fontWhite, styles.fontXl]} />
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    {this.headerView()}
                    <View style={[styles.flex1, styles.row, styles.bgWhite]}>
                        <View style={{ borderWidth: 1 }}>
                            {renderIf(this.props.fieldDataList.length > 0,
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
                                {this.saveSignButton()}
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
