import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Modal
} from 'react-native'
import { Button, Input } from 'native-base';
import feStyle from '../themes/FeStyle'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as preloaderActions from '../modules/pre-loader/preloaderActions'

function mapStateToProps(state) {
  return {
    mobileDisplayMessage:state.preloader.mobileDisplayMessage,
    isGenerateOtpButtonDisabled:state.preloader.isGenerateOtpButtonDisabled,
    isMobileScreenLogoutDisabled:state.preloader.isMobileScreenLogoutDisabled,
    mobileNumber:state.preloader.mobileNumber
  }
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({  ...preloaderActions }, dispatch)
  }
}

class MobileNoScreen extends Component{

     getOtp = () => {
        this.props.actions.generateOtp(this.props.mobileNumber)
    }

     onChangeMobileNo = (value) => {
        this.props.actions.onChangeMobileNumber(value)
    }

     invalidateSession = () => {
        this.props.actions.invalidateUserSession()
    }
    
    render(){
        return (
              <Modal
                        animationType={"slide"}
                        transparent={false}
                        onRequestClose={() => null}>
                        <View style={[feStyle.bgWhite, feStyle.flex1, feStyle.column, { paddingTop: 70 }]}>
                            <View style={[feStyle.alignCenter, feStyle.column]}>
                                <Text style={[feStyle.fontWeight500, feStyle.fontXxl, feStyle.fontBlack]}>Enter your mobile</Text>
                            </View>
                            <View style={[feStyle.alignCenter, feStyle.row, feStyle.margin30]}>
                                <View style={[feStyle.flex1, { height: 50 }]}>
                                    <Input
                                        placeholder='Mobile Number'
                                        value={this.props.mobileNumber}
                                        keyboardType='numeric'
                                        onChangeText={this.onChangeMobileNo}
                                    />
                                </View>
                            </View>
                            <Text style={{ textAlign: 'center', color: '#333333', marginBottom: 10 }}>
                                {this.props.mobileDisplayMessage}
                            </Text>
                            <View style={[feStyle.row, feStyle.justifyCenter, feStyle.marginTop30]}>
                                <Button onPress={this.getOtp} full rounded
                                    style={StyleSheet.flatten(feStyle.margin10)}
                                    disabled={this.props.isGenerateOtpButtonDisabled}>
                                    <Text style={[feStyle.fontWhite]}>Send OTP</Text>
                                </Button>
                                <Button onPress={this.invalidateSession} full rounded danger
                                    disabled={this.props.isMobileScreenLogoutDisabled}
                                    style={StyleSheet.flatten(feStyle.margin10, feStyle.bgDanger)}>
                                    <Text style={[feStyle.fontWhite]}>Close</Text>
                                </Button>
                            </View>

                        </View>
                    </Modal>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#f7f7f7'
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(MobileNoScreen)