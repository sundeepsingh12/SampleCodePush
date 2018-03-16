'use strict'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as globalActions from '../modules/global/globalActions'
import renderIf from '../lib/renderIf'
import Loader from '../components/Loader'
import * as backupActions from '../modules/backup/backupActions'
import { StyleSheet, View, TouchableOpacity, FlatList, Image, Text, Alert, Modal, TouchableHighlight } from 'react-native'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'

import {
    Container,
    Content,
    Header,
    Button,
    Body,
    Right,
    Icon,
    List,
    ListItem,
    StyleProvider,
    Footer,
    FooterTab,
    Card,
    Toast
} from 'native-base'
import {
    BACKUP_ALERT_MESSAGE,
    BACKUP_ALERT_TITLE,
    FILE_CREATED,
    EMPLOYEE_CODE,
    FILE_SIZE,
    NEW,
    UNSYNCED_FILES,
    SYNCED_FILES,
    CREATE_BACKUP_BUTTON,
    UPLOAD,
    UPLOADING,
    CANCEL,
    UPLOAD_SUCCESSFUL,
    UPLOAD_FAILED,
    CLOSE,
    LOGGING_OUT,
    OK
} from '../lib/ContainerConstants'
import {
    SET_BACKUP_VIEW,
    SET_BACKUP_TOAST
} from '../lib/constants'
import _ from 'lodash'


function mapStateToProps(state) {
    return {
        syncedFiles: state.backup.syncedFiles,
        unSyncedFiles: state.backup.unSyncedFiles,
        isLoading: state.backup.isLoading,
        backupView: state.backup.backupView,
        fileUploading: state.backup.fileUploading,
        toastMessage: state.backup.toastMessage
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...backupActions }, dispatch)
    }
}

