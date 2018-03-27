import React, { PureComponent } from 'react'
import { StyleSheet, View, FlatList, Modal } from 'react-native'
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
} from 'native-base'
import {
    _id,
} from '../lib/constants'
import {
    SAVE,
    CONFIRM
} from '../lib/ContainerConstants'
import styles from '../themes/FeStyle'
export default class DataStoreItemDetails extends PureComponent {

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
        let id = 0
        for (let attribute in dataStoreAttributeValueMap) {
            if (attribute != _id && dataStoreAttributeValueMap[attribute]) {
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
            <Modal
                animationType="slide"
                onRequestClose={() => { this.props.goBack(-1, null, true) }}>
                <Container>
                    <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
                        <Body>
                            <View
                                style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.marginBottom10, styles.marginTop15]}>
                                <Icon name="md-close" style={[styles.fontWhite, styles.fontXl, styles.paddingRight5, styles.paddingLeft5]} onPress={() => { this.props.goBack(-1, null, true) }} />
                                <Text
                                    style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{CONFIRM}</Text>
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
                            keyExtractor={item => String(item.id)}
                        />
                    </Content>
                    <Footer style={{ height: 'auto', backgroundColor: 'white' }}>
                        <FooterTab style={StyleSheet.flatten([styles.padding10, styles.bgWhite])}>
                            <Button success full style={styles.bgPrimary}
                                onPress={() => {
                                    this.props.onSave(this.props.selectedElement.dataStoreAttributeValueMap, this.props.selectedElement.dataStoreAttributeValueMap[this.props.selectedElement.uniqueKey])
                                }}>
                                <Text style={[styles.fontLg, styles.fontWhite]}>{SAVE}</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </Container>
            </Modal>
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