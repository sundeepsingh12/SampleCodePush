'use strict'
import isEmpty from 'lodash/isEmpty';
import styles from '../themes/FeStyle';
import { SafeAreaView } from 'react-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Icon, Textarea, Button, Content, Footer, FooterTab, Toast } from 'native-base';
import * as globalActions from '../modules/global/globalActions';
import * as qcActions from '../modules/qc/qcActions';
import { CameraAttribute, SET_QC_REMARKS } from '../lib/constants';
import { FAIL, PASS, CLOSE, PROCEED, TAKE_A_PICTURE, REMARKS, TAP_TO_SHOW, TYPE_HERE, OK } from '../lib/ContainerConstants';
import TitleHeader from '../components/TitleHeader';
import Loader from '../components/Loader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { navigate } from '../modules/navigators/NavigationService';

function mapStateToProps(state) {
    return {
        qcPassFailResult: state.qc.qcPassFailResult,
        qcImageAndRemarksLoading: state.qc.qcImageAndRemarksLoading,
        qcImageData: state.qc.qcImageData,
        qcRemarksData: state.qc.qcRemarksData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...qcActions }, dispatch)
    }
}

class QCImageAndRemarks extends PureComponent {

    componentDidMount() {
        this.props.actions.getQCImageAndRemarksData(this.props.navigation.state.params.qcAttributeMaster, this.props.navigation.state.params.formLayoutState, this.props.navigation.state.params.jobTransaction, { isQCImage: this.checkForQCImageView(), isQCRemarks: this.checkForQCRemarksView() })
    }

    static navigationOptions = ({ navigation }) => {
        return { header: <TitleHeader pageName={navigation.state.params.qcAttributeMaster.label} goBack={navigation.goBack} /> }
    }

    renderQCReasonView(item) {
        if (!item.qcResult) {
            return null;
        }
        return (
            <View style={[styles.row, styles.padding10]}>
                <MaterialIcons name='fiber-manual-record' />
                <Text style={[styles.paddingLeft10]}>{item.optionLabel}</Text>
            </View>
        )
    }

    getQCReasonDataView() {
        if (isEmpty(this.props.navigation.state.params.qcReasonData)) {
            return null;
        }
        let reasonDataView = <View>
            <Text style={[styles.padding10, styles.fontDefault]}>{this.props.navigation.state.params.qcAttributeMaster.childList.optionCheckboxArray.label}</Text>
            <FlatList
                data={Object.values(this.props.navigation.state.params.qcReasonData)}
                renderItem={({ item }) => this.renderQCReasonView(item)}
                keyExtractor={item => '' + item.objectId}
            />
        </View>
        return reasonDataView;
    }

    cameraNavigation() {
        navigate(CameraAttribute, { currentElement: this.props.qcImageData ? this.props.qcImageData : this.props.navigation.state.params.qcAttributeMaster.childList.qcImage });
    }

    getQCImageView() {
        if (!this.checkForQCImageView()) {
            return null
        }

        return (
            <TouchableOpacity style={[styles.row, styles.padding10, styles.alignCenter, { borderTopColor: '#d3d3d3', borderTopWidth: 1 }]} onPress={() => { this.cameraNavigation() }}>
                <Icon name="ios-camera" />
                <Text style={[{ color: styles.fontPrimaryColor }, styles.fontDefault, styles.paddingLeft10, styles.paddingRight10]}>{this.props.qcImageData && this.props.qcImageData.value ? TAP_TO_SHOW : TAKE_A_PICTURE}</Text>
                {this.props.qcImageData && this.props.qcImageData.value ? <Icon name="ios-checkmark-circle" style={[styles.fontXl, styles.fontSuccess, styles.fontXxl]} /> : null}
            </TouchableOpacity>
        )
    }

    checkForQCImageView() {
        if (!this.props.navigation.state.params.qcAttributeMaster.childList.qcImage || !this.props.navigation.state.params.qcAttributeMaster.qcValidationMap.qcImageValidation) {
            return false
        }
        return true
    }

