import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text
} from 'react-native'
import {Button, Body, Header, Left, Right, Icon } from 'native-base'
import styles from '../themes/FeStyle'

class TitleHeader extends PureComponent {
    render() {
        return (
            <Header style={StyleSheet.flatten([{backgroundColor : styles.bgPrimaryColor}])}>
                <Left style={StyleSheet.flatten([styles.flexBasis15])}>
                    <Button transparent onPress={() => { }}>
                        <Icon name='arrow-back' style={StyleSheet.flatten([styles.fontXl, styles.fontWhite])} />
                    </Button>
                </Left>
                <Body style={StyleSheet.flatten([styles.alignCenter, styles.flexBasis70])}>
                    <Text style={StyleSheet.flatten([styles.fontSm, styles.fontWhite, styles.fontCenter])}>Ref12345676565</Text>
                    <Text style={StyleSheet.flatten([styles.fontSm, styles.fontWhite, styles.bold, styles.fontYellow, styles.fontCenter])}>Pending</Text>
                </Body>
                <Right style={StyleSheet.flatten([styles.flexBasis15])}>
                </Right>
            </Header>
        )
    }
}

export default TitleHeader