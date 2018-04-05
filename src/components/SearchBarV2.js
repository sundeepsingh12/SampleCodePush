import React, { PureComponent } from 'react'
import renderIf from '../lib/renderIf'
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native'
import {
    Button,
    Input,
    Icon,
} from 'native-base';
import styles from '../themes/FeStyle'
import { QrCodeScanner } from '../lib/constants'
import QRIcon from '../svg_components/icons/QRIcon'
import _ from 'lodash'

export default class SearchBarV2 extends PureComponent {
    _setQrValue = (value) => {
        this.props.returnValue(_.trim(value))
    }
    onPress = () => {
        this.props.onPress()
    }
    render() {
        return (
            <View style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.paddingLeft10, styles.paddingRight10]}>
                <View style={[styles.relative, { width: '85%', height: 30 }]}>
                    <TextInput
                        placeholder={this.props.placeholder}
                        placeholderTextColor={'rgba(255,255,255,.6)'}
                        selectionColor={'rgba(224, 224, 224,.5)'}
                        style={[style.headerSearch]}
                        returnKeyType={"search"}
                        keyboardAppearance={"dark"}
                        underlineColorAndroid={'transparent'}
                        onChangeText={(searchText) => {
                            this.props.setSearchText(searchText)
                        }}
                        onEndEditing={this.onPress}
                        value={this.props.searchText} />
                    <Button small transparent style={[style.inputInnerBtn]} onPress={this.onPress}>
                        <Icon name="md-search" style={[styles.fontWhite, styles.fontXl]} />
                    </Button>
                </View>
                <TouchableOpacity style={[{ width: '15%' }, styles.marginLeft15]} onPress={() => this.props.navigation.navigate(QrCodeScanner, { returnData: this._setQrValue.bind(this) })} >
                    <QRIcon width={30} height={30} color={styles.fontWhite} />
                </TouchableOpacity>
            </View>
        )
    }
}
const style = StyleSheet.create({
    headerSearch: {
        paddingLeft: 10,
        paddingRight: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.20)',
        borderRadius: 2,
        paddingTop: 0,
        paddingBottom: 0,
        height: 30,
        color: '#fff',
        fontSize: 11
    },
    inputInnerBtn: {
        position: 'absolute',
        top: 0,
        right: 5,
        paddingLeft: 0,
        paddingRight: 0
    },
});