'use strict'

import React, { PureComponent } from 'react'
import { Platform, BackHandler, View } from 'react-native'
import { Icon } from 'native-base'
import { connect } from 'react-redux'
import { createBottomTabNavigator,createStackNavigator } from 'react-navigation'
import SyncScreen from './SyncScreen'
import ErpSyncScreen from './ErpSyncScreen'
import Home from './Home'
import Menu from './Menu'
import styles from '../themes/FeStyle'
import * as homeActions from '../modules/home/homeActions'
import ErpSyncTabIcon from '../svg_components/icons/ErpSyncTabIcon'
import TabScreen from './TabScreen'
import Payment from './Payment'
import UPIPayment from './UPIPayment'
import PayByLink from './PayByLink'
import FixedSKUListing from './FixedSKUListing'
import Signature from './Signature'
import FormLayout from './FormLayout'
import SkuListing from './SkuListing'
import ArrayFieldAttribute from './ArrayFieldAttribute'
import SignatureAndNps from './SignatureAndNps'
import SaveActivated from './SaveActivated'
import Transient from './Transient'
import CheckoutDetails from './CheckoutDetails'
import CashTendering from './CashTendering'
import Statistics from './Statistics'
import Sorting from './Sorting'
import DataStoreDetails from './DataStoreDetails'
import OfflineDS from './OfflineDS'
import ImageDetailsView from './ImageDetailsView'
import { NavigationActions } from 'react-navigation'
import PostAssignmentScanner from './PostAssignmentScanner'
import AutoLogout from './AutoLogout'
import Backup from './Backup'
import UnsyncBackupUpload from './UnsyncBackupUpload'
import ProfileView from './ProfileView'
import BluetoothListing from './BluetoothListing'
import SequenceRunsheetList from './SequenceRunsheetList'
import Sequence from './Sequence'
import ResetPassword from './ResetPassword'
import JobDetailsV2 from './JobDetailsV2'
import DataStore from './DataStore'
import BulkListing from './BulkListing'
import LiveJobListing from './LiveJobListing'
import CustomApp from './CustomApp'
import Summary from './Summary'
import LiveJob from './LiveJob'
import MosambeeWalletPayment from './MosambeeWalletPayment'
import SplitPayment from './SplitPayment'
import CameraFieldAttribute from './CameraFieldAttribute'
import QrCodeScanner from './QrCodeScanner'


function mapStateToProps(state) {
    return {
        customErpPullActivated: state.home.customErpPullActivated,
    }
}

class HomeTabNavigator extends PureComponent {

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    componentDidMount() {
        this.props.checkCustomErpPullActivated()
    }

    render() {
        if (!this.props.customErpPullActivated) {
            return null
        }

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
        }, 
        )
        MenuStack.navigationOptions = ({ navigation }) => {
            let tabBarVisible = true;
            if (navigation.state.index > 0) {
              tabBarVisible = false;
            }
            return {
              tabBarVisible,
            };
          };

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
                header: null
            },
            FormLayout: {
                screen: FormLayout,
                navigationOptions: {
                  header: null
                }
              },
              ArrayFieldAttribute: {
                screen: ArrayFieldAttribute
              },
              DataStore: {
                screen: DataStore,
              },
              SaveActivated: {
                screen: SaveActivated,
                navigationOptions: {
                  gesturesEnabled: false,
                }
              },
              Transient: {
                screen: Transient,
                navigationOptions: {
                  gesturesEnabled: false,
                }
              },
              CheckoutDetails: {
                screen: CheckoutDetails,
                navigationOptions: {
                  gesturesEnabled: false,
                }
              },
              SignatureAndNps: {
                screen: SignatureAndNps
              },
              BulkListing: {
                screen: BulkListing,
                navigationOptions:{
                    tabBarVisible: false,
                    showTabBar: false,
                }
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

        HomeStack.navigationOptions = ({ navigation }) => {
            let tabBarVisible = true;
            if (navigation.state.index > 0) {
              tabBarVisible = false;
            }
            return {
              tabBarVisible,
            };
          };
        const Tabs = {
            Home:{
                screen:HomeStack,
                navigationOptions:{ 
                    header:null,
                    tabBarIcon: ({ tintColor }) => (
                    <Icon
                        name='ios-home'
                        style={[{ fontSize: 18, marginTop: (Platform.OS == 'ios') ? 5 : 0, color: tintColor }]}
                    />
                ),
            }
            },
            SyncScreen: {
                screen: SyncScreen,
                navigationOptions: {
                    header: null,
                    title: 'Sync',
                    gesturesEnabled: false,
                    tabBarIcon: ({ tintColor }) => (
                        <Icon
                            name='ios-sync'
                            style={[{ fontSize: 18, marginTop: (Platform.OS == 'ios') ? 5 : 0, color: tintColor }]}
                        />
                    ),
                }
            },
            ErpSyncScreen: {
                screen: ErpSyncScreen,
                navigationOptions: {
                    header: null,
                    title: 'ERP',
                    gesturesEnabled: false,
                    tabBarIcon: ({ tintColor }) => (
                        <View
                            style={[styles.alignSelfCenter, styles.marginLeft5, { height: 30, marginTop: 15 }]}>
                            <ErpSyncTabIcon width={50} height={50} color={tintColor} />
                        </View>
                    ),
                }
            },
            Menu:{
                screen:MenuStack,
                navigationOptions:{ 
                    header:null,
                    tabBarIcon: ({ tintColor }) => (
                    <Icon
                        name='md-menu'
                        style={[{ fontSize: 18, marginTop: (Platform.OS == 'ios') ? 5 : 0, color: tintColor }]}
                    />
                ),
            }
            }
        }
        const tabStyle = {
            tabBarPosition: 'bottom',
            initialRouteName: 'Home',
            animationEnabled: true,
            tabBarOptions: {
                showIcon: true,
                activeTintColor: styles.bgPrimaryColor,
                inactiveTintColor: '#aaaaaa',
                style: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#f3f3f3',
                },
                labelStyle: {
                    fontSize: 12,
                    marginTop: 0,
                    fontWeight: '600'

                },
                tabStyle: {
                    alignItems: 'center',
                    height: 50,
                    paddingTop: 10,
                    paddingBottom: 5
                },
                indicatorStyle: {
                    height: 0
                }

            }
        }
        var HomeTabNavigatorOptions = null
        if (this.props.customErpPullActivated == 'activated') {
            HomeTabNavigatorOptions = createBottomTabNavigator({
                Home: Tabs.Home,
                SyncScreen: Tabs.SyncScreen,
                ErpSyncScreen: Tabs.ErpSyncScreen,
                Menu: Tabs.Menu
            },
                tabStyle,
            );
        } else {
            HomeTabNavigatorOptions = createBottomTabNavigator({
                Home:Tabs.Home,
                SyncScreen: Tabs.SyncScreen,
                Menu: Tabs.Menu,
            },
                tabStyle
            );
        }
        return (
            <HomeTabNavigatorOptions />
        )
    }
}

export default connect(mapStateToProps, homeActions)(HomeTabNavigator)