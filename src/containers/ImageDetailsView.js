
'use strict';
import React, { PureComponent } from 'react';
import { AppRegistry, StyleSheet, Text, View, Image } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { Container, Content, Header, Left, Body, Right, Icon, Footer, StyleProvider, Button, } from 'native-base';
import * as cameraActions from '../modules/camera/cameraActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import platform from '../../native-base-theme/variables/platform'
import getTheme from '../../native-base-theme/components'
import styles from '../themes/FeStyle'

function mapStateToProps(state) {
    return {
        viewData: state.cameraReducer.viewData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...cameraActions }, dispatch)
    }
}
class ImageDetailsView extends PureComponent {

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }
    componentDidMount() {
        this.props.actions.getImageData(this.props.navigation.state.params.value)
    }
    componentWillUnmount() {
        this.props.actions.setInitialState()
    }

    getImageView() {
        if (this.props.viewData) {
            return <Image
                resizeMethod={'resize'}
                source={{
                    isStatic: true,
                    uri: 'data:image/jpeg;base64,' + this.props.viewData,
                }}
                style={[{ height: '100%', width: '100%', padding: 5 }, styles.flex1]}
            />
        } else {
            let view =
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Text style={[styles.margin30, styles.fontXl, styles.fontDarkGray]}>Image Not Available</Text>
                </View>
            return view
        }
    }
    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <View style={{ flex: 1 }}>
                        {this.getImageView()}
                        <SafeAreaView style={[styles.absolute, styles.padding10, { top: 0, left: 0, flex: 2 }]}>
                            <View>
                                <Icon
                                    name="md-close"
                                    style={[styles.fontXxxl, styles.fontDarkGray]}
                                    onPress={() => {
                                        this.props.navigation.goBack()
                                    }} />
                            </View>
                        </SafeAreaView>
                    </View>
                </Container>
            </StyleProvider>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageDetailsView)