class Backup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indexOfModal: 0,
        }
    }
    componentDidUpdate() {
        if (this.props.toastMessage && this.props.toastMessage != '') {
            Toast.show({
                text: this.props.toastMessage,
                position: 'bottom',
                buttonText: OK,
                duration: 5000
            })
            this.props.actions.setState(SET_BACKUP_TOAST, '')
        }
    }
    componentDidMount() {
        this.props.actions.setState(SET_BACKUP_VIEW, 0)
        this.props.actions.getBackupList()
    }

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    goBack = () => {
        this.props.navigation.goBack()
    }
    createBackupPressed = () => {

        var _buttons = new Array();
        _buttons.push({ text: CANCEL, onPress: this.props.onCancelPressed, style: 'cancel' });
        _buttons.push({ text: 'Create', onPress: () => this.props.actions.createManualBackup(this.props.syncedFiles) });

        return (
            <View>
                {Alert.alert(
                    BACKUP_ALERT_TITLE,
                    BACKUP_ALERT_MESSAGE,
                    _buttons,
                    { cancelable: false }
                )}
            </View>
        );
    }
    getLoader() {
        let loader
        if (this.props.isLoading) {
            loader = <Loader />
        }
        return loader
    }
    renderSyncedData = (item) => {
        return (
            <View style={[{ borderBottomColor: '#f4f4f4', borderBottomWidth: 1 }]}>
                < View style={[styles.padding10, styles.row]} >
                    <View style={{ width: '40%' }}>
                        <Text>
                            {FILE_CREATED}
                        </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text>
                            {item.creationDate}
                        </Text>
                    </View>
                    <View style={{ width: '10%' }}>
                        <Icon onPress={() => this.setState({ indexOfModal: item.id })} size={10} style={{ height: 20, alignSelf: 'flex-end' }} name="ios-more" />
                    </View>
                </View >
                <View style={[styles.padding10, styles.row]}>
                    <View style={{ width: '40%' }}>
                        <Text>
                            {EMPLOYEE_CODE}
                        </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text>
                            {item.employeeCode}
                        </Text>
                    </View>
                    <View style={{ width: '10%' }}>

                    </View>
                </View>
                <View style={[styles.padding10, styles.row]}>
                    <View style={{ width: '40%' }}>
                        <Text>
                            {FILE_SIZE}
                        </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text>
                            {item.size} kb
                        </Text>
                    </View>
                    <View style={{ width: '10%' }}>
                        {renderIf(item.isNew, <View style={[styles.alignCenter, { backgroundColor: '#F6DF80', borderRadius: 3, padding: 3 }]}>
                            <Text style={[styles.fontWhite, { fontSize: 11 }]}>
                                {NEW}
                            </Text>
                        </View>)}
                    </View>
                </View>
            </View>
        )
    }
    getUnSyncedFilesView() {
        let flatListView
        let emptyListView
        if (this.props.isLoading || this.props.backupView != 0) return
        if (!this.props.isLoading && !_.isEmpty(this.props.unSyncedFiles)) {
            flatListView = < FlatList
                data={Object.values(this.props.unSyncedFiles)}
                renderItem={({ item }) => this.renderSyncedData(item)
                }
                keyExtractor={item => String(item.id)}
            />
            return flatListView
        } else if (_.isEmpty(this.props.unSyncedFiles)) {
            emptyListView =
                <View style={[styles.alignCenter, styles.padding20]}>
                    <Text style={styles.fontDarkGray}> There are no Unsynced Files </Text>
                </View>
            return emptyListView
        }

    }
    renderList() {
        let syncedFiles = Object.values(this.props.syncedFiles)
        const list = syncedFiles.sort((transaction1, transaction2) =>
            transaction2.id - transaction1.id
        )
        return list
    }
    getSyncedFilesView() {
        let flatListView
        let emptyListView
        if (this.props.isLoading || this.props.backupView != 0) return
        if (!this.props.isLoading && !_.isEmpty(this.props.syncedFiles)) {
            flatListView = < FlatList
                data={this.renderList()}
                renderItem={({ item }) => this.renderSyncedData(item)
                }
                keyExtractor={item => String(item.id)}
            />
            return flatListView
        } else if (_.isEmpty(this.props.syncedFiles)) {
            emptyListView =
                <View style={[styles.alignCenter, styles.padding20]}>
                    <Text style={styles.fontDarkGray}> There are no Synced Files </Text>
                </View>
            return emptyListView
        }

    }
    headerView() {
        return <Header style={[styles.bgPrimary, style.header]}>
            <Body>
                <View
                    style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                    <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.goBack() }}>
                        <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                    </TouchableOpacity>
                    <View style={[style.headerBody]}>
                        <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.navigation.state.params.displayName}</Text>
                    </View>
                    <View style={[style.headerRight]}>
                    </View>
                </View>
            </Body>
        </Header>

    }
    getModalView() {
        if (this.props.backupView != 0 || this.state.indexOfModal == 0) return
        let modal
        if (this.state.indexOfModal > 0) {
            modal =
                <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.indexOfModal > 0}
                        onRequestClose={() => this.setState({ indexOfModal: 0 })}>
                        <TouchableHighlight
                            onPress={() => this.setState({ indexOfModal: 0 })}
                            style={[styles.flex1, styles.column, styles.justifyEnd, { backgroundColor: 'rgba(0,0,0,.5)' }]}>
                            <View style={[styles.bgWhite, styles.justifyEnd]}>
                                <Button full transparent style={[{ borderBottomColor: '#f4f4f4', borderBottomWidth: 1, height: 60 }]} onPress={() => this.props.actions.uploadBackupFile(this.state.indexOfModal, this.props.syncedFiles)}>
                                    <Text style={[styles.fontPrimary, styles.fontXl]}>
                                        {UPLOAD}
                                    </Text>
                                </Button>
                                <Button full transparent style={{ height: 60 }} onPress={() => this.setState({ indexOfModal: 0 })}>
                                    <Text style={[styles.fontDarkGray, styles.fontXl]}>
                                       {CANCEL}
                                    </Text>
                                </Button>
                            </View>
                        </TouchableHighlight>
                    </Modal>
                </View>

        } else {
            modal =
                <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.indexOfModal < 0}
                        onRequestClose={() => this.setState({ indexOfModal: 0 })}>
                        <TouchableHighlight
                            onPress={() => this.setState({ indexOfModal: 0 })}
                            style={[styles.flex1, styles.column, styles.justifyEnd, { backgroundColor: 'rgba(0,0,0,.5)' }]}>
                            <View style={[styles.bgWhite, styles.justifyEnd]}>
                                <Button full transparent style={[{ borderBottomColor: '#f4f4f4', borderBottomWidth: 1, height: 60 }]} onPress={() => this.props.actions.uploadBackupFile(this.state.indexOfModal, this.props.unSyncedFiles)}>
                                    <Text style={[styles.fontPrimary, styles.fontXl]}>
                                    {UPLOAD}
                                    </Text>
                                </Button>
                                <Button full transparent style={[{ borderBottomColor: '#f4f4f4', borderBottomWidth: 1, height: 60 }]} onPress={
                                    () => {
                                        this.setState({ indexOfModal: 0 })
                                        this.props.actions.deleteBackupFile(this.state.indexOfModal, this.props.unSyncedFiles)
                                    }
                                }>
                                    <Text style={[styles.fontDanger, styles.fontXl]}>
                                        Delete
                                    </Text>
                                </Button>
                                <Button full transparent style={{ height: 60 }} onPress={() => this.setState({ indexOfModal: 0 })}>
                                    <Text style={[styles.fontDarkGray, styles.fontXl]}>
                                       {CANCEL}
                                    </Text>
                                </Button>
                            </View>
                        </TouchableHighlight>
                    </Modal>
                </View >
        }
        return modal
    }

    getUnsyncedFilesHeader() {
        let view
        if (this.props.backupView != 0) return
        if (!this.props.isLoading) {
            view = <View style={[styles.padding10, { borderBottomColor: '#f4f4f4', borderBottomWidth: 1 }]}>
                <Text style={[styles.fontLg, styles.fontBlack]}>
                    {UNSYNCED_FILES}
                </Text>
            </View>
        }
        return view
    }

    getSyncedFilesHeader() {
        let view
        if (this.props.backupView != 0) return
        if (!this.props.isLoading) {
            view = <View style={[styles.padding10, { borderBottomColor: '#f4f4f4', borderBottomWidth: 1 }]}>
                <Text style={[styles.fontLg, styles.fontBlack]}>
                    {SYNCED_FILES}
                </Text>
            </View>
        }
        return view
    }

    uploadingView() {
        if (this.props.backupView == 1) {
            return <View style={[styles.flex1, styles.justifySpaceBetween]}>
                <View style={[styles.justifyCenter, styles.flexBasis100, styles.padding10]}>
                    <View style={[styles.padding5, styles.row, styles.justifySpaceBetween,]}>
                        <Text style={[styles.fontBlack, styles.fontXl]}>
                           {UPLOADING}
                    </Text>
                    </View>
                    < View style={[styles.padding5, styles.row]} >
                        <View style={{ width: '40%' }}>
                            <Text>
                                {FILE_CREATED}
                            </Text>
                        </View>
                        <View style={{ width: '50%' }}>
                            <Text>
                                {this.props.fileUploading.creationDate}
                            </Text>
                        </View>
                    </View >
                    <View style={[styles.padding5, styles.row]}>
                        <View style={{ width: '40%' }}>
                            <Text>
                                {EMPLOYEE_CODE}
                            </Text>
                        </View>
                        <View style={{ width: '50%' }}>
                            <Text>
                                {this.props.fileUploading.employeeCode}
                            </Text>
                        </View>
                        <View style={{ width: '10%' }}>

                        </View>
                    </View>
                    <View style={[styles.padding5, styles.row]}>
                        <View style={{ width: '40%' }}>
                            <Text>
                                {FILE_SIZE}
                            </Text>
                        </View>
                        <View style={{ width: '50%' }}>
                            <Text>
                                {this.props.fileUploading.size} kb
                        </Text>
                        </View>
                    </View>
                </View>
            </View>
        }
    }

    createBackupButton() {
        if (this.props.isLoading || this.props.backupView != 0) return
        let button =
            <View style={[styles.padding15]}>
                <Button full style={[styles.bgWhite]} onPress={this.createBackupPressed}>
                    <Text style={[styles.fontPrimary]}>
                        {CREATE_BACKUP_BUTTON}
                    </Text>
                </Button>
            </View>
        return button
    }

    uploadSuccessView() {
        if (this.props.backupView == 2) {
            return <View style={[styles.flex1, styles.justifySpaceBetween]}>
                <View style={[styles.alignCenter, styles.justifyCenter, styles.flexBasis50]}>
                    <Image
                        style={[style.imageSync]}
                        source={require('../../images/fareye-default-iconset/syncscreen/All_Done.png')}
                    />
                    <Text style={[styles.fontBlack, styles.marginTop30]}>
                       {UPLOAD_SUCCESSFUL}
                    </Text>
                </View>
                <View style={[styles.flexBasis40, styles.alignCenter, styles.justifyCenter]}>
                </View>
            </View>
        }
    }

    failureView() {
        if (this.props.backupView == 3) {
            return <View style={[styles.flex1, styles.justifySpaceBetween]}>
                <View style={[styles.alignCenter, styles.justifyCenter, styles.flexBasis50]}>
                    <Image
                        style={[style.imageSync]}
                        source={require('../../images/fareye-default-iconset/error.png')}
                    />
                    <Text style={[styles.fontBlack, styles.marginTop30]}>
                       {UPLOAD_FAILED}
                    </Text>
                </View>
                <View style={[styles.flexBasis40, styles.alignCenter, styles.justifyCenter]}>

                    <View style={[styles.marginTop30, styles.alignCenter]}>
                        <Button bordered style={{ borderColor: styles.bgPrimary.backgroundColor }}
                            onPress={() => {
                                this.props.actions.setState(SET_BACKUP_VIEW, 0)
                                this.setState({ indexOfModal: 0 })
                            }}  >
                            <Text style={[styles.fontPrimary]}>{CLOSE}</Text>
                        </Button>
                    </View>
                </View>
            </View>
        }

    }

    getLogoutView() {
        if (this.props.backupView == 4) {
            return <View style={[styles.flex1, styles.justifySpaceBetween]}>
                <View style={[styles.alignCenter, styles.justifyCenter, styles.flexBasis50]}>
                    <Loader />
                    <Text style={[styles.fontBlack, styles.marginTop30]}>
                        {LOGGING_OUT}
                    </Text>
                </View>

            </View>
        }

    }

    render() {
        let headerView = this.headerView()
        let loader = this.getLoader()
        let backupButton = this.createBackupButton()
        let unSyncedFilesView = this.getUnSyncedFilesView()
        let syncedFilesView = this.getSyncedFilesView()
        let modalView = this.getModalView()
        let unsyncedFilesHeader = this.getUnsyncedFilesHeader()
        let syncedFilesHeader = this.getSyncedFilesHeader()
        let uploadView = this.uploadingView()
        let uploadSuccessView = this.uploadSuccessView()
        let uploadFailureView = this.failureView()
        let logoutView = this.getLogoutView()
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    {headerView}

                    {uploadView}
                    {uploadSuccessView}
                    {uploadFailureView}
                    {logoutView}
                    {renderIf(this.props.backupView == 0, <Content style={[styles.bgLightGray]}>
                        {backupButton}
                        {modalView}
                        {loader}
                        <View style={[styles.marginBottom10, styles.bgWhite]}>
                            {unsyncedFilesHeader}
                            {unSyncedFilesView}
                        </View>
                        <View style={[styles.marginBottom10, styles.bgWhite]}>
                            {syncedFilesHeader}
                            {syncedFilesView}
                        </View>
                    </Content>)}
                </Container>
            </StyleProvider >)
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
    imageSync: {
        width: 116,
        height: 116,
        resizeMode: 'contain'
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(Backup)
