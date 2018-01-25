'use strict'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SearchBar from '../components/SearchBar'
import * as globalActions from '../modules/global/globalActions'
import renderIf from '../lib/renderIf'
import Loader from '../components/Loader'
import * as homeActions from '../modules/home/homeActions'
import { StyleSheet, View, TouchableOpacity, FlatList, Image, Text, Alert, Modal, TouchableHighlight } from 'react-native'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import {
    // SET_DATA_STORE_ATTR_MAP,
} from '../lib/constants'
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
    //  EXTERNAL_DATA_STORE,
} from '../lib/AttributeConstants'
import {

} from '../lib/constants'
import _ from 'lodash'

function mapStateToProps(state) {
    return {
        backupUploadView: state.home.backupUploadView,
        uploadingFileCount: state.home.uploadingFileCount,
        failedUploadCount: state.home.failedUploadCount,
        unsyncBackupFilesList: state.home.unsyncBackupFilesList
    }
};

/*
 * Bind all the actions
 */
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...homeActions }, dispatch)
    }
}

class UnsyncBackupUpload extends Component {
    constructor(props) {
        super(props);
    }
    componentDidUpdate() {
        // if (this.props.toastMessage && this.props.toastMessage != '') {
        //     Toast.show({
        //         text: this.props.toastMessage,
        //         position: 'bottom',
        //         buttonText: 'Okay',
        //         duration: 5000
        //     })
        //     this.props.actions.setState(SET_BACKUP_TOAST, '')
        // }
    }
    componentWillMount() {
        this.props.actions.readAndUploadFiles()
    }
    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    goBack = () => {
        this.props.navigation.goBack()
    }
    getLoader() {
        let loader
        if (this.props.isLoading) {
            loader = <Loader />
        }
        return loader
    }
    uploadSuccessView() {
        if (this.props.backupUploadView == 2) {
            return <View style={[styles.flex1, styles.justifySpaceBetween]}>
                <View style={[styles.alignCenter, styles.justifyCenter, styles.flexBasis50]}>
                    <Image
                        style={[style.imageSync]}
                        source={require('../../images/fareye-default-iconset/syncscreen/All_Done.png')}
                    />
                    <Text style={[styles.fontBlack, styles.marginTop30]}>
                        Upload Successful
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
                        style={[style.imageSync]}
                        source={require('../../images/fareye-default-iconset/error.png')}
                    />
                    <Text style={[styles.fontBlack, styles.marginTop30]}>
                        Unable to upload {this.props.failedUploadCount} backup file
                    </Text>
                </View>
                <View style={[styles.flexBasis40, styles.alignCenter, styles.justifyCenter]}>
                    <View style={[styles.marginTop30, styles.alignCenter]}>
                        <Button transparent style={StyleSheet.flatten([styles.padding10, styles.bgLightGray])}
                            onPress={() => {
                                this.props.actions.readAndUploadFiles()
                            }}  >
                            <Text style={[styles.fontBlack]}>Try Again</Text>
                        </Button>
                    </View>
                    <View style={[styles.marginTop30, styles.alignCenter]}>
                        <Button transparent style={StyleSheet.flatten([styles.padding10, styles.bgWhite])}
                            onPress={() => {
                                this.props.actions.navigateToScene('HomeTabNavigatorScreen')
                            }}  >
                            <Text style={[styles.fontPrimary, styles.fontXl]}>Continue</Text>
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
                        Logging out
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
                        {this.props.unsyncBackupFilesList.length} Unsynced Backup Files Found
                </Text>
                </View>
                <View style={[styles.flexBasis33_3, styles.justifyCenter, styles.column, styles.padding10]}>
                    <View style={[styles.row, styles.justifySpaceBetween, styles.paddingBottom10]}>
                        <Text style={[styles.fontBlack]}>
                            Uploaded {this.props.uploadingFileCount}/{this.props.unsyncBackupFilesList.length} Unsynced Backup Files
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

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(UnsyncBackupUpload)