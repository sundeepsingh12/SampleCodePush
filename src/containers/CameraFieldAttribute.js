'use strict';
import React, { PureComponent } from 'react'
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';

import {
    Container,
    Content,
    Header,
    Left,
    Body,
    Right,
    Icon,
    Footer,
    StyleProvider,
    Button,

} from 'native-base';
import * as skuListingActions from '../modules/skulisting/skuListingActions'

import { RNCamera } from 'react-native-camera'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as globalActions from '../modules/global/globalActions'
import * as cameraActions from '../modules/camera/cameraActions'
import {
    SET_IMAGE_DATA,
    SET_SHOW_IMAGE,
    SET_SHOW_IMAGE_AND_DATA
} from '../lib/constants'
import styles from '../themes/FeStyle'
import platform from '../../native-base-theme/variables/platform'
import getTheme from '../../native-base-theme/components'
import CameraIcon from '../svg_components/icons/CameraIcon'
import TorchOffIcon from '../svg_components/icons/TorchOffIcon'
import TorchOnIcon from '../svg_components/icons/TorchOnIcon'
import ImagePicker from 'react-native-image-picker'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {
    CAMERA,
    CAMERA_HIGH,
    CAMERA_MEDIUM,
    SKU_PHOTO
} from '../lib/AttributeConstants'

