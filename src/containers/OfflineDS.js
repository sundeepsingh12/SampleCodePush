'use strict'
import React, { Component } from 'react'
import * as offlineDSActions from '../modules/offlineDS/offlineDSActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SearchBar from '../components/SearchBar'
import * as globalActions from '../modules/global/globalActions'
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import {
    SET_OFFLINEDS_INITIAL_STATE,
} from '../lib/constants'
import {
    Container,
    Header,
    Button,
    Body,
    Right,
    Icon,
    StyleProvider,
} from 'native-base'
import {
    DOWNLOADING_OFFLINE_DS,
    DOWNLOAD_SUCCESSFUL,
    DOWNLOAD_FAILED,
    CLOSE
} from '../lib/ContainerConstants'
import _ from 'lodash'


function mapStateToProps(state) {
    return {
        progressBarStatus: state.offlineDS.progressBarStatus,
        downLoadingStatus: state.offlineDS.downLoadingStatus,
        fileName: state.offlineDS.fileName,
        lastSyncTime: state.offlineDS.lastSyncTime
    }
};

/*
 * Bind all the actions
 */
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...offlineDSActions }, dispatch)
    }
}

class OfflineDS extends Component {

    componentDidMount() {
        this.props.actions.getLastSyncTime()
    }

    static navigationOptions = ({ navigation }) => {
        return { header: null }
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

    initialScreen() {
        if (this.props.downLoadingStatus == 0) {
            return <View style={[styles.flexBasis100, styles.justifySpaceBetween]}>
                <View style={[styles.alignCenter, styles.justifyCenter, styles.flexBasis50]}>
                    <Image
                        style={[style.imageSync]}
                        source={require('../../images/fareye-default-iconset/sync-cloud.png')}
                    />
                </View>
                <View style={[styles.flexBasis50, styles.alignCenter, styles.justifyCenter]}>
                    <Text style={[styles.fontBlack]}>
                        {this.props.lastSyncTime}
                    </Text>
                    <View style={[styles.marginTop30, styles.alignCenter]}>
                        <Button style={[styles.bgPrimary]}
                            onPress={() => {
                                this.props.actions.syncDataStore(this.props.lastSyncTime)
                            }} >
                            <Text style={[styles.fontWhite]}>Sync Datastore</Text>
                        </Button>
                    </View>
                </View>
            </View>
        }
    }

    downLoadingView() {
        if (this.props.downLoadingStatus == 1) {
            return <View style={[styles.flex1, styles.justifySpaceBetween]}>
                <View style={[styles.justifyCenter, styles.flexBasis100, styles.padding10]}>
                    <View style={[styles.row, styles.justifySpaceBetween, styles.marginBottom10]}>
                        <Text style={[styles.fontBlack]}>
                            {DOWNLOADING_OFFLINE_DS} {this.props.fileName}...
                    </Text>
                        <Text style={[styles.fontDarkGray]}>
                            {this.props.progressBarStatus}%
                    </Text>
                    </View>
                    <View style={{ width: '100%', borderRadius: 8, height: 10, backgroundColor: styles.bgGray.backgroundColor }}>
                        <View style={{ width: String(this.props.progressBarStatus + "%"), borderRadius: 8, height: 10, backgroundColor: styles.bgPrimary.backgroundColor }}>
                        </View>
                    </View>
                </View>
            </View>
        }
    }

    successView() {
        if (this.props.downLoadingStatus == 2) {
            return <View style={[styles.flex1, styles.justifySpaceBetween]}>
                <View style={[styles.alignCenter, styles.justifyCenter, styles.flexBasis50]}>
                    <Image
                        style={[style.imageSync]}
                        source={require('../../images/fareye-default-iconset/syncscreen/All_Done.png')}
                    />
                    <Text style={[styles.fontBlack, styles.marginTop30]}>
                        {DOWNLOAD_SUCCESSFUL}
                    </Text>
                </View>
                <View style={[styles.flexBasis40, styles.alignCenter, styles.justifyCenter]}>

                    <View style={[styles.marginTop30, styles.alignCenter]}>
                        <Button bordered style={{ borderColor: styles.bgPrimary.backgroundColor }}
                            onPress={() => { this.goBack() }}  >
                            <Text style={[styles.fontPrimary]}>Close</Text>
                        </Button>
                    </View>
                </View>
            </View>
        }
    }

    failureView() {
        if (this.props.downLoadingStatus == 3) {
            return <View style={[styles.flex1, styles.justifySpaceBetween]}>
                <View style={[styles.alignCenter, styles.justifyCenter, styles.flexBasis50]}>
                    <Image
                        style={[style.imageSync]}
                        source={require('../../images/fareye-default-iconset/error.png')}
                    />
                    <Text style={[styles.fontBlack, styles.marginTop30]}>
                        {DOWNLOAD_FAILED}
                    </Text>
                </View>
                <View style={[styles.flexBasis40, styles.alignCenter, styles.justifyCenter]}>

                    <View style={[styles.marginTop30, styles.alignCenter]}>
                        <Button bordered style={{ borderColor: styles.bgPrimary.backgroundColor }}
                            onPress={() => { this.goBack() }}  >
                            <Text style={[styles.fontPrimary]}>{CLOSE}</Text>
                        </Button>
                    </View>
                </View>
            </View>
        }

    }

    goBack = () => {
        if (this.props.downLoadingStatus != 1) {
            this.props.actions.setState(SET_OFFLINEDS_INITIAL_STATE)
        }
        this.props.navigation.goBack()
    }

    componentWillUnmount() {
        this.goBack()
    }

    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    {this.headerView()}
                    {this.initialScreen()}
                    {this.downLoadingView()}
                    {this.successView()}
                    {this.failureView()}
                </Container>
            </StyleProvider>)
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
export default connect(mapStateToProps, mapDispatchToProps)(OfflineDS)
