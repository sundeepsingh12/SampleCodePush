import React, { PureComponent } from 'react'
import { StyleSheet, View, SafeAreaView } from 'react-native'
import { Header, Button, Text, Input, Body, Icon, } from 'native-base';
import styles from '../themes/FeStyle'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import _ from 'lodash'
import { SEARCH } from '../lib/ContainerConstants'
export default class SearchBar extends PureComponent {

    _startScanner() {
        if (this.props.isScannerEnabled) {
            return <Button small transparent
                style={[style.headerQRButton]}
                onPress={() => this.props.scanner()}
                autoFocus={this.props.isAutoStartScannerEnabled} >
                <MaterialCommunityIcons name='qrcode' style={[styles.fontXxl, styles.padding5]} color={styles.fontBlack.color} />
            </Button>
        }
    }

    callDataStoreSearchMethods(searchText) {
        if (!this.props.isFiltersPresent) {
            this.props.setSearchText(searchText)
            this.props.fetchDataStoreAttrValueMap(searchText, false)
        } else {
            this.props.searchDataStoreAttributeValueMap(searchText)
        }
    }

    render() {
        let scanner = this._startScanner()
        return (
            <SafeAreaView style={[{ backgroundColor: styles.bgPrimaryColor }]}>
                <Header searchBar style={StyleSheet.flatten([{ backgroundColor: styles.bgPrimaryColor }, style.header])}>
                    <Body>
                        <View
                            style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.marginBottom10, styles.marginTop15]}>
                            <Icon name="md-arrow-back" style={[styles.fontWhite, styles.paddingRight10, styles.paddingLeft10, styles.fontXxl]} onPress={() => { this.props.goBack() }} />
                            <Text
                                style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.title}</Text>
                            <View />
                        </View>
                        <View style={[styles.row,]}>
                            <View
                                style={[styles.row, styles.flex1, styles.justifySpaceBetween, styles.relative]}>
                                <Input
                                    placeholder={'Search'}
                                    onChangeText={(searchText) => {
                                        this.callDataStoreSearchMethods(searchText)
                                    }}
                                    keyboardAppearance={"dark"}
                                    value={this.props.searchText}
                                    style={[style.headerSearch, styles.bgGray]} />
                                {scanner}
                            </View>
                            {(_.size(this.props.searchText) > 2 && !this.props.isFiltersPresent) &&
                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }}>
                                    <Text style={[styles.fontDefault, styles.fontWhite, styles.paddingTop10, styles.paddingBottom10]}
                                        onPress={() => {
                                            this.props.fetchDataStoreAttrValueMap(this.props.searchText, true)
                                        }}>{SEARCH}</Text>
                                </View>}
                        </View>
                    </Body>
                </Header>
            </SafeAreaView>
        )
    }
}
const style = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        height: 'auto',
        paddingTop: 10,
        paddingBottom: 10
    },
    headerSearch: {
        paddingLeft: 10,
        paddingRight: 30,
        backgroundColor: '#1260be',
        borderRadius: 2,
        height: 40,
        fontSize: 14
    },
    headerQRButton: {
        position: 'absolute',
        right: 5,
        paddingLeft: 0,
        paddingRight: 0
    },
});