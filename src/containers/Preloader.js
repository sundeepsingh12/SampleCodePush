'use strict'
import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    Image,
    Modal
}
    from 'react-native'
import feStyle from '../themes/FeStyle'
import feTheme from  '../themes/feTheme'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Container, Content, Button, List, ListItem, Thumbnail, Body, Left, Right, Badge, Spinner, Input} from 'native-base';
import {Actions} from 'react-native-router-flux'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import ServiceStatusIcon from "../components/ServiceStatusIcon"
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import renderIf from '../lib/renderIf';

const {
    SERVICE_PENDING,
    SERVICE_RUNNING,
    SERVICE_SUCCESS,
    SERVICE_FAILED
} = require('../lib/constants').default

function mapStateToProps(state) {
    return {
        preloader: state.preloader
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...preloaderActions}, dispatch)
    }
}

class Preloader extends Component {

    componentDidMount() {
        this.props.actions.saveSettingsAndValidateDevice(this.props.preloader.configDownloadService, this.props.preloader.configSaveService, this.props.preloader.deviceVerificationService)
    }

    _renderErrorMessage() {
        if (this.props.preloader.isError) {
            return (
                <Text
                    style={[feStyle.row, feStyle.justifyCenter, feStyle.fontDanger, feStyle.marginBottom20]}>{this.props.preloader.error}</Text>
            );
        } else {
            return null;
        }
    }

    _renderButtons() {
        if (this.props.preloader.isError) {
            return (
                <View style={feStyle.row}>
                    <Button onPress={() => this.invalidateSession() } rounded danger style={{margin: 10}}>
                        <Text style={{color: '#ffffff'}}>Cancel</Text>
                    </Button>
                    <Button onPress={() => this.retry()} rounded success style={{margin: 10}}>
                        <Text style={{color: '#ffffff'}}>Retry</Text>
                    </Button>
                </View>
            );
        }
    }

    invalidateSession() {
        this.props.actions.invalidateUserSession()
    }

    retry() {
        this.props.actions.retryPreloader(this.props.preloader.configDownloadService, this.props.preloader.configSaveService, this.props.preloader.deviceVerificationService)
    }

    generateOtp(){
        this.props.actions.setMobileNo(this.props.preloader.mobileNumber)
    }

