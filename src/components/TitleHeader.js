import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Body, Header, Icon } from 'native-base'
import styles from '../themes/FeStyle'

class TitleHeader extends PureComponent {

    render() {
        return (
            <Header searchBar style={[{ backgroundColor: styles.bgPrimaryColor }, styles.header]} hasTabs>
                <Body>
                    <View
                        style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                        <TouchableOpacity style={[styles.headerLeft]} onPress={() => this.props.goBack(null)}>
                            <Icon name={this.props.icon ? this.props.icon : "md-arrow-back"} style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                        </TouchableOpacity>
                        <View style={[styles.headerBody]}>
                            <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.pageName}</Text>
                        </View>
                        <View style={[styles.headerRight]}>
                        </View>
                    </View>
                </Body>
            </Header>
        )
    }
}

export default TitleHeader