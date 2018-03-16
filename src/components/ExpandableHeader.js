'use strict'

import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight
} from 'react-native'
import { Icon } from 'native-base'
import styles from '../themes/FeStyle'
import ExpandableDetailsList from './ExpandableDetailsList'
import renderIf from '../lib/renderIf'

class ExpandableHeader extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            showDropDown: true
        }
    }

    render() {
        return (
            <View>
                <TouchableHighlight underlayColor='#f3f3f3' style={[styles.padding10]} onPress={() => { this.setState({ showDropDown: !this.state.showDropDown }) }}>
                    <View style={StyleSheet.flatten([styles.width100, styles.row, styles.justifySpaceBetween])} >
                        <Text style={[styles.fontLg, styles.fontBlack, styles.bold]}>
                            {this.props.title}
                        </Text>
                        <View>
                            <Icon name={this.state.showDropDown ? 'ios-arrow-up-outline' : 'ios-arrow-down-outline'} style={StyleSheet.flatten([styles.fontXl, styles.fontPrimary, styles.justifyEnd])} />
                        </View>
                    </View>
                </TouchableHighlight>
                {renderIf(this.state.showDropDown,
                    <ExpandableDetailsList
                        dataList={this.props.dataList}
                        navigateToDataStoreDetails={this.props.navigateToDataStoreDetails}
                        navigateToCameraDetails={this.props.navigateToCameraDetails} />
                )}
            </View>
        )
    }
}

export default ExpandableHeader




