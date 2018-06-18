/**
 * This class contains stack for Menu Tab on Home Screen
 */

import { createStackNavigator } from 'react-navigation'

import Menu from '../../containers/Menu'
import Backup from '../../containers/Backup'
import OfflineDS from '../../containers/OfflineDS'
import ProfileView from '../../containers/ProfileView'
import BluetoothListing from '../../containers/BluetoothListing'
import ResetPassword from '../../containers/ResetPassword'
import Statistics from '../../containers/Statistics'

 const MenuStack = createStackNavigator({
    MenuScreen: {
        screen: Menu,
        navigationOptions:{
            header:null
        }
    },
    Backup: {
        screen: Backup,
    },
    OfflineDS: {
        screen: OfflineDS
    },
    ProfileView: {
        screen: ProfileView
    },
    BluetoothListing: {
        screen: BluetoothListing
    },
    ResetPassword: {
        screen: ResetPassword
    },
    Statistics: {
        screen: Statistics,
        navigationOptions: {
            header: null,
        }
    },
})

export default MenuStack