import React, { Component } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import {
    Container,
    Content,
    Header,
    Button,
    Text,
    Body,
    Icon,
    Footer,
    FooterTab,
} from 'native-base';
import {
    _id,
} from '../lib/constants'
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
export default class DataStoreItemDetails extends Component {

    renderData = (item) => {
        return (
            <View style={[style.cardLeft]}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={[styles.flexBasis50, styles.fontDefault, styles.padding10, styles.fontWeight300, styles.fontDefault]}>{item.key}</Text>
                    <Text style={[styles.flexBasis50, styles.fontDefault, styles.padding10, styles.fontWeight300, styles.fontDefault]}>{item.value}</Text>
                </View>
            </View>)
    }

    createDetails(dataStoreAttributeValueMap) {
        let attributeArray = []
        let id = 0;
        for (let attribute in dataStoreAttributeValueMap) {
            if (attribute != _id) {
                let attributeObject = {
                    id: id++,
                    key: attribute,
                    value: dataStoreAttributeValueMap[attribute]
                }
                attributeArray.push(attributeObject)
            }
        }
        return attributeArray
    }

    render() {
        return (
            <Container>
                <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
                    <Body>
                        <View
                            style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.marginBottom10, styles.marginTop15]}>
                            <Icon name="md-close" style={[styles.fontWhite, styles.fontXl, styles.paddingRight5, styles.paddingLeft5]} onPress={() => { this.props.goBack() }} />
                            <Text
                                style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>Confirm</Text>
                            <View />
                        </View>
                        <View style={[styles.row,]}>
                            <View
                                style={[styles.row, styles.flex1, styles.justifySpaceBetween, styles.relative]}>
                            </View>
                        </View>
                    </Body>
                </Header>
                <Content style={[styles.margin5]}>
                    < FlatList
                        data={this.createDetails(this.props.selectedElement.dataStoreAttributeValueMap)}
                        renderItem={({ item }) => this.renderData(item)}
                        keyExtractor={item => item.id}
                    />
                </Content>
                <Footer style={{ height: 'auto', backgroundColor: 'white' }}>
                    <FooterTab style={StyleSheet.flatten([styles.padding10, styles.bgWhite])}>
                        <Button success full style={styles.bgPrimary}
                            onPress={() => {
                                this.props.onSave(this.props.selectedElement.dataStoreAttributeValueMap, this.props.selectedElement.dataStoreAttributeValueMap[this.props.selectedElement.uniqueKey])
                            }}>
                            <Text style={[styles.fontLg, styles.fontWhite]}>Save</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}
const style = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        height: 'auto',
        paddingTop: 10,
        paddingBottom: 10
    },
    cardLeft: {
        flex: 0.85,
        borderRightColor: '#f3f3f3',
        borderRightWidth: 1
    },
});