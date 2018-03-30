import React, { PureComponent } from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'
import styles from '../themes/FeStyle'

export default class Line1Line2View extends PureComponent {
    render() {
        return (
            <View style={style.seqCardDetail}>
                <View>
                    <Text style={[styles.fontDefault, styles.fontWeight500, styles.lineHeight25]}>
                        {this.props.data.line1}
                    </Text>
                    <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20]}>
                        {this.props.data.line2}
                    </Text>
                    <Text style={[styles.fontSm, styles.italic, styles.fontWeight300, styles.lineHeight20]}>
                        {this.props.data.circleLine1}
                    </Text>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    seqCardDetail: {
        flex: 1,
        minHeight: 70,
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})