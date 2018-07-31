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
import JobDetailsV2 from '../../containers/JobDetailsV2'
import FormLayout from '../../containers/FormLayout'
import ArrayFieldAttribute from '../../containers/ArrayFieldAttribute'
import DataStore from '../../containers/DataStore'
import Transient from '../../containers/Transient'
import SignatureAndNps from '../../containers/SignatureAndNps'
import CashTendering from '../../containers/CashTendering'
import DataStoreDetails from '../../containers/DataStoreDetails'
import SplitPayment from '../../containers/SplitPayment'
import CameraFieldAttribute from '../../containers/CameraFieldAttribute'
import ImageDetailsView from '../../containers/ImageDetailsView'
import FixedSKUListing from '../../containers/FixedSKUListing'
import Signature from '../../containers/Signature'
import SkuListing from '../../containers/SkuListing'
import Payment from '../../containers/Payment'
import UPIPayment from '../../containers/UPIPayment'
import PayByLink from '../../containers/PayByLink'
import MosambeeWalletPayment from '../../containers/MosambeeWalletPayment'
import QrCodeScanner from '../../containers/QrCodeScanner'
import MessageBox from '../../containers/MessageBox'
import LiveJobListing from '../../containers/LiveJobListing'
import LiveJob from '../../containers/LiveJob'

const MenuStack = createStackNavigator({
    MenuScreen: {
        screen: Menu,
        navigationOptions: {
            header: null
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
    MessageBox: {
        screen: MessageBox,
    },
    JobDetailsV2: {
        screen: JobDetailsV2,
    },
    FormLayout: {
        screen: FormLayout,
    },
    ArrayFieldAttribute: {
        screen: ArrayFieldAttribute
    },
    DataStore: {
        screen: DataStore,
    },
    Transient: {
        screen: Transient,
        navigationOptions: {
            gesturesEnabled: false,
        }
    },
    SignatureAndNps: {
        screen: SignatureAndNps
    },
    CashTendering: {
        screen: CashTendering,
        navigationOptions: {
            header: null
        }
    },

    DataStoreDetails: {
        screen: DataStoreDetails
    },
    SplitPayment: {
        screen: SplitPayment,
    },
    CameraAttribute: {
        screen: CameraFieldAttribute,
    },
    ImageDetailsView: {
        screen: ImageDetailsView,
    },

    FixedSKUListing: {
        screen: FixedSKUListing,
        navigationOptions: {
            header: null
        }
    },

    Signature: {
        screen: Signature,
        navigationOptions: {
            header: null
        }
    },
    SkuListing: {
        screen: SkuListing,
        navigationOptions: {
            title: 'SKU Listing',
        }
    },
    Payment: {
        screen: Payment
    },
    UPIPayment: {
        screen: UPIPayment
    },
    PayByLink: {
        screen: PayByLink
    },
    MosamBeeWalletPayment: {
        screen: MosambeeWalletPayment,
        navigationOptions: {
            header: null
        }
    },
    QrCodeScanner: {
        screen: QrCodeScanner,
        navigationOptions: {
            title: 'Scanner',
            header: null,
        }
    },
    LiveJobs: {
        screen: LiveJobListing,
        path: 'liveJobListing'
    },
    LiveJob: {
        screen: LiveJob
    },
})

export default MenuStack