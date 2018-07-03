/**
 * This class contains stack for Home Tab on Home Screen
 */

import { createStackNavigator } from 'react-navigation'

import Home from '../../containers/Home'
import TabScreen from '../../containers/TabScreen'
import JobDetailsV2 from '../../containers/JobDetailsV2'
import FormLayout from '../../containers/FormLayout'
import ArrayFieldAttribute from '../../containers/ArrayFieldAttribute'
import DataStore from '../../containers/DataStore'
import SaveActivated from '../../containers/SaveActivated'
import Transient from '../../containers/Transient'
import CheckoutDetails from '../../containers/CheckoutDetails'
import SignatureAndNps from '../../containers/SignatureAndNps'
import BulkListing from '../../containers/BulkListing'
import CashTendering from '../../containers/CashTendering'
import LiveJob from '../../containers/LiveJob'
import LiveJobListing from '../../containers/LiveJobListing'
import PostAssignmentScanner from '../../containers/PostAssignmentScanner'
import DataStoreDetails from '../../containers/DataStoreDetails'
import SplitPayment from '../../containers/SplitPayment'
import SequenceRunsheetList from '../../containers/SequenceRunsheetList'
import Sequence from '../../containers/Sequence'
import CameraFieldAttribute from '../../containers/CameraFieldAttribute'
import ImageDetailsView from '../../containers/ImageDetailsView'
import CustomApp from '../../containers/CustomApp'
import FixedSKUListing from '../../containers/FixedSKUListing'
import Sorting from '../../containers/Sorting'
import Signature from '../../containers/Signature'
import SkuListing from '../../containers/SkuListing'
import Summary from '../../containers/Summary'
import Payment from '../../containers/Payment'
import UPIPayment from '../../containers/UPIPayment'
import PayByLink from '../../containers/PayByLink'
import MosambeeWalletPayment from '../../containers/MosambeeWalletPayment'
import QrCodeScanner from '../../containers/QrCodeScanner'

const HomeStack = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions:{
            header:null
        }
    },
    TabScreen: {
        screen: TabScreen,
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
      SaveActivated: {
        screen: SaveActivated,
      },
      Transient: {
        screen: Transient,
      },
      CheckoutDetails: {
        screen: CheckoutDetails,
      },
      SignatureAndNps: {
        screen: SignatureAndNps
      },
      BulkListing: {
        screen: BulkListing,
      },
      CashTendering: {
        screen: CashTendering,
        navigationOptions: {
          header: null
        }
      },
      LiveJobs: {
        screen: LiveJobListing
      },
      LiveJob: {
        screen: LiveJob
      },
      PostAssignmentScanner: {
        screen: PostAssignmentScanner
      },
      DataStoreDetails: {
        screen: DataStoreDetails
      },
      SplitPayment: {
        screen: SplitPayment,
      },
      SequenceRunsheetList: {
        screen: SequenceRunsheetList
      },
      Sequence: {
        screen: Sequence,
      },
      CameraAttribute: {
        screen: CameraFieldAttribute,
      },
      ImageDetailsView: {
        screen: ImageDetailsView,
      },
      CustomApp: {
        screen: CustomApp
      },
      FixedSKUListing: {
        screen: FixedSKUListing,
        navigationOptions: {
          header: null
        }
      },
      Sorting: {
        screen: Sorting,
        navigationOptions: {
          title: 'Sorting',
          header: null,
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
      Summary: {
        screen: Summary,
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
      MosamBeeWalletPayment:{
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
})

export default HomeStack