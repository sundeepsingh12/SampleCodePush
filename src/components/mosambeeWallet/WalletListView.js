import React, { PureComponent } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import { Content, Text, Right, Icon } from 'native-base';
import styles from '../../themes/FeStyle'
import { SELECT_PREFERRED_METHOD } from '../../lib/ContainerConstants'

export default class WalletListView extends PureComponent {

    renderWalletData = (item) => {
        return (
            <TouchableOpacity
                onPress={() => this.props.generateOtpNumber(item)}
                underlayColor={'#eee'} {...this.props.sortHandlers}>
                <View style={[style.seqCard]}>
                    <View style={[style.seqCardDetail]}>
                        <Text style={[styles.fontDefault, styles.marginLeft5]}>{item.name}</Text>
                        <Right>
                            <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontLightGray]} />
                        </Right>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <Content style={[styles.bgWhite]}>
                <View style={[styles.paddingVertical15, styles.paddingHorizontal10]}>
                    <Text style={[styles.fontDefault, styles.fontLg, styles.marginTop12, styles.marginLeft5]}>{SELECT_PREFERRED_METHOD}</Text>
                </View>
                <FlatList
                    style={[styles.marginTop10]}
                    data={this.props.walletListData}
                    extraData={this.state}
                    renderItem={(item) => this.renderWalletData(item.item)}
                    keyExtractor={(item) => String(item.code)}>
                </FlatList>
            </Content>
        )
    }
}
const style = StyleSheet.create({
    seqCard: {
        minHeight: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 1
    },
    seqCardDetail: {
        flex: 1,
        minHeight: 70,
        padding: 10,
        borderBottomColor: '#e4e4e4',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
});