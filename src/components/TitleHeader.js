import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text
} from 'react-native'
import { Spinner } from 'native-base'
import {Button, Body, Header, Left, Right, Icon } from 'native-base'
import theme from '../themes/feTheme'
import styles from '../themes/FeStyle'
import { Actions } from 'react-native-router-flux'

class TitleHeader extends Component {
    render() {
        return (
            <Header style={StyleSheet.flatten([theme.bgPrimary])}>
                <Left style={StyleSheet.flatten([styles.flexBasis15])}>
                    <Button transparent onPress={() => { Actions.pop() }}>
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