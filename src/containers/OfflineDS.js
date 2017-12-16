'use strict'
import React, { Component } from 'react'
import * as offlineDSActions from '../modules/offlineDS/offlineDSActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SearchBar from '../components/SearchBar'
import * as globalActions from '../modules/global/globalActions'
import renderIf from '../lib/renderIf'
import Loader from '../components/Loader'
import DataStoreItemDetails from '../components/DataStoreItemDetails'
import { StyleSheet, View, TouchableOpacity, FlatList, Image, Text } from 'react-native'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import {
    SET_DATA_STORE_ATTR_MAP,
    SET_SEARCH_TEXT,
    SHOW_DETAILS,
    _id,
    SET_INITIAL_STATE,
    QrCodeScanner,
    DISABLE_AUTO_START_SCANNER,
} from '../lib/constants'
import {
    Container,
    Content,
    Header,
    Button,
    Body,
    Right,
    Icon,
    List,
    ListItem,
    StyleProvider,
    Footer,
    FooterTab
} from 'native-base'
import {
    EXTERNAL_DATA_STORE,
} from '../lib/AttributeConstants'
import _ from 'lodash'


function mapStateToProps(state) {
    return {
        progressBarMaxRange: state.offlineDS.progressBarMaxRange,
        progressBarMinRange: state.offlineDS.progressBarMinRange,
        isDownLoadingDS: state.offlineDS.isDownLoadingDS,
        isDownLoadSuccessful: state.offlineDS.isDownLoadSuccessful
    }
};

/*
 * Bind all the actions
 */
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...offlineDSActions }, dispatch)
    }
}

class OfflineDS extends Component {

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    componentDidMount() {

    }

    initialScreen() {
        return
        <Container>
            <Header style={[styles.bgPrimary, style.header]}>
                <Body>
                    <View
                        style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                        <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.navigation.goBack() }}>
                            <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                        </TouchableOpacity>
                        <View style={[style.headerBody]}>
                            <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>Offline DataStore</Text>
                        </View>
                        <View style={[style.headerRight]}>
                        </View>
                    </View>
                </Body>
            </Header>

            <View style={[styles.flex1, styles.primaryColor]}>

                <View style={[styles.flex1, styles.justifySpaceBetween]}>
                    <View style={[styles.alignCenter, styles.justifyCenter, styles.flexBasis50]}>
                        <Image
                            style={[style.imageSync]}
                            source={require('../../images/fareye-default-iconset/syncscreen/All_Done.png')}
                        />
                    </View>
                    <View style={[styles.flexBasis40, styles.alignCenter, styles.justifyCenter]}>
                        <Text style={[styles.fontDarkGray]}>
                            Last synced 20 hours ago
                         </Text>
                        <View style={[styles.marginTop30, styles.alignCenter]}>
                            <Button style={[styles.bgPrimary]}
                                onPress={() => {
                                    this.props.actions.syncDataStore()
                                }}
                            >
                                <Text style={[styles.fontWhite]}>Sync Datastore</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        </Container>
    }

    render() {

        let initialScreen = this.initialScreen()
        return (
            <StyleProvider style={getTheme(platform)}>
                {initialScreen}
                {/* <View style={[styles.flex1, styles.justifySpaceBetween]}>
                            <View style={[styles.justifyCenter, styles.flexBasis100, styles.padding10]}>
                                <View style={[styles.row, styles.justifySpaceBetween, styles.marginBottom10]}>
                                    <Text style={[styles.fontDarkGray]}>
                                        Downloading Phone Book...
                                    </Text>
                                    <Text style={[styles.fontDarkGray]}>
                                        80%
                                    </Text>
                                </View>
                                <View style={{width: '100%', borderRadius: 8, height: 10, backgroundColor: styles.bgGray.backgroundColor}}>
                                    <View style={{width: '60%', borderRadius: 8, height: 10, backgroundColor: styles.bgPrimary.backgroundColor}}>
                                    </View>
                                </View>
                            </View>
                            
                        </View> */}

                {/* <View style={[styles.flex1, styles.justifySpaceBetween]}>
                            <View style={[styles.alignCenter, styles.justifyCenter, styles.flexBasis50]}>
                                <Image
                                    style={[style.imageSync]}
                                    source={require('../../images/fareye-default-iconset/syncscreen/All_Done.png')}
                                />
                                <Text style={[styles.fontDarkGray, styles.marginTop30]}>
                                    Download Successful
                                </Text>
                            </View>
                            <View style={[styles.flexBasis40, styles.alignCenter, styles.justifyCenter]}>
                                
                                <View style={[styles.marginTop30, styles.alignCenter]}>
                                    <Button bordered style={{borderColor: styles.bgPrimary.backgroundColor}}>
                                        <Text style={[styles.fontPrimary]}>Close</Text>
                                    </Button>
                                </View>
                            </View>
                        </View> */}

            </StyleProvider>)
    }
}

const style = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        height: 'auto',
        padding: 0,
        paddingRight: 0,
        paddingLeft: 0
    },
    headerLeft: {
        width: '15%',
        padding: 15
    },
    headerBody: {
        width: '70%',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10
    },
    headerRight: {
        width: '15%',
        padding: 15
    },
    imageSync: {
        width: 116,
        height: 116,
        resizeMode: 'contain'
    }
});

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(OfflineDS)
