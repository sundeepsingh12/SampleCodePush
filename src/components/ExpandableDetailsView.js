'use strict'

import React, { PureComponent } from 'react'
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

class ExpandableDetailsView extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            showDropdown: false
        }
    }

    render() {
        return (
            <TouchableOpacity onPress={() => { this.setState({ showDropdown: !this.state.showDropdown }) }}>
                <View style={[styles.row, styles.paddingLeft10, styles.paddingRight10]}>
                    <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                        <Text style={[styles.fontDefault]} >
                            {this.props.label}
                        </Text>
                    </View>
                    <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                        <Text style={[styles.fontDefault, styles.fontPrimary]}>
                        {this.props.childDataList.length == 0 ? 'N.A' : this.state.showDropdown ? 'Tap to hide' : 'Tap to show'}
                        </Text>
                    </View>
                </View>

                {renderIf(this.state.showDropdown && this.props.childDataList.length > 0,
                    <ExpandableDetailsList
                        key={this.props.id}
                        dataList={this.props.childDataList}
                        navigateToDataStoreDetails={this.props.navigateToDataStoreDetails}
                        navigateToCameraDetails={this.props.navigateToCameraDetails} />
                )}
            </TouchableOpacity>
        )
    }
}

export default ExpandableDetailsView