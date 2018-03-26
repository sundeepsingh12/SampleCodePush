'use strict'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SearchBar from '../components/SearchBar'
import * as globalActions from '../modules/global/globalActions'
import Loader from '../components/Loader'
import * as homeActions from '../modules/home/homeActions'
import { StyleSheet, View, Image, Text } from 'react-native'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import {
    SET_FAIL_UPLOAD_COUNT
} from '../lib/constants'
import {
    Container,
    Button,
    StyleProvider,
} from 'native-base'
import _ from 'lodash'
import {
    UNABLE_TO_UPLOAD,
    BACKUP_FILE,
    UPLOAD_SUCCESSFUL,
    TRY_AGAIN,
    CONTINUE,
    LOGGING_OUT,
    UNSYNCED_BACKUP_FILES_FOUND,
    UPLOADED,
    UNSYNCED_BACKUP_FILES,
} from '../lib/ContainerConstants'

function mapStateToProps(state) {
    return {
        backupUploadView: state.home.backupUploadView,
        uploadingFileCount: state.home.uploadingFileCount,
        failedUploadCount: state.home.failedUploadCount,
        unsyncBackupFilesList: state.home.unsyncBackupFilesList
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...homeActions }, dispatch)
    }
}

class UnsyncBackupUpload extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        if (this.props.navigation.state.params && this.props.navigation.state.params > 0) {
            this.props.actions.setState(SET_FAIL_UPLOAD_COUNT, this.props.navigation.state.params)
        } else {
            this.props.actions.readAndUploadFiles()
        }
    }
    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    uploadSuccessView() {
        if (this.props.backupUploadView == 2) {
            return <View style={[styles.flex1, styles.justifySpaceBetween]}>
                <View style={[styles.alignCenter, styles.justifyCenter, styles.flexBasis50]}>
                    <Image
                        style={[styles.imageSync]}
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
        if (this.props.failedUploadCount > 0) {
            return <View style={[styles.flex1, styles.justifySpaceBetween]}>
                <View style={[styles.alignCenter, styles.justifyCenter, styles.flexBasis50]}>
                    <Image
                        style={[styles.imageSync]}
                        source={require('../../images/fareye-default-iconset/error.png')}
                    />
                    <Text style={[styles.fontBlack, styles.marginTop30]}>
                        {UNABLE_TO_UPLOAD} {this.props.failedUploadCount} {BACKUP_FILE}
                    </Text>
                </View>
                <View style={[styles.flexBasis40, styles.alignCenter, styles.justifyCenter]}>
                    <View style={[styles.marginTop30, styles.alignCenter]}>
                        <Button transparent style={StyleSheet.flatten([styles.padding10, styles.bgLightGray])}
                            onPress={() => {
                                this.props.actions.readAndUploadFiles()
                                this.props.actions.resetFailCountInStore()
                            }}  >
                            <Text style={[styles.fontBlack]}>{TRY_AGAIN}</Text>
                        </Button>
                    </View>
                    <View style={[styles.marginTop30, styles.alignCenter]}>
                        <Button transparent style={StyleSheet.flatten([styles.padding10, styles.bgWhite])}
                            onPress={() => {
                                this.props.actions.navigateToScene('HomeTabNavigatorScreen')
                                this.props.actions.resetFailCountInStore()
                            }}  >
                            <Text style={[styles.fontPrimary, styles.fontXl]}>{CONTINUE}</Text>
                        </Button>
                    </View>
                </View>
            </View>
        }
    }

    getLogoutView() {
        if (this.props.backupUploadView == 3) {
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

    getUploadingView() {
        if (this.props.backupUploadView == 0 && this.props.failedUploadCount == 0) {
            return <View style={[styles.flex1, styles.justifyCenter, styles.column]}>
                <View style={[styles.justifyCenter, styles.flexBasis25, styles.padding20]}>
                    <Text style={[styles.fontXl, styles.fontBlack]}>
                        {this.props.unsyncBackupFilesList.length} {UNSYNCED_BACKUP_FILES_FOUND}
                </Text>
                </View>
                <View style={[styles.flexBasis33_3, styles.justifyCenter, styles.column, styles.padding10]}>
                    <View style={[styles.row, styles.justifySpaceBetween, styles.paddingBottom10]}>
                        <Text style={[styles.fontBlack]}>
                            {UPLOADED} {this.props.uploadingFileCount}/{this.props.unsyncBackupFilesList.length} {UNSYNCED_BACKUP_FILES}
                    </Text>
                        <Text style={[styles.fontDarkGray]}>
                            {parseInt(this.props.uploadingFileCount / this.props.unsyncBackupFilesList.length * 100)}%
                 </Text>
                    </View>
                    <View style={{ width: '100%', borderRadius: 8, height: 10, backgroundColor: styles.bgGray.backgroundColor }}>
                        <View style={{ width: String(this.props.uploadingFileCount / this.props.unsyncBackupFilesList.length * 100 + "%"), borderRadius: 8, height: 10, backgroundColor: styles.bgPrimary.backgroundColor }}>
                        </View>
                    </View>
                </View>

            </View>
        }
    }
    
    render() {
        let uploadingView = this.getUploadingView()
        let failureView = this.failureView()
        let uploadSuccessView = this.uploadSuccessView()
        let logoutView = this.getLogoutView()
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    {uploadingView}
                    {failureView}
                    {uploadSuccessView}
                    {logoutView}
                </Container>
            </StyleProvider >)
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(UnsyncBackupUpload)