import React, { PureComponent } from 'react'
import { View, TextInput } from 'react-native'
import { Content, Text, } from 'native-base';
import styles from '../../themes/FeStyle'
import { TOTAL_AMOUNT_FOR_WALLET, ENTER_REGISTERED, MOBILE_NUMBER } from '../../lib/ContainerConstants'

export default class OtpGeneratedView extends PureComponent {
    render() {
        return (
            <Content >
                <View style={[styles.flex1, styles.column]}>
                    <View style={[styles.bgLightGray, styles.justifyCenter, styles.alignCenter, { height: 200 }]}>
                        <Text style={[{ fontSize: 52 }]}>{this.props.actualAmount}</Text>
                        <Text>{TOTAL_AMOUNT_FOR_WALLET}</Text>
                    </View>
                    <View>
                        <View style={{ marginTop: 50 }}>
                            <Text style={[{color : styles.fontPrimaryColor}, styles.paddingHorizontal10, styles.fontSm]}>{ENTER_REGISTERED + this.props.selectedWalletDetails.name+' '+ MOBILE_NUMBER}</Text>
                        </View>
                        <View>
                            <TextInput
                                placeholder={MOBILE_NUMBER}
                                value={this.props.contactNumber}
                                keyboardType='numeric'
                                editable={true}
                                returnKeyType='done'
                                onChangeText={this.props.onChangeMobileNo}
                                style={[styles.fontXxxl, styles.padding10]}
                            />
                        </View>
                        <Text style={[styles.fontDanger, styles.fontSm, styles.marginLeft5]}>{this.props.message}</Text>
                    </View>
                </View>
            </Content>
        )
    }
}