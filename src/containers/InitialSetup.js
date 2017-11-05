import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image
} from 'react-native'
import { Container, Button, List, ListItem, Body, Left, Right, Input } from 'native-base';
import ServiceStatusIcon from "../components/ServiceStatusIcon"
import Ionicons from 'react-native-vector-icons/Ionicons'
import feStyle from '../themes/FeStyle'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as preloaderActions from '../modules/pre-loader/preloaderActions'

function mapStateToProps(state) {
  return {
    configDownloadService:state.preloader.configDownloadService,
    configSaveService:state.preloader.configSaveService,
    deviceVerificationService:state.preloader.deviceVerificationService,
    isError:state.preloader.isError,
    error:state.preloader.error
  }
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({  ...preloaderActions }, dispatch)
  }
}

class InitialSetup extends Component{

     invalidateSession = () => {
        this.props.actions.invalidateUserSession()
    }

    retry = () => {
        this.props.actions.saveSettingsAndValidateDevice(this.props.configDownloadService, this.props.configSaveService, this.props.deviceVerificationService)
    }

    render(){
        return (
            <View style={styles.issueWrapper}>
                        <View style={[feStyle.column, feStyle.flexBasis40, feStyle.alignCenter, feStyle.flex1, feStyle.width100]}>
                            <View style={{ flexBasis: '70%' }}>
                                <Image
                                    style={styles.logoStyle}
                                    source={require('../../images/preloader.png')}
                                />
                            </View>
                            <View style={[{ flexBasis: '30%' }, feStyle.width100, feStyle.alignCenter]}>
                                <Text style={[feStyle.fontBlack, feStyle.fontXxl, feStyle.fontWeight200]}>
                                    Setting you up...
                                </Text>
                            </View>
                        </View>
                        <View style={[feStyle.column, feStyle.flexBasis30, feStyle.marginTop10, feStyle.flex1, feStyle.justifyCenter]}>
                            <List>
                                <ListItem style={{ height: 50 }}>
                                    <Left style={{ flex: 1 }}>
                                        <Ionicons name="ios-cloud-download-outline" style={styles.listIcons} />
                                        <Text style={[feStyle.fontDarkGray]}>Downloading settings</Text>
                                    </Left>
                                    <Right style={{ flex: 0.5 }}>
                                        <ServiceStatusIcon status={this.props.configDownloadService} />
                                    </Right>
                                </ListItem>
                                <ListItem style={{ height: 50 }}>
                                    <Left style={{ flex: 1 }}>
                                        <Ionicons name="ios-construct-outline" style={styles.listIcons} />
                                        <Text style={[feStyle.fontDarkGray]}>Applying settings</Text>
                                    </Left>
                                    <Right style={{ flex: 0.5 }}>
                                        <ServiceStatusIcon status={this.props.configSaveService} />
                                    </Right>
                                </ListItem>
                                <ListItem style={{ height: 50 }}>
                                    <Left style={{ flex: 1 }}>
                                        <Ionicons name="ios-color-wand-outline" style={styles.listIcons} />
                                        <Text style={[feStyle.fontDarkGray]}>Verifying handset</Text>
                                    </Left>
                                    <Right style={{ flex: 0.5 }}>
                                        <ServiceStatusIcon status={this.props.deviceVerificationService} />
                                    </Right>
                                </ListItem>
                            </List>
                        </View>
                        <View style={[feStyle.flexBasis25, feStyle.marginTop15, feStyle.flex1, feStyle.column, feStyle.alignCenter, feStyle.justifyCenter]}>
                            {this._renderErrorMessage()}
                            {this._renderButtons()}
                        </View>
                    </View>
        )
    }
       _renderErrorMessage() {
        if (this.props.isError) {
            return (
                <Text
                    style={[feStyle.row, feStyle.justifyCenter, feStyle.fontDanger]}>{this.props.error}</Text>
            );
        } else {
            return null;
        }
    }
     _renderButtons() {
        if (this.props.isError) {
            return (
                <View style={feStyle.row}>
                    <Button onPress={this.invalidateSession} rounded danger style={{ marginLeft: 10, marginRight: 10, }}>
                        <Text style={{ color: '#ffffff' }}>Cancel</Text>
                    </Button>
                    <Button onPress={this.retry} rounded success style={{ marginLeft: 10, marginRight: 10, }}>
                        <Text style={{ color: '#ffffff' }}>Retry</Text>
                    </Button>
                </View>
            );
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