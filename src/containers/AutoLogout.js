'use strict'
import React, {PureComponent} from 'react';
import Loader from '../components/Loader'
import
{
    StyleSheet,
    View,
    Text
}
    from 'react-native'
class AutoLogout extends PureComponent {


    render() { 
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
export default AutoLogout