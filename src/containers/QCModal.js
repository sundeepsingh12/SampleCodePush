//This class works for checkBox, RadioButton, DropDown.
'use strict'
import _ from 'lodash'
import styles from '../themes/FeStyle'
import { SafeAreaView } from 'react-navigation';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { View, Text, TouchableHighlight, Modal, FlatList, TouchableOpacity } from 'react-native'
import { CheckBox, Icon, Textarea, Button, Content } from 'native-base';
import * as globalActions from '../modules/global/globalActions'
import * as qcActions from '../modules/qc/qcActions'
import { SET_QC_MODAL_VIEW, CameraAttribute } from '../lib/constants'
import { SELECT_REASON, FAIL, PASS, CLOSE, PROCEED, TAKE_A_PICTURE, REMARKS } from '../lib/ContainerConstants'
import { navigate } from '../modules/navigators/NavigationService';

function mapStateToProps(state) {
    return {
        qcModalLoading: state.qc.qcModalLoading,
        qcReasonData: state.qc.qcReasonData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...qcActions }, dispatch)
    }
}

class QCModal extends PureComponent {

    componentDidMount() {
        console.log('componentDidMount qcmodal', this.props)
        this.props.actions.getQCPassFailParamaters(this.props.qcDataArray, this.props.qcAttributeMaster, this.props.qcPassFail, this.props.jobTransaction);
    }

    renderQCReasonView(item) {
        return (
            <View style={[styles.row, styles.padding10]}>
                <CheckBox
                    checked={item.qcResult}
                    color={styles.primaryColor}
                    onPress={() => { this.props.actions.changeQCReasonResult(item.objectId, this.props.qcReasonData) }} />
                <Text style={[styles.marginLeft10]}>{item.optionLabel}</Text>
            </View>
        )
    }

    getQCReasonDataView() {
        if (_.isEmpty(this.props.qcReasonData)) {
            return null;
        }
        let reasonDataView = <View>
            <Text style={[styles.padding10, styles.fontDefault]}>{SELECT_REASON}</Text>
            <FlatList
                data={Object.values(this.props.qcReasonData)}
                renderItem={({ item }) => this.renderQCReasonView(item)}
                keyExtractor={item => '' + item.objectId}
            />
        </View>

        // <Text style={[styles.padding10, styles.fontDefault]}>Select Reason</Text>
        // <View>
        //     <View style={[styles.row, styles.padding10]}>
        //         <CheckBox checked={true} />
        //         <Text style={[styles.marginLeft10]}>Damage Pidasfuo</Text>
        //     </View>
        // </View>
        // <View style={[styles.row, styles.padding10, styles.alignCenter, { borderTopColor: '#d3d3d3', borderTopWidth: 1, borderBottomColor: '#d3d3d3', borderBottomWidth: 1 }]}>
        //     <Icon name="ios-camera" />
        //     <Text style={[styles.fontPrimaryColor, styles.fontDefault, styles.paddingLeft10]}>Damage Pidasfuo</Text>
        // </View>
        // <View style={[styles.paddingVertical15, styles.paddingHorizontal10]}>
        //     <Text style={[styles.paddingVertical5, styles.fontDefault]}>Select Reason</Text>
        //     <Textarea rowSpan={5} bordered placeholder="Textarea" />
        // </View>
        return reasonDataView;
    }

    cameraNavigation() {
        this.props.actions.setState(SET_QC_MODAL_VIEW, { qcModal: false });
        navigate(CameraAttribute, { currentElement: this.props.qcAttributeMaster.childList.qcImage });
    }

    getQCImageView() {
        if (!this.props.qcAttributeMaster || !this.props.qcAttributeMaster.qcImage) {
            return null
        }

        return (
            <TouchableOpacity style={[styles.row, styles.padding10, styles.alignCenter, { borderTopColor: '#d3d3d3', borderTopWidth: 1, borderBottomColor: '#d3d3d3', borderBottomWidth: 1 }]} onPress={() => { this.cameraNavigation() }}>
                <Icon name="ios-camera" />
                <Text style={[{ color: styles.fontPrimaryColor }, styles.fontDefault, styles.paddingLeft10]}>{TAKE_A_PICTURE}</Text>
            </TouchableOpacity>
        )
    }

    getQCRemarksView() {
        if (this.props.qcPassFail == PASS) {
            if (this.props.qcAttributeMaster.qcPassRemarks) {
                let failList = this.props.qcDataArray.filter(qcObject => !qcObject.qcResult)
                if (failList.length > 0) {
                    return (
                        <View style={[styles.paddingVertical15, styles.paddingHorizontal10]}>
                            <Text style={[styles.paddingVertical5, styles.fontDefault]}>{REMARKS}</Text>
                            <Textarea rowSpan={5} bordered placeholder="Textarea" />
                        </View>
                    )
                }
            }
        } else if (this.props.qcAttributeMaster && this.props.qcAttributeMaster.qcFailReasons && this.props.qcAttributeMaster.qcFailRemarks) {
            return (
                <View style={[styles.paddingVertical15, styles.paddingHorizontal10]}>
                    <Text style={[styles.paddingVertical5, styles.fontDefault]}>{REMARKS}</Text>
                    <Textarea rowSpan={5} bordered placeholder="Textarea" />
                </View>
            )
        }

        return null
    }

    getModalView() {
        return (
            <View style={[styles.flex1, styles.column]}>
                <View style={{ flex: .4 }}>
                    <TouchableHighlight
                        style={{ backgroundColor: 'rgba(0,0,0,.5)', flex: 1 }}
                        onPress={() => { this.props.actions.setState(SET_QC_MODAL_VIEW, { qcModal: false }) }}
                    >
                        {/* Added empty view because touchableheghlight must have a child */}
                        <View />
                    </TouchableHighlight>
                </View>
                <View style={{ backgroundColor: '#ffffff', flex: .8 }}>
                    <View style={{ height: '100%' }}>
                        <View style={[styles.bgLightGray]}>
                            <View style={[styles.row, styles.padding10, styles.justifySpaceBetween, styles.bgLightGray]}>
                                <Text style={[styles.paddingVertical5, styles.fontWeight500]}>
                                    {this.props.qcPassFail == PASS ? (this.props.qcAttributeMaster && this.props.qcAttributeMaster.qcPassButtonText ? this.props.qcAttributeMaster.qcPassButtonText : PASS) : (this.props.qcAttributeMaster && this.props.qcAttributeMaster.qcFailButtonText ? this.props.qcAttributeMaster.qcFailButtonText : FAIL)}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => { this.props.actions.setState(SET_QC_MODAL_VIEW, { qcModal: false }) }}>
                                    <Text style={[styles.paddingVertical5]}>{CLOSE}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.relative, styles.flex1]}>
                            <Content style={[styles.flex1]}>
                                {this.getQCReasonDataView()}
                                {this.getQCImageView()}
                                {this.getQCRemarksView()}
                            </Content>
                            <SafeAreaView style={[styles.paddingVertical15, styles.paddingHorizontal10, { bottom: 0, left: 0, right: 0 }]}>
                                <Button style={{ backgroundColor: styles.bgPrimaryColor }} full>
                                    <Text style={[styles.fontWhite]}>{PROCEED}</Text>
                                </Button>
                            </SafeAreaView>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        console.log('render of qc modal', this.props)
        return (
            <Modal
                // animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
            >
                {this.getModalView()}
            </Modal>

        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(QCModal)
