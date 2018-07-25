'use strict';
import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-navigation'
import { Container, Header,Body, Icon,StyleProvider } from 'native-base';
import { RNCamera } from 'react-native-camera'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as globalActions from '../modules/global/globalActions'
import { SCANNING } from '../lib/constants'
import styles from '../themes/FeStyle'
import platform from '../../native-base-theme/variables/platform'
import getTheme from '../../native-base-theme/components'

const SCREEN_WIDTH = Dimensions.get('window').width;
const VIEW_PORT =   SCREEN_WIDTH * 0.8;


function mapStateToProps(state) {
    return {
        scanning: state.qrCodeReducer.scanning
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions }, dispatch)
    }
}

class QrCodeScanner extends PureComponent {
    value  = new Animated.Value(0);
    state = {
        'flow': false
    };
    componentDidMount() {
        this.props.actions.setState(SCANNING, true);
        Animated.loop(
            Animated.sequence(
                [Animated.timing(this.value, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(this.value, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true,
                })],
            ),
        ).start();
        this.value.addListener(({value}) => {
            if(value === 0) this.setState({flow: false})
            else if(value === 1) this.setState({flow: true})
         });

        // let a = 42;
        // setTimeout(()=>{
        //     while(true){
        //         a++;
        //        }
        // },3000)
      
    }

    _handleQrCodeRead(e) {
        this.props.actions.setState(SCANNING, false)
        this.props.navigation.goBack(null)
        if (this.props.navigation.state.params.calledFromArray) {
            this.props.navigation.state.params.returnData(e.data, this.props.navigation.state.params.currentElement)
        } else {
            this.props.navigation.state.params.returnData(e.data)
        }
    }

    barOpac() {
        if(this.state.flow){
            return(
            <View style={{flex: 1}}>
                <View style={[style.barStyle, {opacity: 1}]}/>
                <View style={[style.barStyle, {opacity: 0.875}]}/>
                <View style={[style.barStyle, {opacity: 0.75}]}/>
                <View style={[style.barStyle, {opacity: 0.625}]}/>
                <View style={[style.barStyle, {opacity: 0.5}]}/>
                <View style={[style.barStyle, {opacity: 0.375}]}/>
                <View style={[style.barStyle, {opacity: 0.25}]}/> 
                <View style={[style.barStyle, {opacity: 0.125 }]}/>
            </View>)
        } else {
            return (
            <View style={{flex: 1}}>
                <View style={[style.barStyle, {opacity: 0.125 }]}/>
                <View style={[style.barStyle, {opacity: 0.25}]}/> 
                <View style={[style.barStyle, {opacity: 0.375}]}/>
                <View style={[style.barStyle, {opacity: 0.5}]}/>
                <View style={[style.barStyle, {opacity: 0.625}]}/>
                <View style={[style.barStyle, {opacity: 0.75}]}/>
                <View style={[style.barStyle, {opacity: 0.875}]}/>
                <View style={[style.barStyle, {opacity: 1}]}/>
            </View>
            )
        }

    }

    spitOutAnimation() {
        return(
            <Animated.View 
            style={[
                {flex: 1},
               { transform: [
                    {
                        translateY: this.value.interpolate({
                            inputRange: [0,1],
                            outputRange:[-(VIEW_PORT * 0.1),VIEW_PORT],
                        }),
                    },
                ]},
            ]}
            >
            { this.barOpac() }
            </Animated.View>    
        );
    }

    render() {
        if (this.props.scanning) {
            return (
                <StyleProvider style={getTheme(platform)}>
                    <Container>
                        <SafeAreaView style={{ backgroundColor: styles.bgPrimaryColor }}>
                            <Header searchBar style={StyleSheet.flatten([{ backgroundColor: styles.bgPrimaryColor }, style.header])}>
                                <Body>
                                    <View
                                        style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                                        <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                                            <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                                        </TouchableOpacity>
                                        <View style={[style.headerBody]}>
                                            <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter, styles.fontWeight500]}>Scanner</Text>
                                        </View>
                                        <View style={[style.headerRight]} />
                                    </View>
                                </Body>
                            </Header>
                        </SafeAreaView>
                        <View style={{flex: 1}}>
                            <RNCamera style={style.camera}
                                type={RNCamera.Constants.Type.back}
                                onBarCodeRead={this._handleQrCodeRead.bind(this)}>
                                <View style={style.rectangleContainer}>
                                    <View style={{
                                        borderWidth: SCREEN_WIDTH,
                                        borderColor:'rgba(0,0,0,.7)'
                                    }}>
                                        <View style={style.rectangle}>
                                               {this.spitOutAnimation()}
                                        </View>
                                    </View>
                                </View>
                            </RNCamera>
                        </View>
                    </Container>
                </StyleProvider>
            );
        } else {
            return null;
        }
    }
}

const style = StyleSheet.create({
    camera: {
        flex: 1,
    },
    rectangleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'transparent',
    },

    rectangle: {
        height: VIEW_PORT, 
        width: VIEW_PORT,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'rgba(57,255,20,0.4) ',
    },
    header: {
        borderBottomWidth: 0,
        height: 'auto',
        padding: 0,
        paddingRight: 0,
        paddingLeft: 0,
        elevation: 0
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
    barStyle: {
        width: '100%',
        height: '1%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#39ff14',
        marginTop: '0.2%',
        marginBottom: '0.2%',
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(QrCodeScanner)