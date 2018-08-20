'use strict'
import isEmpty from 'lodash/isEmpty';
import styles from '../themes/FeStyle';
import { SafeAreaView } from 'react-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { View, Text, FlatList, BackHandler, Alert } from 'react-native';
import { Icon, Button, Content, Footer, FooterTab } from 'native-base';
import * as globalActions from '../modules/global/globalActions';
import * as qcActions from '../modules/qc/qcActions';
import { QCAttribute } from '../lib/constants';
import { FAIL, PASS, CLOSE, PROCEED } from '../lib/ContainerConstants';
import TitleHeader from '../components/TitleHeader';
import Loader from '../components/Loader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { navigate } from '../modules/navigators/NavigationService';

function mapStateToProps(state) {
    return {
        qcPassFailResult: state.qc.qcPassFailResult,
        qcImageData: state.qc.qcImageData,
        qcRemarksData: state.qc.qcRemarksData,
        qcReasonData: state.qc.qcReasonData,
        qcDataArray: state.qc.qcDataArray
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...qcActions }, dispatch)
    }
}

class QCSummary extends PureComponent {

    didFocusSubscription;
    willBlurSubscription;

    static navigationOptions = ({ navigation }) => {
        return { header: <TitleHeader pageName={navigation.state.params.qcAttributeMaster.label} goBack={navigation.state.params.backForSummary} /> }
    }

    goBack = () => {
        Alert.alert(null, 'All the filled data will be lost,Do you still want to go back',
            [{ text: 'CANCEL', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'Yes, Go Back', onPress: () => navigate(QCAttribute) },],
            { cancelable: true })
    }

    componentDidMount() {
        this.props.navigation.setParams({ backForSummary: this.goBack });
        this.didFocusSubscription = this.props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
        this.willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
    }

    onBackButtonPressAndroid = () => {
        this.goBack();
        return true;
    };

    renderQCReasonView(item) {
        if (!item.qcResult) {
            return null;
        }
        return (
            <View style={[styles.row, styles.padding10, styles.alignCenter]}>
                <MaterialIcons name='fiber-manual-record' />
                <Text style={[styles.fontLg, styles.marginLeft10]}>{item.optionLabel}</Text>
            </View>
        )
    }

    getQCReasonDataView() {
        if (isEmpty(this.props.qcReasonData) || this.props.qcPassFailResult) {
            return null;
        }
        let reasonDataView =
            <View style={[styles.marginTop10, styles.bgWhite]}>
                <Text style={[styles.padding10, { color: '#727272' }, styles.fontXl]}>{this.props.navigation.state.params.qcAttributeMaster.childList.optionCheckboxArray.label}</Text>
                <FlatList
                    data={Object.values(this.props.qcReasonData)}
                    renderItem={({ item }) => this.renderQCReasonView(item)}
                    keyExtractor={item => '' + item.objectId}
                />
            </View>
        return reasonDataView;
    }

    getQCRemarksView() {
        if (!this.props.qcRemarksData || !this.props.qcRemarksData.trim()) {
            return null;
        }
        return (
            <View style={[styles.marginTop10, styles.bgWhite]}>
                <Text style={[styles.padding10, { color: '#727272' }, styles.fontXl]}>{this.props.navigation.state.params.qcAttributeMaster.childList.qcRemark.label}</Text>
                <Text style={[styles.fontLg, styles.marginLeft10, styles.marginBottom20]}>{this.props.qcRemarksData}</Text>
            </View>
        )
    }

    renderQCItemView(item) {
        // console.log(item);
        return (
            <View style={[styles.row, styles.borderBottomGray]}>
                <View style={[styles.flexBasis80]}>
                    <View style={[styles.paddingVertical15, styles.paddingHorizontal10]}>
                        <Text style={[styles.fontLg, styles.bold]}>{item.qcLabel}</Text>
                    </View>
                    <View style={[styles.paddingTop0, styles.paddingBottom15, styles.paddingHorizontal10]}>
                        <Text style={[styles.fontLg]}>{item.qcValue}</Text>
                    </View>
                </View>
                <View style={[styles.flexBasis20, styles.alignEnd, styles.justifyCenter, styles.paddingRight10]}>
                    <Icon name={item.qcResult ? "md-checkmark" : "md-close"} style={[styles.fontDarkGray]} />
                </View>

            </View>
        )
    }

    getQCCheckListView() {
        if (isEmpty(this.props.qcDataArray)) {
            return null;
        }

        return (
            <View style={[styles.marginTop10, styles.bgWhite]}>
                <Text style={[styles.padding10, { color: '#727272' }, styles.fontXl]}>{this.props.navigation.state.params.qcAttributeMaster.label}</Text>
                <View style={[styles.flex1]}>
                    <FlatList
                        data={this.props.qcDataArray}
                        renderItem={({ item }) => this.renderQCItemView(item)}
                        keyExtractor={item => '' + item.objectId}
                    />
                </View>
            </View>
        )
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
            <SafeAreaView style={[styles.flex1, styles.column, styles.bgWhite]}>
                <View style={[styles.flex1, styles.column]}>
                    <View style={[styles.bgLightGray]}>
                        <View style={{ height: '100%' }}>
                            <View style={[styles.bgWhite, styles.paddingVertical15, styles.paddingHorizontal10]}>
                                <Text style={[styles.fontWeight500, this.props.qcPassFailResult ? styles.fontSuccess : styles.fontDanger, styles.fontXxl]}>
                                    {this.getQCResultText()}
                                </Text>
                            </View>
                            <View style={[styles.relative, styles.flex1]}>
                                <Content style={[styles.flex1]}>
                                    {this.getQCCheckListView()}
                                    {this.getQCReasonDataView()}
                                    {this.getQCRemarksView()}
                                </Content>
                                <Footer style={[styles.footer]}>
                                    <FooterTab style={[styles.padding10]}>
                                        <Button style={{ backgroundColor: styles.bgPrimaryColor }} full onPress={() => this.props.actions.saveQCAndNavigateToFormLayout(this.props.navigation.state.params.formLayoutState, this.props.navigation.state.params.qcAttributeMaster, this.props.navigation.state.params.jobTransaction)}>
                                            <Text style={[styles.fontLg, styles.fontWhite]}>{PROCEED}</Text>
                                        </Button>
                                    </FooterTab>
                                </Footer>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(QCSummary)
