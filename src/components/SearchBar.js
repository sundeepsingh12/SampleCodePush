import React, { Component } from 'react'
import renderIf from '../lib/renderIf'
import { StyleSheet, View } from 'react-native'
import {
    Header,
    Button,
    Text,
    Input,
    Body,
    Icon,
} from 'native-base';
import styles from '../themes/FeStyle'
import _ from 'underscore'

export default class SearchBar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isSearchVisible: (this.props.searchText.length > 2)
        }
    }

    _setSearchVisibility(isSearchVisible) {
        this.setState(previousState => {
            return {
                isSearchVisible
            }
        })
    }

    render() {
        return (
            <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
                <Body>
                    <View
                        style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.marginBottom10, styles.marginTop15]}>
                        <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]} onPress={() => { this.props.goBack() }} />
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
                                    this._setSearchVisibility(searchText.length > 2)
                                    this.props.setSearchText(searchText)
                                    this.props.fetchDataStoreAttrValueMap(searchText, false)
                                }}
                                value={this.props.searchText}
                                placeholderTextColor={'rgba(255,255,255,.4)'}
                                style={[style.headerSearch]} />
                            {renderIf(this.props.isScannerEnabled, <Button small transparent style={[style.headerQRButton]}>
                                <Icon name="md-qr-scanner" style={[styles.fontWhite, styles.fontXl]} />
                            </Button>)}
                        </View>
                        {renderIf(this.state.isSearchVisible, <View style={{ alignItems: 'center', justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }}>
                            <Text style={[styles.fontDefault, styles.fontWhite, styles.paddingTop10, styles.paddingBottom10]}
                                onPress={() => {
                                    this.props.fetchDataStoreAttrValueMap(this.props.searchText, true)
                                }}>Search</Text>
                        </View>)}
                    </View>
                </Body>
            </Header>
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
        color: '#ffffff',
        fontSize: 14
    },
    headerQRButton: {
        position: 'absolute',
        right: 5,
        paddingLeft: 0,
        paddingRight: 0
    },
});