function mapStateToProps(state) {
    return {
        imageData: state.cameraReducer.imageData,
        showImage: state.cameraReducer.showImage
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
            quality: '',
            torchOff: '',
            cameraType: 'back',
        }
    }
    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }
    componentWillUnmount() {
        this.props.actions.setState(SET_SHOW_IMAGE_AND_DATA, {
            data: '',
            showImage: true
        })
    }
    componentDidMount() {
        let item = this.props.navigation.state.params.currentElement
        switch (item.attributeTypeId) {
            case CAMERA: this.setState({ quality: 'low' })
                break
            case CAMERA_MEDIUM: this.setState({ quality: 'medium' })
                break
            case CAMERA_HIGH: this.setState({ quality: 'high' })
                break
            case SKU_PHOTO: this.setState({ quality: 'high' })
                break
            default: {

            }
        }
        this.setState({ torchOff: RNCamera.Constants.FlashMode.off })
        if (item.value && item.value != '') {
            this.props.actions.setExistingImage(item)
        }
    }
    _setTorchOn = () => {
        this.setState({ torchOff: RNCamera.Constants.FlashMode.on })
    }
    _setTorchOff = () => {
        this.setState({ torchOff: RNCamera.Constants.FlashMode.off })
    }
    toggleCameraType = () => {
        this.setState(previousState => {
            if (previousState.cameraType == 'back') {
                return {
                    cameraType: 'front'
                }
            }
            else {
                return { cameraType: 'back' }
            }
        })
    }
    getImageGallery = () => {
            const options = {
              title: 'Photo Picker',
              takePhotoButtonTitle: 'Take Photo...',
              chooseFromLibraryButtonTitle: 'Choose from Library...',
              quality: 0.8,
              maxWidth: 300,
              maxHeight: 300,
              allowsEditing: true,
              storageOptions: {
                skipBackup: true,
                waitUntilSaved : true
              }
            }
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.data) {
                this.props.actions.setState(SET_SHOW_IMAGE_AND_DATA, {
                    data: response.data,
                    showImage: true
                })
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
    imageCaptureView() {
        let torchView = this.renderTorch()
        return <StyleProvider style={getTheme(platform)}>
            <Container>
                <View style={{ flex: 1 }}>
                    <RNCamera
                        ref={(cam) => {
                            this.camera = cam;
                        }}
                        captureQuality={this.state.quality}
                        style={style.preview}
                        flashMode={this.state.torchOff}
                        type={this.state.cameraType}>
                        <View style={[styles.absolute, styles.padding15, { top: 0, left: 0, height: 50, backgroundColor: 'rgba(0,0,0,.4)', width: '100%' }]}>
                            <View style={[styles.row, styles.justifySpaceBetween, styles.alignCenter, styles.flex1]}>
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
                    </RNCamera>
                </View>
                <View style={[style.cameraFooter]}>
                    <View style={[styles.row, styles.justifySpaceBetween, styles.alignCenter, styles.flex1]}>
                        <View style={[styles.flexBasis33_3, styles.alignCenter, styles.justifyCenter]}>
                            <MaterialIcons name={'photo'} style={[styles.fontXxxl, styles.fontWeight500, { color: '#ffffff' }]} onPress={() => this.getImageGallery()} />
                        </View>
                        <View style={[styles.flexBasis33_3, styles.alignCenter]}>
                            <View style={[styles.justifyCenter, styles.alignCenter, { width: 68, height: 68, borderRadius: 34, borderColor: '#ffffff', borderWidth: 1 }]}>
                                <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#ffffff' }}>
                                    <TouchableOpacity style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#ffffff' }} onPress={this.takePicture.bind(this)} />
                                </View>
                            </View>
                        </View>
                        <View style={[styles.flexBasis33_3, styles.alignCenter, styles.justifyCenter]}>
                            <MaterialIcons name={'switch-camera'} style={[styles.fontXxxl, styles.fontWeight500, { color: '#ffffff' }]} onPress={() => this.toggleCameraType()} />
                        </View>
                    </View>
                </View>
            </Container>
        </StyleProvider>
    }

    showImageView() {
        return(
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <View style={{ flex: 1 }}>
                        <Image
                            resizeMethod = {'resize'}
                            source={{
                                isStatic: true,
                                uri: 'data:image/jpeg;base64,' + this.props.imageData,
                            }}
                            style={[styles.flex1]}
                        />
                        <View style={[styles.absolute, styles.padding10, { top: 0, left: 0, height: 50, backgroundColor: 'rgba(0,0,0,.4)', width: '100%' }]}>
                            <Icon
                                name="md-close"
                                style={[styles.fontXxxl, styles.fontWhite]}
                                onPress={() => {
                                    this.props.actions.setState(SET_SHOW_IMAGE_AND_DATA, {
                                        data: '',
                                        showImage: false
                                    })
                                }} />
                        </View>
                    </View>
                    <View style={[styles.width100, styles.absolute, styles.heightAuto, styles.padding10, { bottom: 0 }]}>
                        <View style={[styles.justifyCenter, styles.alignCenter, styles.flex1]}>
                            <TouchableOpacity style={[styles.justifyCenter, styles.alignCenter, styles.bgSuccess, { width: 70, height: 70, borderRadius: 35 }]} onPress={() => {
                                if (this.props.navigation.state.params.currentElement.attributeTypeId == SKU_PHOTO) {
                                    this.props.navigation.state.params.changeSkuActualQuantity(this.props.imageData, this.props.navigation.state.params.currentElement)
                                } else {
                                    this.props.actions.saveImage(this.props.imageData, this.props.navigation.state.params.currentElement.fieldAttributeMasterId, this.props.navigation.state.params.formElements, this.props.navigation.state.params.isSaveDisabled, this.props.navigation.state.params.calledFromArray, this.props.navigation.state.params.rowId, this.props.navigation.state.params.latestPositionId, this.props.navigation.state.params.jobTransaction)
                                }
                            }}>
                                <Icon name="md-checkmark" style={[styles.fontWhite, styles.fontXxxl]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Container>
            </StyleProvider>
        )
    }
    render() {
        let item = this.props.navigation.state.params.currentElement
        if (((item.value && item.value != '') || this.props.imageData ) && this.props.showImage) {
            return this.showImageView()
        } else {
            return this.imageCaptureView()
        }
    }

    takePicture = async function () {
        if (this.camera) {
            const options = { quality: 0.5, base64: true };
         try{
            const data = await this.camera.takePictureAsync(options)
            this.props.actions.setState(SET_SHOW_IMAGE_AND_DATA, {
                data: data.base64,
                showImage: true
            })
            }catch(error){
             console.log(error.message)
            }
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
        borderLeftWidth: 0
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CameraFieldAttribute)