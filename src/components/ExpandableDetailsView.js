'use strict'

import React, { PureComponent } from 'react'
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native'
import styles from '../themes/FeStyle'
import ExpandableDetailsList from './ExpandableDetailsList'
import renderIf from '../lib/renderIf'
import isEmpty from 'lodash/isEmpty'
import { N_A, TAP_TO_HIDE, TAP_TO_SHOW } from '../lib/ContainerConstants'

class ExpandableDetailsView extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            showDropdown: false
        }
    }
    checkForChildData(childDataList) {
        for (let data in childDataList) {
            if (!isEmpty(childDataList[data].childDataList) || childDataList[data].attributeTypeId == 8) {
                return true
            }
        }
        return false
    }

    render() {
        const isChildData = this.checkForChildData(this.props.childDataList)
        return (
            <TouchableOpacity onPress={() => { this.setState({ showDropdown: !this.state.showDropdown }) }}>
                <View style={[styles.row, styles.paddingLeft10, styles.paddingRight10]}>
                    <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                        <Text style={[styles.fontDefault]} >
                            {this.props.label}
                        </Text>
                    </View>
                    <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                        <Text style={[styles.fontDefault, {color : styles.fontPrimaryColor}]}>
                            {(!isChildData) ? N_A : this.state.showDropdown ? TAP_TO_HIDE : TAP_TO_SHOW}
                        </Text>
                    </View>
                </View>

                {renderIf(this.state.showDropdown && isChildData,
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