'use strict';
import React, { PureComponent } from 'react'
import {  StyleSheet, View, TouchableOpacity, Image, Platform,TouchableHighlight, ImageStore } from 'react-native'
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
            imageData: null,
            reduxData: null,
        }
    }

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    static getDerivedStateFromProps(props, state){
        const imageData = props.imageData;
        let newstate = null;
        //console.logs({imageData},{state})
        if(_.isEmpty(imageData)) {
            //console.logs("mypenz")
            newstate = {...state, reduxData: imageData};
        } else {
            //console.logs("pingy")
            newstate = {...state, reduxData: {...imageData}};
        }
        
        if(_.isEmpty(imageData) ){
            if(!_.isEmpty(state.reduxData)){
                return {...newstate, imageData: null};
            }
            else{
                return null;
            }
        }
        else if(_.isEmpty(state.reduxData)){//Optional chaining is not available
            //console.logs('him and i')

            return {...newstate, imageData: {...imageData}}
        }
        
        if(imageData.data === state.reduxData.data) { //Assuming base64 string changes on  change in image
            //console.logs('him and i')
            return {...newstate};
        }
        // //console.logs(props)
        // //console.logs(state)
        // //console.logs('changed value of imageData and reducer')
        return {...newstate, imageData:{... imageData}};
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
            storageOptions: {
                skipBackup: true,
            }
        }
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.error) {
                this._setToastForError(response.error)
            }
            else if (response.data) {
                this.setImage(response.uri)
                //this.props.actions.setState(SET_SHOW_IMAGE_AND_DATA, { data : response.data, uri: response.uri}) 
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

    setImage = (uri) => {
        if(uri == null) {
            ImageStore.removeImageForTag(this.state.imageData.uri);
            this.setState({imageData: null});
        }
        else {
            this.setState({imageData: { uri }})
        }
    }

    submitImage = () => {
        if (this.props.navigation.state.params.currentElement.attributeTypeId == SKU_PHOTO) {
            this.props.navigation.state.params.changeSkuActualQuantity(this.props.imageData.data, this.props.navigation.state.params.currentElement)
        } else {
            this.props.actions.saveImage(this.state.imageData, this.props.navigation.state.params.currentElement.fieldAttributeMasterId, this.props.navigation.state.params.formLayoutState, this.props.navigation.state.params.calledFromArray, this.props.navigation.state.params.rowId, this.props.navigation.state.params.jobTransaction)
        }
    }

    // imageCaptureView(getValidationObject, quality) {
    //     let torchView = this.renderTorch()
    //     return <StyleProvider style={getTheme(platform)}>
    //         <Container>
    //             <View style={{ flex: 1 }}>
    //                 <RNCamera
    //                     ref={(cam) => {
    //                         this.camera = cam;
    //                     }}
    //                     captureQuality={quality}
    //                     style={style.preview}
    //                     flashMode={this.state.torchOff}
    //                     type={this.state.cameraType}>
    //                     <SafeAreaView style={[styles.absolute, styles.paddingTop10, { top: 0, left: 0, height: 60, backgroundColor: 'rgba(0,0,0,.4)', width: '100%' }]}>
    //                         <View style={[styles.paddingVertical10, styles.paddingHorizontal15]}>
    //                             <View style={[styles.row, styles.justifySpaceBetween, styles.alignCenter]}>
    //                             <TouchableHighlight onPress = {() => {
    //                                         this.props.navigation.goBack()
    //                                     }}>
    //                                 <Icon
    //                                     name="md-close"
    //                                     style={[styles.fontXxxl, styles.fontWhite]}
    //                                    />
    //                                     </TouchableHighlight>
    //                                 <Right>
    //                                     {torchView}
    //                                 </Right>
    //                             </View>
    //                         </View>
    //                     </SafeAreaView>
    //                 </RNCamera>
    //             </View>
    //             <SafeAreaView style={[style.footer]}>
    //                 <View style={{ height: 100, flexDirection: 'row', alignItems: 'center' }}>
    //                     <View style={[styles.flexBasis33_3, styles.alignCenter, styles.justifyCenter]}>
    //                         {(getValidationObject && getValidationObject.imageUploadFromDevice) ? <MaterialIcons name={'photo'} style={[styles.fontXxxl, styles.fontWeight500, { color: '#ffffff' }]} onPress={() => this.getImageGallery()} /> : null}
    //                     </View>
    //                     <View style={[styles.flexBasis33_3, styles.alignCenter, styles.marginTop10]}>
    //                         <View style={[styles.justifyCenter, styles.alignCenter, { width: 68, height: 68, borderRadius: 34, borderColor: '#ffffff', borderWidth: 1 }]}>
    //                             <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#ffffff' }}>
    //                                 <TouchableOpacity style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#ffffff' }} onPress={() => this.takePicture()} />
    //                             </View>
    //                         </View>
    //                     </View>
    //                     <View style={[styles.flexBasis33_3, styles.alignCenter, styles.justifyCenter]}>
    //                         {(getValidationObject && getValidationObject.isFrontCameraEnabled) ? <MaterialIcons name={'switch-camera'} style={[styles.fontXxxl, styles.fontWeight500, { color: '#ffffff' }]} onPress={() => this.toggleCameraType()} /> : null}
    //                     </View>
    //                 </View>
    //             </SafeAreaView>
    //         </Container>
    //     </StyleProvider>
    // }

    // showImageView(getValidationObject) {
    //     return (
    //         <StyleProvider style={getTheme(platform)}>
    //             <Container>
    //                 <View style={{ flex: 1 }}>
    //                     <Image
    //                         resizeMethod={'resize'}
    //                         source={{
    //                             isStatic: true,
    //                             uri: this.state.imageData.uri,
    //                         }}
    //                         style={[styles.flex1]}
    //                     />
    //                     <SafeAreaView style={[styles.absolute, styles.padding10, { top: 0, left: 0, height: 50, backgroundColor: 'rgba(0,0,0,.4)', width: '100%' }]}>
    //                         <View style={[styles.paddingLeft15, styles.paddingRight15]}>
    //                         <TouchableHighlight onPress = {() => {
    //                                     this.props.actions.setState(SET_SHOW_IMAGE_AND_DATA,'')
    //                                 }}>
    //                             <Icon
    //                                 name="md-close"
    //                                 style={[styles.fontXxxl, styles.fontWhite]}
    //                                 />
    //                                 </TouchableHighlight>
    //                         </View>
    //                     </SafeAreaView>
    //                 </View>
    //                 <SafeAreaView style={[styles.width100, styles.absolute, styles.row, styles.heightAuto, styles.justifyCenter, styles.alignCenter, styles.padding10, { bottom: 0 }]}>
    //                     {(getValidationObject && getValidationObject.cropImageValidation && Platform.OS==='android') ?
    //                         <View style={[styles.justifyCenter, styles.alignCenter, { marginRight: 46 }]}>
    //                             <TouchableOpacity style={[styles.justifyCenter, styles.alignCenter, { backgroundColor: 'rgba(0,0,0,0.3)' }, { width: 70, height: 70, borderRadius: 35 }]} onPress={() => this.props.actions.cropImage(this.state.imageData.uri)}>
    //                                 <MaterialIcons name={"crop"} style={[styles.fontWhite, styles.fontXxxl]} />
    //                             </TouchableOpacity>
    //                         </View>
    //                         : null}
    //                     <View>
    //                         <View style={[styles.justifyCenter, styles.alignCenter]}>
    //                             <TouchableOpacity style={[styles.justifyCenter, styles.alignCenter, styles.bgSuccess, { width: 70, height: 70, borderRadius: 35 }]} onPress={() => {
    //                                 if (this.props.navigation.state.params.currentElement.attributeTypeId == SKU_PHOTO) {
    //                                     this.props.navigation.state.params.changeSkuActualQuantity(this.props.imageData.data, this.props.navigation.state.params.currentElement)
    //                                 } else {
    //                                     this.props.actions.saveImage(this.props.imageData, this.props.navigation.state.params.currentElement.fieldAttributeMasterId, this.props.navigation.state.params.formLayoutState, this.props.navigation.state.params.calledFromArray, this.props.navigation.state.params.rowId, this.props.navigation.state.params.jobTransaction)
    //                                 }
    //                             }}>
    //                                 <Icon name="md-checkmark" style={[styles.fontWhite, styles.fontXxxl]} />
    //                             </TouchableOpacity>
    //                         </View>
    //                     </View>
    //                 </SafeAreaView>
    //             </Container>
    //         </StyleProvider>
    //     )
    // }

    showCameraOrImage() {
        if( this.state.imageData == null){
            return (
                <RNCamera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    style={style.preview}
                    flashMode={this.state.torchOff}
                    type={this.state.cameraType}
                />
            );
        } else {
            return (
                <Image
                    resizeMethod={'resize'}
                    source={{
                        uri: this.state.imageData != null && this.state.imageData.uri != null ? this.state.imageData.uri : 'data:image/jpeg;base64,' + this.state.imageData.data,
                    }}
                    style={[styles.flex1]}
                />
            );
        }                
    }
    showSwitchCamera(getValidationObject) {
        console.logs('coming herer',getValidationObject)
        if(this.state.imageData == null){
            return (
                <View style={[ styles.alignCenter, styles.justifyCenter]}>
                    {
                            (getValidationObject && getValidationObject.isFrontCameraEnabled) 
                        ? 
                            <MaterialIcons 
                                name={'switch-camera'} 
                                style={[styles.fontXxxl, styles.fontWeight500, { color: '#ffffff' }]} 
                                onPress={() => this.toggleCameraType()} 
                            /> 
                        : 
                            null
                    }
                </View>
            );
        }
        else {
            return null;
        }
    }
    showGalleryPicker(getValidationObject) {
        if(this.state.imageData == null){
            return(
                <View style={[ styles.alignCenter, styles.justifyCenter]}>
                    {
                            (getValidationObject && getValidationObject.imageUploadFromDevice && this.state.imageData == null) 
                        ? 
                            <MaterialIcons 
                                name={'photo'} 
                                style={[styles.fontXxxl, styles.fontWeight500, { color: '#ffffff' }]} 
                                onPress={() => this.getImageGallery()} 
                            />
                        : 
                            null
                    }
                </View>
            );
        } else {
            return null;
        }
    }
    showCenterButton() {
        if (this.state.imageData == null) {
            return(
                <View style={[styles.justifyCenter, styles.alignCenter, { width: 68, height: 68, borderRadius: 34, borderColor: '#ffffff', borderWidth: 1 }]}>
                    <TouchableOpacity 
                        style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#ffffff' }} 
                        onPress={this.takePicture} 
                    />
                </View>
            );
        } else {
            return(
                <TouchableOpacity 
                    style={[styles.justifyCenter, styles.alignCenter, styles.bgSuccess, { width: 70, height: 70, borderRadius: 35 }]} 
                    onPress={this.submitImage}
                >
                    <Icon 
                        name="md-checkmark"  
                        style={[styles.fontWhite, styles.fontXxxl]} 
                    /> 
                </TouchableOpacity>
            );
        }
    }
    render() {
        let item = this.props.navigation.state.params.currentElement
        const getValidationObject = this.props.validation
        
        if (this.props.cameraLoader)
            return <Loader />

        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <View style={{ flex: 1 }}>
                        {this.showCameraOrImage()}
                        <SafeAreaView style={[styles.absolute, styles.padding10, { top: 0, left: 0, height: 50, backgroundColor: 'rgba(0,0,0,.4)', width: '100%'},styles.paddingLeft15, styles.paddingRight15, styles.row, styles.justifySpaceBetween, styles.alignCenter ]}>
                            <TouchableHighlight 
                                onPress = {() => {
                                    if(this.state.imageData == null){
                                        this.props.navigation.goBack()
                                    }
                                    else {
                                        this.setImage(null);
                                    }
                                }}
                            >
                                <Icon
                                    name="md-close"
                                    style={[styles.fontXxxl, styles.fontWhite]}
                                />
                            </TouchableHighlight>
                            {
                                this.state.imageData == null 
                                && 
                                <Right>
                                    {this.renderTorch()}
                                </Right>
                            }
                        </SafeAreaView>
                    </View>
                    <SafeAreaView style={[style.footer]} >
                        {
                                (getValidationObject && getValidationObject.cropImageValidation && Platform.OS==='android' && this.state.imageData != null) 
                            ?
                                <View style={[styles.justifyCenter, styles.alignCenter]}>
                                    <TouchableOpacity style={[styles.justifyCenter, styles.alignCenter, { backgroundColor: 'rgba(0,0,0,0.3)' }, { width: 70, height: 70, borderRadius: 35 }]} onPress={() => this.props.actions.cropImage(this.state.imageData.uri, this.setImage)}>
                                        <MaterialIcons name={"crop"} style={[styles.fontWhite, styles.fontXxxl]} />
                                    </TouchableOpacity>
                                </View>
                            : 
                                null
                        }
                        {this.showGalleryPicker(getValidationObject)}
                        <View style={[ styles.alignCenter, styles.justifyCenter]}>
                        { this.showCenterButton()}
                        </View>
                        {this.showSwitchCamera(getValidationObject)}
                    </SafeAreaView>
                </Container>
            </StyleProvider>
        )
    }

    takePicture = async () => {
        if (this.camera) {
            try {
                let options = { quality: 0.2, base64: true, fixOrientation: true, skipProcessing: true };
                if (Platform.OS === "ios") {
                    options.orientation = 'portrait'
                }
                const { uri } = await this.camera.takePictureAsync(options);
                    this.setImage(uri)
                
            } catch (error) {
                this.props.actions.setState(SET_CAMERA_LOADER, false)
                this.props.actions.showToastAndAddUserExceptionLog(316, error.message, 'danger', 1)
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
    footer: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        height: 100,
        backgroundColor: 'rgba(0,0,0,.4)',
        borderLeftWidth: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 1
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CameraFieldAttribute)