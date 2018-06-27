'use strict';
import React, { PureComponent } from 'react'
import {  StyleSheet, View, TouchableOpacity, Image, Platform } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { Container, Right, Icon, Footer, StyleProvider, Toast } from 'native-base'
import Loader from '../components/Loader'
import * as skuListingActions from '../modules/skulisting/skuListingActions'
import { RNCamera } from 'react-native-camera'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as globalActions from '../modules/global/globalActions'
import * as cameraActions from '../modules/camera/cameraActions'
import { SET_SHOW_IMAGE_AND_DATA } from '../lib/constants'
import styles from '../themes/FeStyle'
import getTheme from '../../native-base-theme/components'
import ImagePicker from 'react-native-image-picker'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import platform from '../../native-base-theme/variables/platform'
import {  SKU_PHOTO } from '../lib/AttributeConstants'

function mapStateToProps(state) {
    return {
        imageData: state.cameraReducer.imageData,
        validation: state.cameraReducer.validation,
        cameraLoader: state.cameraReducer.cameraLoader
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...cameraActions, ...skuListingActions }, dispatch)
    }
}

class CameraFieldAttribute extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            torchOff: '',
            cameraType: 'back',
        }
    }

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    componentDidMount() {
        this.props.actions.setCameraInitialView(this.props.navigation.state.params.currentElement)
    }

    _setTorchOn = () => {
        this.setState({ torchOff: RNCamera.Constants.FlashMode.on })
    }

    _setTorchOff = () => {
        this.setState({ torchOff: RNCamera.Constants.FlashMode.off })
    }

    _setToastForError(message) {
        Toast.show({
            text: message,
            position: 'bottom',
            buttonText: 'Ok',
            type: 'danger',
            duration: 5000
        })
    }
    toggleCameraType = () => {
        this.setState(previousState => {
            if (previousState.cameraType == 'back') {
                return {
                    cameraType: 'front'
                }
            }else {
                return { cameraType: 'back' }
            }
        })
    }

    getImageGallery = () => {
        const options = {
            title: 'Photo Picker',
            takePhotoButtonTitle: 'Take Photo...',
            chooseFromLibraryButtonTitle: 'Choose from Library...',
            quality: 0.5,
            allowsEditing: true,
            storageOptions: {
                skipBackup: true,
                waitUntilSaved: true
            }
        }
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.error) {
                this._setToastForError(response.error)
            }
            else if (response.data) {
                this.props.actions.setState(SET_SHOW_IMAGE_AND_DATA, { data : response.data, uri: response.uri}) 
            }
        })
    }

    renderTorch() {
        let view
        if (this.state.torchOff == RNCamera.Constants.FlashMode.off) {
            view =
                <Icon name="ios-flash-outline" style={[styles.fontWhite, styles.fontXxxl]} onPress={() => this._setTorchOn()} />
        } else {
            view =
                <Icon name="ios-flash" style={[styles.fontWhite, styles.fontXxxl]} onPress={() => this._setTorchOff()} />
        }
        return view
    }

    imageCaptureView(getValidationObject, quality) {
        let torchView = this.renderTorch()
        return <StyleProvider style={getTheme(platform)}>
            <Container>
                <View style={{ flex: 1 }}>
                    <RNCamera
                        ref={(cam) => {
                            this.camera = cam;
                        }}
                        captureQuality={quality}
                        style={style.preview}
                        flashMode={this.state.torchOff}
                        type={this.state.cameraType}>
                        <SafeAreaView style={[styles.absolute, styles.paddingTop10, { top: 0, left: 0, height: 60, backgroundColor: 'rgba(0,0,0,.4)', width: '100%' }]}>
                            <View style={[styles.paddingVertical10, styles.paddingHorizontal15]}>
                                <View style={[styles.row, styles.justifySpaceBetween, styles.alignCenter]}>
                                    <Icon
                                        name="md-close"
                                        style={[styles.fontXxxl, styles.fontWhite]}
                                        onPress={() => {
                                            this.props.navigation.goBack()
                                        }} />
                                    <Right>
                                        {torchView}
                                    </Right>
                                </View>
                            </View>
                        </SafeAreaView>
                    </RNCamera>
                </View>
                <SafeAreaView style={[style.cameraFooter]}>
                    <View style={{ height: 100, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.flexBasis33_3, styles.alignCenter, styles.justifyCenter]}>
                            {(getValidationObject && getValidationObject.imageUploadFromDevice) ? <MaterialIcons name={'photo'} style={[styles.fontXxxl, styles.fontWeight500, { color: '#ffffff' }]} onPress={() => this.getImageGallery()} /> : null}
                        </View>
                        <View style={[styles.flexBasis33_3, styles.alignCenter, styles.marginTop10]}>
                            <View style={[styles.justifyCenter, styles.alignCenter, { width: 68, height: 68, borderRadius: 34, borderColor: '#ffffff', borderWidth: 1 }]}>
                                <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#ffffff' }}>
                                    <TouchableOpacity style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#ffffff' }} onPress={() => this.takePicture()} />
                                </View>
                            </View>
                        </View>
                        <View style={[styles.flexBasis33_3, styles.alignCenter, styles.justifyCenter]}>
                            {(getValidationObject && getValidationObject.isFrontCameraEnabled) ? <MaterialIcons name={'switch-camera'} style={[styles.fontXxxl, styles.fontWeight500, { color: '#ffffff' }]} onPress={() => this.toggleCameraType()} /> : null}
                        </View>
                    </View>
                </SafeAreaView>
            </Container>
        </StyleProvider>
    }

    showImageView(getValidationObject) {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <View style={{ flex: 1 }}>
                        <Image
                            resizeMethod={'resize'}
                            source={{
                                isStatic: true,
                                uri: 'data:image/jpeg;base64,' + this.props.imageData.data,
                            }}
                            style={[styles.flex1]}
                        />
                        <SafeAreaView style={[styles.absolute, styles.padding10, { top: 0, left: 0, height: 50, backgroundColor: 'rgba(0,0,0,.4)', width: '100%' }]}>
                            <View style={[styles.paddingLeft15, styles.paddingRight15]}>
                                <Icon
                                    name="md-close"
                                    style={[styles.fontXxxl, styles.fontWhite]}
                                    onPress={() => {
                                        this.props.actions.setState(SET_SHOW_IMAGE_AND_DATA,'')
                                    }} />
                            </View>
                        </SafeAreaView>
                    </View>
                    <SafeAreaView style={[styles.width100, styles.absolute, styles.row, styles.heightAuto, styles.justifyCenter, styles.alignCenter, styles.padding10, { bottom: 0 }]}>
                        {(getValidationObject && getValidationObject.cropImageValidation && Platform.OS==='android') ?
                            <View style={[styles.justifyCenter, styles.alignCenter, { marginRight: 46 }]}>
                                <TouchableOpacity style={[styles.justifyCenter, styles.alignCenter, { backgroundColor: 'rgba(0,0,0,0.3)' }, { width: 70, height: 70, borderRadius: 35 }]} onPress={() => this.props.actions.cropImage(this.props.imageData.uri)}>
                                    <MaterialIcons name={"crop"} style={[styles.fontWhite, styles.fontXxxl]} />
                                </TouchableOpacity>
                            </View>
                            : null}
                        <View>
                            <View style={[styles.justifyCenter, styles.alignCenter]}>
                                <TouchableOpacity style={[styles.justifyCenter, styles.alignCenter, styles.bgSuccess, { width: 70, height: 70, borderRadius: 35 }]} onPress={() => {
                                    if (this.props.navigation.state.params.currentElement.attributeTypeId == SKU_PHOTO) {
                                        this.props.navigation.state.params.changeSkuActualQuantity(this.props.imageData.data, this.props.navigation.state.params.currentElement)
                                    } else {
                                        this.props.actions.saveImage(this.props.imageData, this.props.navigation.state.params.currentElement.fieldAttributeMasterId, this.props.navigation.state.params.formLayoutState, this.props.navigation.state.params.calledFromArray, this.props.navigation.state.params.rowId, this.props.navigation.state.params.jobTransaction)
                                    }
                                }}>
                                    <Icon name="md-checkmark" style={[styles.fontWhite, styles.fontXxxl]} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </Container>
            </StyleProvider>
        )
    }

    render() {
        let item = this.props.navigation.state.params.currentElement
        const quality = { 20 : 'low', 42: 'high', 43: 'medium', 55: 'high' }
        if (this.props.cameraLoader)
            return <Loader />
        if ((!_.isEmpty(this.props.imageData))) {
            return this.showImageView(this.props.validation)
        } else {
            return this.imageCaptureView(this.props.validation, quality[item.attributeTypeId])
        }
    }

    takePicture =  () => {
        if (this.camera) {
            this.props.actions.takePicture(this.camera)
        }
    };
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        color: '#000',
        padding: 10,
    },
    cameraFooter: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        height: 100,
        backgroundColor: 'rgba(0,0,0,.4)',
        borderLeftWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CameraFieldAttribute)