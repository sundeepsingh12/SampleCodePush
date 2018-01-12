'use strict'
import React, {PureComponent} from 'react';
import Loader from '../components/Loader'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as autoLogoutActions from '../modules/autoLogout/autoLogoutAction'
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import
{
    StyleSheet,
    View,
    Text,
    Alert
}
    from 'react-native'
    function mapStateToProps(state) {
        return {
        isLoaderRunning:state.autoLogout.isLoaderRunning,
        }
    }
    function mapDispatchToProps(dispatch) {
        return {
        actions: bindActionCreators({...autoLogoutActions, ...preloaderActions}, dispatch)
        }
    }
class AutoLogout extends PureComponent {
    componentDidMount(){
             this.props.actions.setAutoLogout()
    }
    _onGoToNextStatus(){
        this.props.actions.invalidateUserSessionForAutoLogout()
    }
    // _onGoToHomeScreen(){
    //     this.props.actions.nani
    // }
    customAlert(){
        Alert.alert(
            'Confirm_Logout',
            'unsynced task present,do you want to logout',
            [
              { text: 'cancel', onPress: () => this.props.navigation.goBack(null)  },
              { text: 'Ok', onPress: () => this._onGoToNextStatus() }
            ],
          )
    }
    render() { 
        // if(this.props.isLoaderRunning){
        //     this.customAlert()
        //     return null
        // }
        return (
            <View>
            <View style={styles.container}>
                <Text style={styles.summary}>Auto Logout...</Text>
            </View>
            <Loader/>
            </View>
        )
}

}
var styles = StyleSheet.create({
    container: {
        borderTopWidth: 2,
        borderBottomWidth: 2,
        marginTop: 80,
        padding: 10
    },
    summary: {
        fontSize: 18,
        fontWeight: 'bold'
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(AutoLogout)