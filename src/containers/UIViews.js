
'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'

import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'

import {
    Container,
    Content,
    Header,
    Button,
    Text,
    Left,
    Body,
    Right,
    Icon,
    StyleProvider
} from 'native-base'

import * as profileActions from '../modules/profile/profileActions'
import * as globalActions from '../modules/global/globalActions'

function mapStateToProps(state) {
    return {

    }
};


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...profileActions }, dispatch)
    }
}

class UIViews extends Component {

    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Button full onPress={() => { this.props.actions.navigateToScene('JobDetailsV2') }}>
                        <Text>
                            Job Details
                </Text>
                    </Button>
                </Container>
            </StyleProvider>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UIViews)