    getQCRemarksView() {
        if (!this.checkForQCRemarksView()) {
            return null;
        }
        return (
            <View style={[styles.paddingVertical15, styles.paddingHorizontal10, { borderTopColor: '#d3d3d3', borderTopWidth: 1 }]}>
                <Text style={[styles.paddingVertical5, styles.fontDefault]}>{this.props.navigation.state.params.qcAttributeMaster.childList.qcRemark.label}</Text>
                <Textarea rowSpan={5} bordered placeholder={TYPE_HERE}
                    value={this.props.qcRemarksData}
                    onChangeText={text => this.props.actions.setState(SET_QC_REMARKS, { qcRemarksData: text })}
                />
            </View>
        )
    }

    checkForQCRemarksView() {
        if (!this.props.navigation.state.params.qcAttributeMaster.childList.qcRemark) {
            return false;
        }
        if (this.props.qcPassFailResult) {
            if (this.props.navigation.state.params.qcAttributeMaster.qcValidationMap.qcPassRemarksValidation) {
                let failList = this.props.navigation.state.params.qcDataArray.filter(qcObject => !qcObject.qcResult)
                if (failList.length > 0) {
                    return true;
                }
            }
        } else if (this.props.navigation.state.params.qcAttributeMaster.qcValidationMap.qcFailReasonsValidation && this.props.navigation.state.params.qcAttributeMaster.qcValidationMap.qcFailRemarksValidation) {
            return true;
        }
        return false
    }

    validateAndSave() {
        if (this.checkForQCRemarksView() && this.props.navigation.state.params.qcAttributeMaster.childList.qcRemark.required && (!this.props.qcRemarksData || !this.props.qcRemarksData.trim())) {
            Toast.show({ text: 'Remarks is required.Please fill it', buttonText: OK, duration: 10000 })
        } else if (this.checkForQCImageView() && this.props.navigation.state.params.qcAttributeMaster.childList.qcImage.required && (!this.props.qcImageData || !this.props.qcImageData.value)) {
            Toast.show({ text: 'Image is required.Please take it', buttonText: OK, duration: 10000 })
        } else {
            let qcImageRemarksObject = { isQCImage: this.checkForQCImageView(), isQCRemarks: this.checkForQCRemarksView(), qcImageData: this.props.qcImageData, qcRemarksData: this.props.qcRemarksData }
            this.props.actions.saveImageRemarksAndNavigate(qcImageRemarksObject, this.props.navigation.state.params.qcAttributeMaster, this.props.navigation.state.params.formLayoutState, this.props.navigation.state.params.jobTransaction)
        }
    }

    getQCResultText() {
        if (this.props.qcPassFailResult) {
            return this.props.navigation.state.params.qcAttributeMaster.qcValidationMap && this.props.navigation.state.params.qcAttributeMaster.qcValidationMap.qcPassButtonTextValidation ? this.props.navigation.state.params.qcAttributeMaster.qcValidationMap.qcPassButtonTextValidation : PASS;
        } else {
            return this.props.navigation.state.params.qcAttributeMaster.qcValidationMap && this.props.navigation.state.params.qcAttributeMaster.qcValidationMap.qcFailButtonTextValidation ? this.props.navigation.state.params.qcAttributeMaster.qcValidationMap.qcFailButtonTextValidation : FAIL;
        }
    }

    render() {
        if (this.props.qcImageAndRemarksLoading) {
            return <Loader />
        }
        return (
            <View style={[styles.flex1, styles.column]}>
                <View style={{ backgroundColor: '#ffffff' }}>
                    <View style={{ height: '100%' }}>
                        <View style={[styles.bgLightGray]}>
                            <View style={[styles.row, styles.padding10, styles.justifySpaceBetween, styles.bgLightGray]}>
                                <Text style={[styles.paddingVertical5, styles.fontWeight500]}>
                                    {this.getQCResultText()}
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.relative, styles.flex1]}>
                            <Content style={[styles.flex1]}>
                                {this.getQCReasonDataView()}
                                {this.getQCRemarksView()}
                                {this.getQCImageView()}
                            </Content>
                            <SafeAreaView style={[styles.bgWhite]}>
                                <Footer style={[styles.footer]}>
                                    <FooterTab style={[styles.padding10]}>
                                        <Button style={{ backgroundColor: styles.bgPrimaryColor }} full onPress={() => this.validateAndSave()}>
                                            <Text style={[styles.fontLg, styles.fontWhite]}>{PROCEED}</Text>
                                        </Button>
                                    </FooterTab>
                                </Footer>
                            </SafeAreaView>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(QCImageAndRemarks)
