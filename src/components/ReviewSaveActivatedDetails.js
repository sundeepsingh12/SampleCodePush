import React, { PureComponent } from 'react'
import renderIf from '../lib/renderIf'
import { StyleSheet, View, FlatList, TouchableOpacity, Modal } from 'react-native'
import {
    Edit
} from '../lib/constants'
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
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
export default class ReviewSaveActivatedDetails extends PureComponent {

    renderData = (item) => {
        return (
            <View style={[styles.row, styles.paddingLeft10, styles.paddingRight10]}>
                <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                    <Text style={[styles.fontDefault]}>{item.label}</Text>
                </View>
                <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                    <Text style={[styles.fontDefault, styles.fontBlack]}>{item.value}</Text>
                </View>
            </View>
        )
    }

    _keyExtractor = (item, index) => String(item.id);

    render() {
        return (

            <Modal
                animationType="slide"
                onRequestClose={() => this.props.reviewCommonData(false, {})}>
                <StyleProvider style={getTheme(platform)}>
                    <Container>
                        <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
                            <Body>
                                <View
                                    style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                                    <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.reviewCommonData(false, {}) }}>
                                        <Icon name="md-close" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                                    </TouchableOpacity>
                                    <View style={[style.headerBody]}>
                                        <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.headerTitle}</Text>
                                    </View>
                                    <View style={[style.headerRight]}>
                                        {renderIf(this.props.isEditVisible,
                                            <Text style={[styles.fontCenter, styles.fontWhite, styles.fontDefault, styles.alignCenter]}
                                                onPress={() => this.props.edit(this.props.itemId)}>
                                                {Edit}
                                            </Text>)}
                                    </View>
                                </View>
                            </Body>
                        </Header>

                        <Content style={[styles.flex1, styles.bgWhite]}>
                            <FlatList
                                data={this.props.commonData}
                                extraData={this.state}
                                renderItem={(item) => this.renderData(item.item)}
                                keyExtractor={this._keyExtractor}>
                            </FlatList>
                        </Content>
                    </Container>
                </StyleProvider>
            </Modal>)
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