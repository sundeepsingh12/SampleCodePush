'use strict'
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TextInput,
    TouchableOpacity,
    TouchableHighlight,
    Animated
} from 'react-native'
import Camera from 'react-native-camera'
import {
    Input,
    Container,
    Header,
    Body,
    Icon,
    StyleProvider,
    Button,
    Content
} from 'native-base'
import SearchBarV2 from '../components/SearchBarV2'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import TorchOnIcon from '../svg_components/icons/TorchOnIcon'
import TorchOffIcon from '../svg_components/icons/TorchOffIcon'

var { height, width } = Dimensions.get('window');
var isHidden = true;
export default class PostAssignmentScanner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bounceValue: new Animated.Value(240),  //This is the initial position of the subview
            directionIcon: "ios-arrow-up",
        };
    }

    onSwipeUp(gestureState) {
        this._toggleSubview()
    }

    onSwipeDown(gestureState) {
        this._toggleSubview()
    }


    _toggleSubview() {
        this.setState({
            directionIcon: !isHidden ? "ios-arrow-up" : "ios-arrow-down"
        });

        var toValue = 240;

        if (isHidden) {
            toValue = 0;
        }

        //This will animate the transalteY of the subview between 0 & 100 depending on its current state
        //100 comes from the style below, which is the height of the subview.
        Animated.spring(
            this.state.bounceValue,
            {
                toValue: toValue,
                velocity: 0,
                tension: 0,
                friction: 20,
            }
        ).start();

        isHidden = !isHidden;
    }

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    render() {
        const config = {
            velocityThreshold: 0.1,
            directionalOffsetThreshold: 80
        };
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, styles.header])} hasTabs>
                        <Body>
                            <View
                                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                                <TouchableOpacity style={[styles.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                                    <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                                </TouchableOpacity>
                                <View style={[styles.headerBody]}>
                                    <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>Task Assignment</Text>
                                </View>
                                <View style={[styles.headerRight]}>
                                </View>
                            </View>
                            <View style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.paddingLeft10, styles.paddingRight10]}>
                                <View style={[styles.relative, { width: '100%', height: 30 }]}>
                                    <TextInput
                                        placeholder='sdfsdf'
                                        placeholderTextColor={'rgba(255,255,255,.6)'}
                                        underlineColorAndroid='transparent'
                                        style={[styles.headerSearch]} />
                                    <Button small transparent style={[styles.inputInnerBtn]}>
                                        <Icon name="md-search" style={[styles.fontWhite, styles.fontXl]} />
                                    </Button>
                                </View>
                            </View>
                        </Body>
                    </Header>

                    <View style={[styles.relative, styles.flex1]}>
                        <Camera
                            ref="cam"
                            style={stylesa.preview}
                            aspect={Camera.constants.Aspect.fill}>

                            <View style={{ width: 200, height: 200, justifyContent: 'space-between' }}>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <View style={{ width: 50, height: 50, borderTopWidth: 3, borderLeftWidth: 3, borderTopColor: styles.bgPrimary.backgroundColor, borderLeftColor: styles.bgPrimary.backgroundColor }}></View>
                                    <View style={{ width: 50, height: 50, borderTopWidth: 3, borderRightWidth: 3, borderTopColor: styles.bgPrimary.backgroundColor, borderRightColor: styles.bgPrimary.backgroundColor }}></View>
                                </View>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <View style={{ width: 50, height: 50, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomColor: styles.bgPrimary.backgroundColor, borderLeftColor: styles.bgPrimary.backgroundColor }}></View>
                                    <View style={{ width: 50, height: 50, borderBottomWidth: 3, borderRightWidth: 3, borderBottomColor: styles.bgPrimary.backgroundColor, borderRightColor: styles.bgPrimary.backgroundColor }}></View>
                                </View>
                            </View>
                            {this.state.directionIcon == 'ios-arrow-up' ?
                                <View style={{ width: 74, height: 74, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 167 }}>
                                    <Image
                                        style={stylesa.imageSync}
                                        source={require('../../images/fareye-default-iconset/syncscreen/All_Done.png')}
                                    />
                                </View> : null
                            }

                        </Camera>
                        <View style={[styles.alignCenter, styles.justifyCenter, { position: 'absolute', borderRadius: 5, top: 10, left: 10, backgroundColor: 'rgba(158, 158, 158,.6)', padding: 5 }]}>
                            <TorchOffIcon width={32} height={32} />
                        </View>
                        {this.state.directionIcon == 'ios-arrow-down' ?
                            <GestureRecognizer
                                onSwipeDown={(state) => this.onSwipeDown(state)}
                                style={[styles.flex1, { position: 'absolute', backgroundColor: 'rgba(0,0,0,.8)', top: 0, bottom: 0, left: 0, right: 0 }]}>
                            </GestureRecognizer> : null
                        }
                    </View>


                    <Animated.View
                        style={[stylesa.subView,
                        { transform: [{ translateY: this.state.bounceValue }] }]}
                    >
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}
                        >
                            <View style={{ width: '95%', flex: 1, backgroundColor: 'transparent' }}>
                                <GestureRecognizer

                                    onSwipeUp={(state) => this.onSwipeUp(state)}
                                    onSwipeDown={(state) => this.onSwipeDown(state)}
                                    config={{
                                        velocityThreshold: 0.1,
                                        directionalOffsetThreshold: 80
                                    }}>
                                    <View style={[styles.justifyCenter, styles.alignCenter, styles.padding10, { backgroundColor: 'transparent' }]}>
                                        <Text style={[styles.fontBlack]}>
                                            <Icon name={this.state.directionIcon} style={[styles.fontXxxl, styles.fontWhite]} />
                                        </Text>
                                    </View>

                                    <View style={{ backgroundColor: '#ffffff', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomColor: '#f3f3f3', borderBottomWidth: 3, paddingTop: 15, paddingBottom: 15, paddingLeft: 10, paddingRight: 10 }}>
                                        <Text style={[styles.fontBlack]}>
                                            Pending : 39
                                        </Text>
                                    </View>
                                </GestureRecognizer>
                                <Content style={[styles.bgWhite]}>
                                    <View style={[styles.row, styles.padding10, styles.justifySpaceBetween, styles.alignCenter]}>
                                        <Text style={[styles.fontBlack]}>
                                            Pending : 39
                                        </Text>
                                        <Icon name="md-checkmark-circle" style={[styles.fontXl, styles.fontSuccess]} />
                                    </View>
                                    <View style={[styles.row, styles.padding10, styles.justifySpaceBetween, styles.alignCenter]}>
                                        <Text style={[styles.fontBlack]}>
                                            Pending : 39
                                        </Text>
                                        <Icon name="md-checkmark-circle" style={[styles.fontXl, styles.fontSuccess]} />
                                    </View>
                                    <View style={[styles.row, styles.padding10, styles.justifySpaceBetween, styles.alignCenter]}>
                                        <Text style={[styles.fontBlack]}>
                                            Pending : 39
                                        </Text>
                                        <Icon name="md-checkmark-circle" style={[styles.fontXl, styles.fontSuccess]} />
                                    </View>
                                    <View style={[styles.row, styles.padding10, styles.justifySpaceBetween, styles.alignCenter]}>
                                        <Text style={[styles.fontBlack]}>
                                            Pending : 39
                                        </Text>
                                        <Icon name="md-checkmark-circle" style={[styles.fontXl, styles.fontSuccess]} />
                                    </View>
                                    <View style={[styles.row, styles.padding10, styles.justifySpaceBetween, styles.alignCenter]}>
                                        <Text style={[styles.fontBlack]}>
                                            Pending : 39
                                        </Text>
                                        <Icon name="md-checkmark-circle" style={[styles.fontXl, styles.fontSuccess]} />
                                    </View>
                                    <View style={[styles.row, styles.padding10, styles.justifySpaceBetween, styles.alignCenter]}>
                                        <Text style={[styles.fontBlack]}>
                                            Pending : 39
                                        </Text>
                                        <Icon name="md-checkmark-circle" style={[styles.fontXl, styles.fontSuccess]} />
                                    </View>
                                    <View style={[styles.row, styles.padding10, styles.justifySpaceBetween, styles.alignCenter]}>
                                        <Text style={[styles.fontBlack]}>
                                            Pending : 39
                                        </Text>
                                        <Icon name="md-checkmark-circle" style={[styles.fontXl, styles.fontSuccess]} />
                                    </View>
                                    <View style={[styles.row, styles.padding10, styles.justifySpaceBetween, styles.alignCenter]}>
                                        <Text style={[styles.fontBlack]}>
                                            Pending : 39
                                        </Text>
                                        <Icon name="md-checkmark-circle" style={[styles.fontXl, styles.fontSuccess]} />
                                    </View>
                                    <View style={[styles.row, styles.padding10, styles.justifySpaceBetween, styles.alignCenter]}>
                                        <Text style={[styles.fontBlack]}>
                                            Pending : 39
                                        </Text>
                                        <Icon name="md-checkmark-circle" style={[styles.fontXl, styles.fontSuccess]} />
                                    </View>
                                    <View style={[styles.row, styles.padding10, styles.justifySpaceBetween, styles.alignCenter]}>
                                        <Text style={[styles.fontBlack]}>
                                            Pending : 39
                                        </Text>
                                        <Icon name="md-checkmark-circle" style={[styles.fontXl, styles.fontSuccess]} />
                                    </View>
                                    <View style={[styles.row, styles.padding10, styles.justifySpaceBetween, styles.alignCenter]}>
                                        <Text style={[styles.fontBlack]}>
                                            Pending : 39
                                        </Text>
                                        <Icon name="md-checkmark-circle" style={[styles.fontXl, styles.fontSuccess]} />
                                    </View>
                                    <View style={[styles.row, styles.padding10, styles.justifySpaceBetween, styles.alignCenter]}>
                                        <Text style={[styles.fontBlack]}>
                                            Pending : 40
                                        </Text>
                                        <Icon name="md-checkmark-circle" style={[styles.fontXl, styles.fontSuccess]} />
                                    </View>
                                </Content>
                            </View>
                        </View>
                    </Animated.View>


                </Container>
            </StyleProvider>
        );
    }
}

const stylesa = StyleSheet.create({
    preview: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 100
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        marginTop: 66
    },
    button: {
        padding: 8,
    },
    directionIcon: {
        fontSize: 17,
        color: "#007AFF"
    },
    subView: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
    },
    imageSync: {
        width: 74,
        height: 74,
        resizeMode: 'contain'
    }
});

const style = StyleSheet.create({

});
