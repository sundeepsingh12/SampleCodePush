'use strict';
import React, { PureComponent } from 'react';
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

import Camera from 'react-native-camera';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as globalActions from '../modules/global/globalActions'
import * as cameraActions from '../modules/camera/cameraActions'
import {
    SET_IMAGE_DATA,
    SET_SHOW_IMAGE
} from '../lib/constants'
import styles from '../themes/FeStyle'
import platform from '../../native-base-theme/variables/platform'
import getTheme from '../../native-base-theme/components';
import CameraIcon from '../svg_components/icons/CameraIcon'
import TorchOffIcon from '../svg_components/icons/TorchOffIcon'
import TorchOnIcon from '../svg_components/icons/TorchOnIcon'

import {
    CAMERA,
    CAMERA_HIGH,
    CAMERA_MEDIUM
} from '../lib/AttributeConstants'

function mapStateToProps(state) {
    return {
        imageData: state.cameraReducer.imageData,
        showImage: state.cameraReducer.showImage
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...cameraActions }, dispatch)
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
        this.props.actions.setState(SET_SHOW_IMAGE, false)
        this.props.actions.setState(SET_IMAGE_DATA, '')
    }
    componentDidMount() {
        switch (this.props.navigation.state.params.currentElement.attributeTypeId) {
            case CAMERA: this.setState({ quality: 'low' })
                break
            case CAMERA_MEDIUM: this.setState({ quality: 'medium' })
                break
            case CAMERA_HIGH: this.setState({ quality: 'high' })
                break
            default: {

            }
        }
        this.setState({ torchOff: Camera.constants.FlashMode.off })
        this.props.actions.setExistingImage(this.props.navigation.state.params.currentElement)
    }
    _setTorchOn = () => {
        this.setState({ torchOff: Camera.constants.FlashMode.on })
    }
    _setTorchOff = () => {
        this.setState({ torchOff: Camera.constants.FlashMode.off })
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
    renderTorch() {
        let view
        if (this.state.torchOff == Camera.constants.FlashMode.off) {
            view =
                <TouchableOpacity style={[styles.flexBasis33_3, styles.alignCenter]}>
                    <Icon name="ios-flash-outline" style={[styles.fontWhite, styles.fontXxxl]} onPress={() => this._setTorchOn()} />
                </TouchableOpacity>

        } else {
            view =
                <TouchableOpacity style={[styles.flexBasis33_3, styles.alignCenter]}>
                    <Icon name="ios-flash" style={[styles.fontWhite, styles.fontXxxl]} onPress={() => this._setTorchOff()} />
                </TouchableOpacity>
        }
        return view
    }
    render() {
        let torchView = this.renderTorch()
        if (!this.props.showImage) {
            return (
                <StyleProvider style={getTheme(platform)}>
                    <Container>
                        <View style={{ flex: 1 }}>
                            <Camera
                                ref={(cam) => {
                                    this.camera = cam;
                                }}
                                captureQuality={this.state.quality}
                                style={style.preview}
                                aspect={Camera.constants.Aspect.fill}
                                captureTarget={Camera.constants.CaptureTarget.memory}
                                flashMode={this.state.torchOff}
                                type={this.state.cameraType}
                                orientation={Camera.constants.Orientation.portrait}>

                            </Camera>
                        </View>
                        <View style={[style.cameraFooter]}>
                            {/* <View style={[styles.row, styles.justifySpaceBetween, styles.paddingTop10, styles.paddingBottom10, { borderBottomColor: 'rgba(0,0,0,.1)', borderBottomWidth: 1 }]}> */}

                            {/* <View style={[styles.flexBasis33_3, styles.alignCenter]}>
                                <Icon name="md-image" style={[styles.fontWhite, styles.fontXxxl]} />
                            </View> */}
                            {/* <View style={[styles.flexBasis50, styles.alignCenter]}>
                                    
                                </View>
                            </View> */}
                            <View style={[styles.row, styles.justifySpaceBetween, styles.alignCenter, styles.flex1]}>
                                <View style={[styles.flexBasis33_3, styles.alignCenter, styles.justifyCenter]}>
                                    {torchView}
                                </View>

                                <View style={[styles.flexBasis33_3, styles.alignCenter]}>
                                    <View style={[styles.justifyCenter, styles.alignCenter, { width: 68, height: 68, borderRadius: 34, borderColor: '#ffffff', borderWidth: 1 }]}>
                                        <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#ffffff' }}>
                                            <TouchableOpacity style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#ffffff' }} onPress={this.takePicture.bind(this)} />
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.flexBasis33_3, styles.alignCenter, styles.justifyCenter]}>
                                    <Icon name="ios-reverse-camera" style={[styles.fontWhite, styles.fontXxxl]} onPress={() => this.toggleCameraType()} />
                                </View>
                            </View>
                        </View>
                    </Container>
                </StyleProvider>
            );
        } else {
            return (
                <StyleProvider style={getTheme(platform)}>
                    <Container>
                        <View style={{ flex: 1 }}>
                            <Image
                                source={{
                                    isStatic: true,
                                    uri: 'data:image/jpeg;base64,' + this.props.imageData,
                                }}
                                style={[styles.flex1]}
                            />
                            <View style={[styles.absolute, styles.padding10, { top: 0, left: 0 }]}>
                                <Icon
                                    name="md-close"
                                    style={[styles.fontXxxl, styles.fontWhite]}
                                    onPress={() => {
                                        this.props.actions.setState(SET_SHOW_IMAGE, false)
                                        this.props.actions.setState(SET_IMAGE_DATA, '')
                                    }} />
                            </View>
                        </View>
                        <View style={[styles.width100, styles.absolute, styles.heightAuto, styles.padding10, { bottom: 0 }]}>
                            <View style={[styles.justifyCenter, styles.alignCenter, styles.flex1]}>
                                <TouchableOpacity style={[styles.justifyCenter, styles.alignCenter, styles.bgSuccess, { width: 70, height: 70, borderRadius: 35 }]} onPress={() => {
                                    this.props.actions.saveImage(this.props.imageData, this.props.navigation.state.params.currentElement.fieldAttributeMasterId, this.props.navigation.state.params.formElements, this.props.navigation.state.params.isSaveDisabled, this.props.navigation.state.params.calledFromArray, this.props.navigation.state.params.rowId, this.props.navigation.state.params.latestPositionId, this.props.navigation.state.params.jobTransaction)
                                    this.props.navigation.goBack()
                                }}>
                                    <Icon name="md-checkmark" style={[styles.fontWhite, styles.fontXxxl]} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Container>
                </StyleProvider>)
        }
    }

    onBarCodeRead(e) {
        console.log(
            "Barcode Found!",
            "Type: " + e.type + "\nData: " + e.data
        );
    }

    takePicture() {
        console.log('takePicture')
        const options = {};
        this.camera.capture()
            .then((data) => {
                //this.camera.stopCapture()
                console.log('image data', data)
                this.props.actions.setState(SET_SHOW_IMAGE, true)
                this.props.actions.setState(SET_IMAGE_DATA, data.data)
            })
            .catch(err => console.error(err));
    }
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