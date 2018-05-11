import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Modal
} from 'react-native'
import Loader from '../components/Loader'
import {Content, Button, Input,StyleProvider,Item, Icon, Spinner } from 'native-base';
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import {
    ENTER_MOBILE,
    CLOSE,
    SEND_OTP
} from '../lib/ContainerConstants'

function mapStateToProps(state) {
  return {
    mobileOtpDisplayMessage:state.preloader.mobileOtpDisplayMessage,
    isGenerateMobileOtpButtonDisabled:state.preloader.isGenerateMobileOtpButtonDisabled,
    isMobileOtpScreenLogoutDisabled:state.preloader.isMobileOtpScreenLogoutDisabled,
    mobileNumber:state.preloader.mobileNumber,
    otpNumber: state.preloader.otpNumber,
  }
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({  ...preloaderActions }, dispatch)
  }
}

class MobileNoScreen extends PureComponent{

     getOtp = () => {
        this.props.actions.generateOtp(this.props.mobileNumber)
    }

     onChangeMobileNo = (value) => {
        this.props.actions.onChangeMobileNumber(value)
    }

    onChangeOtp = (value) => {
        this.props.actions.onChangeOtp(value)
    }


    validateOtp = () => {
        this.props.actions.validateOtp(this.props.otpNumber)
    }

    renderMobileNoView(){
        return (
        <View style={[styles.bgWhite, styles.alignCenter, styles.justifyCenter, styles.marginBottom30]}>
            <View style={[styles.marginTop30, {width: 150}]}>
                <Item floatingLabel>
                    <Input
                        placeholder='0000000000'
                        value={this.props.mobileNumber}
                        keyboardType={'numeric'}
                        returnKeyType={'done'}
                        onChangeText={this.onChangeMobileNo}
                        style={[styles.fontXxl]}
                    />
                </Item>
            </View>    
            <Text style={[styles.fontCenter, styles.fontDanger, styles.marginTop5, styles.marginBottom5]}>
                {this.props.mobileOtpDisplayMessage} 
            </Text>
            <View style={[styles.marginTop5, styles.marginBottom5, styles.justifyCenter, styles.alignCenter, {height: 40}]}>
                <Spinner color={styles.bgBlack.backgroundColor} size={'small'} />
            </View>
            <Button onPress={this.getOtp} full
                disabled={this.props.isGenerateOtpButtonDisabled}>
                <Text style={[styles.fontWhite]}>{SEND_OTP}</Text>
            </Button>
        </View>
        )
    }

    showOtpContent(){
        return (
            <Content style={[ styles.paddingTop0, styles.paddingLeft10]}>
            <View style={[ { top: 10, left: 0, height: 60, }]}>
                    <Icon
                        name="md-close"
                        style={[styles.fontXxxl, styles.fontBlack]}
                        onPress={this.props.isOtpScreenLogoutDisabled} />
                </View>
                <View style={[styles.bgWhite, styles.column, styles.justifyCenter, styles.alignCenter, styles.paddingTop30]}>
                    <View style={[styles.alignCenter, styles.column, styles.justifyCenter, {width: 240}]}>
                        <Text style={[feStyle.fontWeight500, feStyle.fontXxl, feStyle.fontBlack]}>{ENTER_OTP}</Text>
                        <Text style={[feStyle.fontDefault, feStyle.fontDarkGray, feStyle.marginTop10]}>{OTP_CODE_SENT}</Text>
                        <View style = {{flexDirection: 'row'}}>
                        <Text style={[feStyle.fontDefault, feStyle.fontDarkGray]}>2134</Text>
                        <Text style={[feStyle.fontDefault, styles.marginLeft5, feStyle.fontBlack]}>Edit</Text>
                        </View>
                    </View>
                    
                    {this.showOtpInputView()}
                </View>
            </Content>
        )
    }
    showOtpInputView(){
        return(
        <View style={[styles.bgWhite, styles.alignCenter, styles.justifyCenter, styles.marginBottom30]}>
            <View style={[styles.marginTop30, {width: 100}]}>
                <Item floatingLabel>
                    <Input
                    placeholder='000000'
                    value={this.props.otpNumber}
                    keyboardType='numeric'
                    returnKeyType='done'
                    onChangeText={this.onChangeOtp}
                    style={[styles.fontXxl]}
                />
                </Item>
            </View>    
            <Text style={[styles.fontCenter, styles.fontDanger, styles.marginTop5, styles.marginBottom5]}>
                {this.props.otpDisplayMessage} 
            </Text>
            <View style={[styles.marginTop5, styles.marginBottom5, styles.justifyCenter, styles.alignCenter, {height: 40}]}>
                <Spinner color={styles.bgBlack.backgroundColor} size={'small'} />
            </View>
            <Button onPress={this.validateOtp}  full
                    disabled={this.props.isGenerateMobileOtpButtonDisabled}>
                    <Text style={[styles.fontWhite]}>{VERIFY}</Text>
                </Button>
        </View>

        )
    }

    showMobileContent(){
        return(
            <Content style={[ styles.paddingTop0, styles.paddingLeft10]}>
                    <View style={[ { top: 10, left: 0, height: 60, }]}>
                            <Icon
                                name="md-close"
                                style={[styles.fontXxxl, styles.fontBlack]}
                                onPress={this.props.invalidateUserSession} />
                        </View>
                        <View style={[styles.bgWhite, styles.column, styles.justifyCenter, styles.alignCenter, styles.paddingTop30]}>
                            <View style={[styles.alignCenter, styles.column, styles.justifyCenter, {width: 280}]}>
                                <Text style={[styles.bold, styles.fontXxl, styles.fontBlack]}>{ENTER_MOBILE}</Text>
                                <Text style={[styles.marginTop10, styles.fontCenter, styles.fontDefault, styles.fontDarkGray]}>A One Time Password will be sent to this mobile number</Text>
                            </View>
                           {this.renderMobileNoView()}
                        </View>
                    </Content>
        )
    }

    render(){
        let showContent = this.props.isMobileScreen ? this.showMobileContent() : this.showOtpContent()
        return (
              <Modal
                animationType={"slide"}
                transparent={false}
                onRequestClose={() => null}>
                <StyleProvider style={getTheme(platform)}> 
                    {showContent}
                </StyleProvider>
            </Modal>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileNoScreen)