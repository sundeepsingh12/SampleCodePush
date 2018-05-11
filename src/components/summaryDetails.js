import React, { PureComponent } from 'react'
import renderIf from '../lib/renderIf'
import { StyleSheet, View, FlatList, TouchableOpacity, Modal } from 'react-native'

import {
    Container,
    Content,
    Header,
    Text,
    Left,
    Body,
    Right,
    Icon,
    List,
    StyleProvider,
    Footer,
} from 'native-base';
import {
    Parcel_Summary
} from '../lib/AttributeConstants'

import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
export default class SummaryDetails extends PureComponent {

    renderParcelData = (item) => {
        return (
            <FlatList
                style={[styles.marginBottom10, styles.marginLeft10, styles.marginRight10, styles.bgWhite, styles.padding5, styles.shadow, styles.borderRadius3]}
                data={item.fieldDataArray}
                extraData={this.state}
                renderItem={(item) => this.renderParcelItem(item.item)}
                keyExtractor={this._keyExtractor}>
            </FlatList>)
    }

    renderParcelItem = (item) => {
        if (item.value) {
            return (
                <View style={[styles.row, styles.paddingRight5, styles.paddingLeft5]}>
                    <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                        <Text style={[styles.fontDefault]}>{item.label}</Text>
                    </View>
                    <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                        <Text style={[styles.fontDefault, styles.fontBlack]}>{item.value}</Text>
                    </View>
                </View>
            )
        }
    }

    _keyExtractor = (item, index) => String(item.id);

    render() {
        return (
            <Modal
                animationType="slide"
                onRequestClose={() => this.props.showParcelSummary(false)}>
                <StyleProvider style={getTheme(platform)}>
                    <Container>
                        <Header searchBar style={StyleSheet.flatten([{backgroundColor : styles.bgPrimaryColor}, style.header])}>
                            <Body>
                                <View
                                    style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                                    <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.showParcelSummary(false) }}>
                                        <Icon name="md-close" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                                    </TouchableOpacity>
                                    <View style={[style.headerBody]}>
                                        <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{Parcel_Summary}</Text>
                                    </View>
                                    <View style={[style.headerRight]}>
                                    </View>
                                    <View />
                                </View>
                            </Body>
                        </Header>

                        <Content style={[styles.bgLightGray]}>
                            <FlatList
                                style={[styles.marginTop10]}
                                data={_.values(this.props.recurringData)}
                                extraData={this.state}
                                renderItem={(item) => this.renderParcelData(item.item)}
                                keyExtractor={this._keyExtractor}>
                            </FlatList>
                        </Content>

                    </Container>
                </StyleProvider>
            </Modal>
        )
    }
}
const style = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        height: 'auto',
        padding: 0,
        paddingRight: 0,
        paddingLeft: 0
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
        width: '15%',
        padding: 15
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