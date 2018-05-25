import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableOpacity, WebView, Platform, ActivityIndicator, BackHandler, SafeAreaView } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as statisticsActions from '../modules/statistics/statisticsActions'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as globalActions from '../modules/global/globalActions'
import { WEBVIEW_REF, ENTER_URL_HERE, HTTP } from '../lib/AttributeConstants'
import renderIf from '../lib/renderIf'
import { INVALID_URL_OR_NO_INTERNET, OK } from '../lib/ContainerConstants'
import { START_FETCHING_URL, END_FETCHING_URL, ON_CHANGE_STATE, QrCodeScanner, SCANNER_TEXT } from '../lib/constants'
import { Container, Content, Header, Button, Text, Left, Body, Input, Right, Icon, Footer, FooterTab, StyleProvider, Toast } from 'native-base'
function mapStateToProps(state) {
    return {
        isLoaderRunning: state.customApp.isLoaderRunning,
        customUrl: state.customApp.customUrl,
        scannerText: state.customApp.scannerText
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions }, dispatch)
    }
}

class CustomApp extends PureComponent {

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    onError() {
        Toast.show({
            text: INVALID_URL_OR_NO_INTERNET,
            position: 'bottom',
            buttonText: OK,
            duration: 5000
        })
    }

    goBack = () => {
        this.refs[WEBVIEW_REF].goBack()
    }

    goForward = () => {
        this.refs[WEBVIEW_REF].goForward()
    }

    onReload = () => {
        if (this.props.customUrl)
            this.refs[WEBVIEW_REF].reload()
    }

    onLoadEnd = () => {
        this.props.actions.setState(END_FETCHING_URL, {})
    }

    onSubmit(value) {
        if (!/^[a-zA-Z-_]+:/.test(value)) {
            value = HTTP + value;
        }
        this.props.actions.setState(START_FETCHING_URL, value)
    }

    onLoadStart = () => {
        if (this.props.customUrl)
            this.props.actions.setState(START_FETCHING_URL, this.props.customUrl)
    }

    onSetText = (value) => {
        let js = `document.activeElement.value = "${value}";`
        let jsCode = `javascript: ${js};` + Math.random()
        this.props.actions.setState(SCANNER_TEXT, jsCode)
    }

    componentDidMount() {
        if (this.props.navigation.state.params.customUrl != null && this.props.navigation.state.params.customUrl != undefined) {
            this.props.actions.setState(START_FETCHING_URL, this.props.navigation.state.params.customUrl)
        }
    }

    componentWillUnmount() {
        this.props.actions.setState(ON_CHANGE_STATE)
    }

    showUrlInputView() {
        return (
            <View style={[style.headerBody]} t>
                {!this.props.navigation.state.params.customUrl ?
                    <View style={[{ height: 30 }]}>
                        <Input
                            onEndEditing={(event) => this.onSubmit(event.nativeEvent.text)}
                            placeholder={ENTER_URL_HERE}
                            placeholderTextColor={'rgba(255,255,255,.4)'}
                            returnKeyType={"search"}
                            keyboardAppearance={"dark"}
                            style={[style.headerSearch]} />
                    </View> :
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.fontCenter, styles.fontWhite, styles.fontDefault, styles.alignCenter]}>{this.props.customUrl}</Text>}
            </View>
        )
    }


    showFooterView() {
        return (
            <SafeAreaView>
                <Footer style={[style.footer]}>
                    <FooterTab>
                        <Button full style={[styles.bgWhite]} onPress={this.goBack}>
                            <Icon name="ios-arrow-back" style={[styles.fontLg, styles.fontBlack]} />
                        </Button>
                        <Button full style={[styles.bgWhite]} onPress={this.goForward}>
                            <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontBlack]} />
                        </Button>
                    </FooterTab>
                    {(this.props.navigation.state.params.customUrl) ?
                        <FooterTab>
                            <Button style={{ alignItems: 'flex-end', height: 40, width: 40 }} onPress={() => this.props.navigation.navigate(QrCodeScanner, { returnData: this.onSetText.bind(this) })}>
                                <MaterialCommunityIcons name='qrcode' style={[styles.fontXxl]} color={styles.fontBlack.color} />
                            </Button>
                        </FooterTab> : null}
                </Footer>
            </SafeAreaView>
        )
    }

    showBody() {
        return (
            <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack() }}>
                    <Icon name="md-close" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                </TouchableOpacity>
                {this.showUrlInputView()}

                {!(this.props.isLoaderRunning) ?
                    <TouchableOpacity style={[style.headerRight]} onPress={this.onReload}>
                        <Icon name="md-refresh" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                    </TouchableOpacity> :
                    <View style={[style.headerRight]}  >
                        <ActivityIndicator
                            animating={this.props.isLoaderRunning}
                            color={'#ffffff'}
                            style={style.ActivityIndicatorStyle}
                        />
                    </View>
                }
            </View>
        )
    }

    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <SafeAreaView style={[{ backgroundColor: styles.bgPrimaryColor }]}>
                        <Header searchBar style={StyleSheet.flatten([{ backgroundColor: styles.bgPrimaryColor }, style.header])}>
                            <Body>
                                {this.showBody()}
                            </Body>
                        </Header>
                    </SafeAreaView>
                    {this.props.customUrl || (this.props.scannerText) || (!this.props.navigation.state.params.customUrl) ?
                        <WebView
                            ref={WEBVIEW_REF}
                            source={{ uri: (this.props.scannerText) ? this.props.scannerText : this.props.customUrl }}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            onLoadEnd={this.onLoadEnd}
                            onLoadStart={this.onLoadStart}
                            onError={(event) => this.onError()}
                        /> : null}
                    {this.showFooterView()}
                </Container>
            </StyleProvider>
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
        padding: 15,
        justifyContent: 'center'
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
        padding: 15,
        justifyContent: 'center'
    },
    headerTochableRight: {
        width: '15%',
        padding: 11,
        justifyContent: 'center'
    },

    WebViewStyle:
        {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            marginTop: (Platform.OS) === 'ios' ? 20 : 0
        },

    ActivityIndicatorStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'

    },
    footer: {
        height: 'auto',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3',
    },
    headerSearch: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'rgba(48, 48, 48, .3)',
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 2,
        height: 30,
        lineHeight: 11,
        color: '#fff',
        fontSize: 11
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(CustomApp)
