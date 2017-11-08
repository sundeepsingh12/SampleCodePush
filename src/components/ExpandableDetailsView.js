'use strict'

import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    TouchableOpacity
} from 'react-native'
import { Icon } from 'native-base'
import styles from '../themes/FeStyle'
import ExpandableDetailsList from './ExpandableDetailsList'
import renderIf from '../lib/renderIf'

class ExpandableDetailsView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showDropdown: false
        }
    }

    render() {
        return (
            <View style={StyleSheet.flatten([styles.column, { backgroundColor: '#F2F2F2' }])}>
                <TouchableOpacity style={StyleSheet.flatten([styles.row, styles.padding10, { borderTopWidth: .5, borderColor: '#C5C5C5' }])} onPress={() => { this.setState({ showDropdown: !this.state.showDropdown }) }}>
                    <View style={StyleSheet.flatten([styles.row, styles.justifyStart, styles.alignCenter, { flex: .5 }])}>
                        <Text style={StyleSheet.flatten([styles.bold, styles.fontSm])} >
                            {this.props.label}
                        </Text>
                    </View>
                    <View style={StyleSheet.flatten([styles.row, styles.justifySpaceBetween, styles.alignCenter, { flex: .5 }])}>
                        <Text style={StyleSheet.flatten([styles.fontSm])}>
                            {this.state.showDropdown ? 'Hide Details' : 'Show Details'}
                        </Text>
                        <Text>
                            <Icon name={this.state.showDropdown ? 'md-arrow-dropup' : 'md-arrow-dropdown'} style={StyleSheet.flatten([styles.alignSelfEnd, styles.fontBlack, styles.fontXl])} />
                        </Text>
                    </View>
                </TouchableOpacity>
                {renderIf(this.state.showDropdown,
                    <ExpandableDetailsList
                        key={this.props.id}
                        dataList={this.props.childDataList} />
                )}
            </View>
        )
    }
}

export default ExpandableDetailsView