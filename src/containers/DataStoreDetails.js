import React, { PureComponent } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, Modal } from 'react-native'
import {
    Container,
    Content,
    Header,
    Text,
    Body,
    Icon,
    StyleProvider,
} from 'native-base'
import {
    _id
} from '../lib/constants'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as globalActions from '../modules/global/globalActions'
import * as dataStoreActions from '../modules/dataStore/dataStoreActions'
import Loader from '../components/Loader'
import _ from 'lodash'

function mapStateToProps(state) {
    return {
        dataStoreAttrValueMap: state.dataStore.dataStoreAttrValueMap,
        errorMessage: state.dataStore.errorMessage,
        loaderRunning: state.dataStore.loaderRunning,
        value: state.dataStore.value
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...dataStoreActions, ...globalActions }, dispatch)
    }
}


class DataStoreDetails extends PureComponent {

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    componentDidMount() {
        if (this.props.value != this.props.navigation.state.params.value || _.size(this.props.dataStoreAttrValueMap) != 1) {
            (this.props.navigation.state.params.jobAttributeMasterId) ?
                this.props.actions.getJobAttribute(this.props.navigation.state.params.jobAttributeMasterId, this.props.navigation.state.params.value)
                : this.props.actions.getFieldAttribute(this.props.navigation.state.params.fieldAttributeMasterId, this.props.navigation.state.params.value)
        }
    }

    createDetails(dataStoreAttributeValueMap) {
        let attributeArray = []
        let id = 0;
        for (let attribute in dataStoreAttributeValueMap.dataStoreAttributeValueMap) {
            if (attribute != _id) {
                let attributeObject = {
                    id: id++,
                    key: attribute,
                    value: dataStoreAttributeValueMap.dataStoreAttributeValueMap[attribute]
                }
                attributeArray.push(attributeObject)
            }
        }
        return attributeArray
    }

    renderData = (item) => {
        return (
            <View style={[styles.row, styles.paddingLeft10, styles.paddingRight10]} >
                <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                    <Text style={[styles.fontDefault]}> {item.key}</Text >
                </View >
                <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                    <Text style={[styles.fontDefault, styles.fontBlack]}> {item.value}</Text >
                </View >
            </View >
        )
    }

    _keyExtractor = (item, index) => String(item.id)


    loader() {
        let loaderView = null
        if (this.props.loaderRunning) {
            loaderView = <Loader />
        }
        return loaderView
    }

    flatList() {
        let flatListView = null
        if (_.size(this.props.dataStoreAttrValueMap) == 1) {
            flatListView = <FlatList
                data={this.createDetails(_.values(this.props.dataStoreAttrValueMap)[0])}
                extraData={this.state}
                renderItem={(item) => this.renderData(item.item)}
                keyExtractor={this._keyExtractor}>
            </FlatList >
        }
        return flatListView
    }


    error() {
        let errorView = null
        if (this.props.errorMessage != '' && _.size(this.props.dataStoreAttrValueMap) != 1) {
            errorView = <Text style={[styles.alignSelfCenter, styles.marginTop30, styles.fontDarkGray]}>{this.props.errorMessage}</Text>
        }
        return errorView
    }

    render() {
        let flatListView = this.flatList()
        return (
            <Modal
                animationType="slide"
                onRequestClose={() => this.props.navigation.goBack()}>
                <StyleProvider style={getTheme(platform)}>
                    <Container>
                        <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])} >
                            <Body>
                                <View
                                    style={[styles.row, styles.width100]}>
                                    <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack() }
                                    }>
                                        <Icon name="md-close" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                                    </TouchableOpacity >
                                    <View style={[style.headerBody]}>
                                        <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}> {this.props.navigation.state.params.value}</Text >
                                    </View >
                                </View >
                            </Body >
                        </Header >

                        <Content style={[styles.flex1, styles.bgWhite]}>
                            {this.loader()}
                            {flatListView}
                            {this.error()}
                        </Content >

                    </Container >
                </StyleProvider >
            </Modal >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataStoreDetails)

const style = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        height: 'auto',
    },
    headerLeft: {
        width: '15%',
        padding: 15
    },
    headerBody: {
        width: '70%',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10
    },
    headerRight: {
        width: '20%',
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
        paddingRight: 15
    },
    footer: {
        height: 'auto',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3',
        paddingTop: 10,
        paddingBottom: 10
    },
}); 
