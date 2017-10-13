import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity
}
    from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SignatureView from '../components/SignatureView'
import * as signatureActions from '../modules/signature/signatureActions'

function mapStateToProps(state) {
    return {
        fieldDataList: state.signature.fieldDataList,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...signatureActions }, dispatch)
    }
}

class Signature extends Component {

    componentWillMount() {
        var kvArray = [
            {
                id: 1,
                hidden: false,
                parentId: 0,
                label: 'shivani',
                value: 'monga'
            },
            {
                id: 2,
                hidden: false,
                parentId: 0,
                label: 'divs',
                value: 'goel'
            },
            {
                id: 3,
                hidden: false,
                parentId: 0,
                label: 'abhishek',
                value: 'thakur'
            },
            {
                id: 4,
                hidden: false,
                parentId: 0,
                label: 'abhishek',
                value: 'thakur'
            }
        ]
        var myMap = new Map();
        myMap.set(6, kvArray);
        this.props.actions.getRemarksValidationList(159, myMap)
    }
    getValidation() {
        // let validation=this.props.fieldDataList.get(this.props.fieldAttributeMasterId).validation  
        // for(let value of validation){
        //     if(value.timeOfExecution=='MINMAX'){
        //         return value.condition
        //     }
        // }
        return 'TRUE'
    }
    onSaveEvent = (result) => {
        console.log(result)
        this.props.actions.saveSignature(result)
    }

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
        if (this.getValidation() == 'TRUE' && this.props.fieldDataList.length > 0) {
            return (
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={this.props.fieldDataList}
                            renderItem={({ item }) => this.renderData(item)}
                            keyExtractor={item => item.id}
                        />
                    </View>
                    <View
                        style={{
                            width: 1,
                            height: 1000,
                            backgroundColor: 'black',
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                        }}
                    />
                    <View style={{ flex: 2 }}>
                        <SignatureView onSaveEvent={this.onSaveEvent} />
                    </View>
                </View>
            );
        } else {
            return (
                <SignatureView />
            );
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Signature)
