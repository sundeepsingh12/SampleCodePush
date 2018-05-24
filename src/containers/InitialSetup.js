import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image
} from 'react-native'
import { StyleProvider, Container, Content, Button, List, ListItem, Body, Left, Right, Input } from 'native-base'
import ServiceStatusIcon from "../components/ServiceStatusIcon"
import Ionicons from 'react-native-vector-icons/Ionicons'
import feStyle from '../themes/FeStyle'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import {
    SETTING_UP,
    DOWNLOAD_SETTINGS,
    APPLYING_SETTINGS,
    VERIFY_HANDSET,
    CANCEL,
    RETRY
} from '../lib/ContainerConstants'

function mapStateToProps(state) {
    return {
        configDownloadService: state.preloader.configDownloadService,
        configSaveService: state.preloader.configSaveService,
        deviceVerificationService: state.preloader.deviceVerificationService,
        error: state.preloader.error
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...preloaderActions }, dispatch)
    }
}

class InitialSetup extends PureComponent {

    invalidateSession = () => {
        this.props.actions.invalidateUserSession(true)
    }

    retry = () => {
        this.props.actions.saveSettingsAndValidateDevice(this.props.configDownloadService, this.props.configSaveService, this.props.deviceVerificationService, this.props.showMobileOtpNumberScreen)
    }

    showSettingUpHeader() {
        return (
            <View style={[feStyle.column, feStyle.flexBasis40, feStyle.alignCenter, feStyle.flex1, feStyle.width100, feStyle.marginTop30, feStyle.marginBottom30]}>
                <View style={{ flexBasis: '70%' }}>
                    <Image
                        style={styles.logoStyle}
                        source={require('../../images/preloader.png')}
                    />
                </View>
                <View style={[{ flexBasis: '30%' }, feStyle.width100, feStyle.alignCenter]}>
                    <Text style={[feStyle.fontBlack, feStyle.fontXxl, feStyle.fontWeight200]}>
                        {SETTING_UP}
                    </Text>
                </View>
            </View>
        )
    }

    showDownloadSettings() {
        return (
            <ListItem style={{ height: 50 }}>
                <Left style={{ flex: 1 }}>
                    <Ionicons name="ios-cloud-download-outline" style={styles.listIcons} />
                    <Text style={[feStyle.fontDarkGray]}>{DOWNLOAD_SETTINGS}</Text>
                </Left>
                <Right style={{ flex: 0.5 }}>
                    <ServiceStatusIcon status={this.props.configDownloadService} />
                </Right>
            </ListItem>
        )
    }

    showApplyingSettings() {
        return (
            <ListItem style={{ height: 50 }}>
                <Left style={{ flex: 1 }}>
                    <Ionicons name="ios-construct-outline" style={styles.listIcons} />
                    <Text style={[feStyle.fontDarkGray]}>{APPLYING_SETTINGS}</Text>
                </Left>
                <Right style={{ flex: 0.5 }}>
                    <ServiceStatusIcon status={this.props.configSaveService} />
                </Right>
            </ListItem>
        )
    }

    showVerifyHandset() {
        return (
            <ListItem style={{ height: 50 }}>
                <Left style={{ flex: 1 }}>
                    <Ionicons name="ios-color-wand-outline" style={styles.listIcons} />
                    <Text style={[feStyle.fontDarkGray]}>{VERIFY_HANDSET}</Text>
                </Left>
                <Right style={{ flex: 0.5 }}>
                    <ServiceStatusIcon status={this.props.deviceVerificationService} />
                </Right>
            </ListItem>
        )
    }

    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Content style={[feStyle.paddingTop30]}>
                        {this.showSettingUpHeader()}
                        <View style={[feStyle.column, feStyle.flexBasis30, feStyle.marginTop30, feStyle.flex1, feStyle.justifyCenter]}>
                            <List>
                                {this.showDownloadSettings()}
                                {this.showApplyingSettings()}
                                {this.showVerifyHandset()}
                            </List>
                        </View>
                        <View style={[feStyle.flexBasis25, feStyle.marginTop15, feStyle.flex1, feStyle.column, feStyle.alignCenter, feStyle.justifyCenter, feStyle.marginTop30]}>
                            {this._renderErrorMessage()}
                        </View>
                    </Content>
                </Container>
            </StyleProvider>
        )
    }

    _renderErrorMessage() {
        if (!_.isEmpty(this.props.error)) {
            return (
                <View>
                    <View>
                        <Text style={[feStyle.fontCenter, feStyle.fontDanger]}>{this.props.error}</Text>
                    </View>
                    <View style={[feStyle.row, feStyle.marginTop30, feStyle.alignCenter, feStyle.justifyCenter]}>
                        <Button onPress={this.invalidateSession} rounded danger style={{ marginLeft: 10, marginRight: 10, }}>
                            <Text style={{ color: '#ffffff' }}>{CANCEL}</Text>
                        </Button>
                        <Button onPress={this.retry} rounded success style={{ marginLeft: 10, marginRight: 10, }}>
                            <Text style={{ color: '#ffffff' }}>{RETRY}</Text>
                        </Button>
                    </View>
                </View>
            )
        }
        else {
            return null
        }
    }
}
var styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    issueWrapper: {
        flex: 1,
        backgroundColor: '#ffffff',
        height: '100%',
        paddingTop: 60,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    listIcons: {
        flexBasis: '20%',
        color: '#a3a3a3',
        fontSize: 24
    },
    logoStyle: {
        width: 94,
        resizeMode: 'contain'
    }

})
export default connect(mapStateToProps, mapDispatchToProps)(InitialSetup)