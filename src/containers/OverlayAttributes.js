import React, { Component } from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native'
import {
    NPS_FEEDBACK
} from '../lib/AttributeConstants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import StarRating from 'react-native-star-rating';
function mapStateToProps(state) {
    return {
    }
}
function mapDispatchToProps(dispatch) {
    return {
    }
}
class OverlayAttributes extends Component {

    render() {
        console.log('==', this.props.navigation.state.params.item.attributeTypeId)
        switch (this.props.navigation.state.params.item.attributeTypeId) {
            case NPS_FEEDBACK:
                return (
                    <StarRating
                        disabled={false}
                        maxStars={5}
                        rating={0}
                        selectedStar={(rating) => console.log(rating)}
                    />
                )
            default:
                return (
                    <Text>
                        Under construction
                    </Text>
                )
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OverlayAttributes)