    render() {
        return (
            <Container>
                {renderIf(!this.props.preloader.showMobileNumberScreen,
                    <View style={styles.issueWrapper}>
                        <View style={[feStyle.column, feStyle.flexBasis40, feStyle.alignCenter, feStyle.flex1]}>
                            <View>
                                <Image
                                    style={styles.logoStyle}
                                    source={require('../../images/preloader.png')}
                                />
                            </View>

                            <Text
                                style={[feStyle.fontBlack, feStyle.fontXxxl, feStyle.fontWeight200, feStyle.marginTop30]}>
                                Setting you up !
                            </Text>
                        </View>
                        <View style={[feStyle.column, feStyle.flexBasis40, feStyle.flex1, feStyle.justifyCenter]}>
                            <List>
                                <ListItem style={{height: 60}}>
                                    <Left style={{flex: 1}}>
                                        <Ionicons name="ios-globe-outline" style={styles.listIcons}/>
                                        <Text style={[feStyle.fontDarkGray, feStyle.marginTop5]}>Downloading
                                            settings</Text>
                                    </Left>
                                    <Right style={{flex: 0.5}}>
                                        <ServiceStatusIcon status={this.props.preloader.configDownloadService}/>
                                    </Right>
                                </ListItem>
                                <ListItem style={{height: 60}}>
                                    <Left style={{flex: 1}}>
                                        <Ionicons name="ios-globe-outline" style={styles.listIcons}/>
                                        <Text style={[feStyle.fontDarkGray, feStyle.marginTop5]}>Applying
                                            settings</Text>
                                    </Left>
                                    <Right style={{flex: 0.5}}>
                                        <ServiceStatusIcon status={this.props.preloader.configSaveService}/>
                                    </Right>
                                </ListItem>
                                <ListItem style={{height: 60}}>
                                    <Left style={{flex: 1}}>
                                        <Ionicons name="ios-globe-outline" style={styles.listIcons}/>
                                        <Text style={[feStyle.fontDarkGray, feStyle.marginTop5]}>Verifying
                                            handset</Text>
                                    </Left>
                                    <Right style={{flex: 0.5}}>
                                        <ServiceStatusIcon status={this.props.preloader.deviceVerificationService}/>
                                    </Right>
                                </ListItem>
                            </List>
                        </View>
                        <View
                            style={[feStyle.flexBasis25, feStyle.marginTop30, feStyle.flex1, feStyle.row, feStyle.justifyCenter]}>
                            {this._renderErrorMessage()}
                            {this._renderButtons()}
                        </View>
                    </View>)}

                {renderIf(this.props.preloader.showMobileNumberScreen,
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    onRequestClose={() => {
                        alert("Modal has been closed.")
                    }}
                >
                    <View style={[feStyle.bgWhite, feStyle.flex1, feStyle.column, {paddingTop: 70}]}>
                        <View style={[feStyle.alignCenter, feStyle.column]}>
                            <Text style={[feStyle.fontWeight500, feStyle.fontXxl]}>Enter your mobile</Text>
                        </View>
                        <View style={[feStyle.alignCenter, feStyle.row, feStyle.margin30]}>
                            <View style={[feStyle.flex1, {height: 50}]}>
                                <Input
                                    placeholder='Mobile Number'
                                    style={feTheme.roundedInput}
                                    value={this.props.preloader.mobileNumber}
                                />
                            </View>
                        </View>
                        <View style={[feStyle.row, feStyle.justifyCenter, feStyle.marginTop30]}>
                            <Button onPress={() => this.generateOtp()}  full rounded>
                                <Text style={[feStyle.fontWhite]}>Verify</Text>
                            </Button>
                        </View>

                    </View>
                </Modal>)}

               {renderIf(this.props.preloader.showOtpScreen,
                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        onRequestClose={() => {
                            alert("Modal has been closed.")
                        }}
                    >
                        <View style={[feStyle.bgWhite, feStyle.flex1, feStyle.column, {paddingTop: 70}]}>
                            <View style={[feStyle.alignCenter, feStyle.column]}>
                                <Text style={[feStyle.fontWeight500, feStyle.fontXxl]}>Verify your mobile</Text>
                                <Text style={[feStyle.fontSm, feStyle.fontDarkGray, feStyle.marginTop10]}>OTP code has
                                    been sent to</Text>
                                <Text style={[feStyle.fontXl, feStyle.fontPrimary, feStyle.marginTop10]}>+91
                                    9899509194</Text>
                            </View>
                            <View style={[feStyle.alignCenter, feStyle.row, feStyle.margin30]}>
                                <View style={styles.optInputBg}>
                                    <Input placeholder='-'
                                           style={StyleSheet.flatten(feStyle.fontCenter, feStyle.bold, feStyle.fontPrimary)}/>
                                </View>
                                <View style={styles.optInputBg}>
                                    <Input placeholder='-'
                                           style={StyleSheet.flatten(feStyle.fontCenter, feStyle.bold, feStyle.fontPrimary)}/>
                                </View>
                                <View style={styles.optInputBg}>
                                    <Input placeholder='-'
                                           style={StyleSheet.flatten(feStyle.fontCenter, feStyle.bold, feStyle.fontPrimary)}/>
                                </View>
                                <View style={styles.optInputBg}>
                                    <Input placeholder='-'
                                           style={StyleSheet.flatten(feStyle.fontCenter, feStyle.bold, feStyle.fontPrimary)}/>
                                </View>
                            </View>
                            <View style={[feStyle.row, feStyle.justifyCenter, feStyle.marginTop30]}>
                                <Button full rounded>
                                    <Text style={[feStyle.fontWhite]}>Verify</Text>
                                </Button>
                            </View>

                        </View>
                    </Modal>)}
            </Container>
        )
    }
}
;

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
        paddingTop: 80,
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
    },
    optInputBg: {
        flexGrow: 1,
        height: 50,
        borderBottomWidth: 2,
        borderBottomColor: '#006bff',
        marginLeft: 4,
        marginRight: 4
    }

})

export default connect(mapStateToProps, mapDispatchToProps)(Preloader)
