'use strict'
import React, { Component } from 'react'
import {
    FlatList,
    View,
    Text
} from 'react-native'

class SignatureRemarks extends Component {

    renderData = (item) => {
        return (
            <View>
                <Text>{item.label}</Text>
                <Text>{item.value}</Text>
                <View
                    style={{
                        width: 1000,
                        height: 1,
                        backgroundColor: 'black',
                    }}
                />
            </View>
        )
    }

    render() {
        return (
            <FlatList
                data={this.props.fieldDataList}
                renderItem={({ item }) => this.renderData(item)}
                keyExtractor={item => item.fieldAttributeMasterId}
            />
        )
    }
}

export default SignatureRemarks
