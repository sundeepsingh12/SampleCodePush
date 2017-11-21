import React, { Component } from 'react'
import renderIf from '../lib/renderIf'
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
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
export default class CheckoutDetials extends Component {

    render() {
        console.log('render',this.props)
        return (
            <Container>
                <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
                    <Body>
                        <View style={[styles.width100, styles.marginBottom10, styles.marginTop15, styles.alignSelfCenter]}>
                            <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>
                                Checkout
                            </Text>
                        </View>
                    </Body>
                </Header>
                <Content style={[styles.margin5]}>
                    <Text>hey</Text>
                </Content>
                <Footer style={{ height: 'auto', backgroundColor: 'white' }}>
                    <FooterTab style={StyleSheet.flatten([styles.padding10, styles.bgWhite])}>
                        <Button success full style={styles.bgPrimary} onPress={() => this.props.addToSyncList()}>
                            <Text style={[styles.fontLg, styles.fontWhite]}>Complete</Text>
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