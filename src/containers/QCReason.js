'use strict'
import _ from 'lodash';
import styles from '../themes/FeStyle';
import { SafeAreaView } from 'react-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { View, Text, FlatList } from 'react-native';
import { CheckBox, Button, Content, Footer, FooterTab } from 'native-base';
import * as globalActions from '../modules/global/globalActions';
import * as qcActions from '../modules/qc/qcActions';
import { SELECT_REASON, FAIL, PASS, CLOSE, PROCEED } from '../lib/ContainerConstants';
import TitleHeader from '../components/TitleHeader';
import Loader from '../components/Loader';

function mapStateToProps(state) {
    return {
        qcReasonLoading: state.qc.qcReasonLoading,
        qcReasonData: state.qc.qcReasonData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...qcActions }, dispatch)
    }
}

class QCReason extends PureComponent {

    static navigationOptions = ({ navigation }) => {
        return { header: <TitleHeader pageName={navigation.state.params.qcAttributeMaster.label} goBack={navigation.goBack} /> }
    }

    componentDidMount() {
        this.props.actions.getQCReasonData(this.props.navigation.state.params.qcDataArray, this.props.navigation.state.params.qcAttributeMaster, this.props.navigation.state.params.jobTransaction, this.props.navigation.state.params.formLayoutState);
    }

    renderQCReasonView(item) {
        return (
            <View style={[styles.row, styles.padding10]}>
                <CheckBox
                    checked={item.qcResult}
                    color={styles.primaryColor}
                    onPress={() => { this.props.actions.changeQCReasonResult(item.objectId, this.props.qcReasonData) }} />
                <Text style={[styles.paddingLeft10, styles.marginLeft10]}>{item.optionLabel}</Text>
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
        return reasonDataView;
    }

    render() {
        if (this.props.qcReasonLoading) {
            return <Loader />
        }
        return (
            <View style={[styles.flex1, styles.column]}>
                <View style={{ backgroundColor: '#ffffff' }}>
                    <View style={{ height: '100%' }}>
                        <View style={[styles.bgLightGray]}>
                            <View style={[styles.row, styles.padding10, styles.justifySpaceBetween, styles.bgLightGray]}>
                                <Text style={[styles.paddingVertical5, styles.fontWeight500]}>
                                    {this.props.navigation.state.params.qcAttributeMaster.qcValidationMap.qcFailButtonTextValidation ? this.props.navigation.state.params.qcAttributeMaster.qcValidationMap.qcFailButtonTextValidation : FAIL}
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.relative, styles.flex1]}>
                            <Content style={[styles.flex1]}>
                                {this.getQCReasonDataView()}
                            </Content>
                            <SafeAreaView style={[styles.bgWhite]}>
                                <Footer style={[styles.footer]}>
                                    <FooterTab style={[styles.padding10]}>
                                        <Button style={{ backgroundColor: styles.bgPrimaryColor }} full onPress={() => this.props.actions.saveQCReasonAndNavigate(this.props.qcReasonData, this.props.navigation.state.params.qcAttributeMaster, this.props.navigation.state.params.jobTransaction, this.props.navigation.state.params.formLayoutState, this.props.navigation.state.params.qcDataArray)}>
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


export default connect(mapStateToProps, mapDispatchToProps)(QCReason)
