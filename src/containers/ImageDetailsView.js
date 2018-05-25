
'use strict';
import React, { PureComponent } from 'react';
import { AppRegistry, StyleSheet, Text, View, Image } from 'react-native'
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
    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <View style={{ flex: 1 }}>
                        <Image
                            resizeMethod={'resize'}
                            source={{
                                isStatic: true,
                                uri: 'data:image/jpeg;base64,' + this.props.viewData,
                            }}
                            style={[{ height: '100%', width: '100%', padding: 5 }, styles.flex1]}
                        />
                        <View style={[styles.absolute, styles.padding10, { top: 0, left: 0, flex: 2 }]}>
                            <Icon
                                name="md-close"
                                style={[styles.fontXxxl, styles.fontDarkGray]}
                                onPress={() => {
                                    this.props.navigation.goBack()
                                }} />
                        </View>
                    </View>
                </Container>
            </StyleProvider>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageDetailsView)
