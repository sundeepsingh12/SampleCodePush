'use strict'

import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Container, Content, Footer, FooterTab, Button, StyleProvider, Icon } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle';
import * as qcActions from '../modules/qc/qcActions';
import * as globalActions from '../modules/global/globalActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TitleHeader from '../components/TitleHeader';
import Carousel from 'react-native-snap-carousel';
import Loader from '../components/Loader';
import { PASS, FAIL, OF } from '../lib/ContainerConstants';
import isEmpty from 'lodash/isEmpty';

function mapStateToProps(state) {
    return {
        qcLoading: state.qc.qcLoading,
        qcAttributeMaster: state.qc.qcAttributeMaster,
        qcDataArray: state.qc.qcDataArray,
        qcImageURLDataArray: state.qc.qcImageURLDataArray
    }
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...qcActions }, dispatch)
    }
}

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const sliderWidth = viewportWidth;
const itemWidth = wp(100);
const SLIDER_1_FIRST_ITEM = 0;

class QCAttribute extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            imageURLIndex: 1
        }
    }

    static navigationOptions = ({ navigation }) => {
        return { header: <TitleHeader pageName={navigation.state.params.currentElement.label} goBack={navigation.goBack} /> }
    }

    componentDidMount() {
        this.props.actions.getQcData({ currentElement: this.props.navigation.state.params.currentElement, formLayoutState: this.props.navigation.state.params.formLayoutState, jobTransaction: this.props.navigation.state.params.jobTransaction })
    }

    renderItem({ item, index }) {
        return (
            <View>
                {/* images for carousel */}
                <View style={[styles.relative, styles.alignCenter, styles.justifyCenter, { height: 200 }]}>
                    <Image
                        style={{ resizeMode: 'contain', width: '100%', height: '100%', marginLeft: -20, marginRight: 20 }}
                        source={{ uri: item }}
                    />
                </View>
            </View>)
    }

    renderCrouselView() {
        return (
            <Carousel
                ref={(c) => { }}
                data={this.props.qcImageURLDataArray}
                renderItem={this.renderItem}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                firstItem={SLIDER_1_FIRST_ITEM}
                inactiveSlideScale={1}
                inactiveSlideOpacity={0.7}
                enableMomentum={false}
                loop={false}
                onSnapToItem={(index) => this.setState({ imageURLIndex: index + 1 })}
            />
        )
    }

    changeQCResult(item, value) {
        if (value && !item.qcResult) {
            this.props.actions.changeQCResult(item.objectId, value, this.props.qcDataArray)
        } else if (!value && item.qcResult) {
            this.props.actions.changeQCResult(item.objectId, value, this.props.qcDataArray)
        }
    }

    renderData(item) {
        return (
            <View>
                <View style={[styles.row, styles.flex1, styles.paddingTop20]}>
                    <View style={[styles.flexBasis60]}>
                        <Text style={[styles.fontLg, styles.flex1, styles.flexWrap, { fontWeight: "bold" }]}>{item.qcLabel}</Text>
                        <Text style={[styles.marginTop5]} >{item.qcValue}</Text>
                    </View>
                    <View style={[styles.row, { marginLeft: 'auto' }]}>
                        <TouchableOpacity onPress={() => this.changeQCResult(item, false)} style={style.iconContainer}>
                            <View style={[styles.marginRight10]}>
                                <Icon name={item.qcResult ? "ios-close-circle-outline" : "ios-close-circle"} style={[styles.fontXl, styles.fontDarkGray, styles.fontXxl]} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.changeQCResult(item, true)} style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <View style={[styles.marginRight10]}>
                                <Icon name={item.qcResult ? "ios-checkmark-circle" : "ios-checkmark-circle-outline"} style={[styles.fontXl, styles.fontDarkGray, styles.fontXxl]} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.bgGray, styles.marginTop20, { height: 1, width: '100%' }]}>
                </View>
            </View>
        )
    }

    render() {
        if (this.props.qcLoading) {
            return <Loader />
        }
        if (isEmpty(this.props.qcDataArray)) {
            return <View></View>
        }
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Content style={[styles.flex1, styles.bgWhite, styles.padding10]}>
                        <View>
                            {
                                isEmpty(this.props.qcImageURLDataArray) ? null : <View style={[styles.relative]}>
                                    {this.renderCrouselView()}
                                    <View style={[styles.absolute, styles.paddingHorizontal10, styles.paddingVertical5, { bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,.4)', borderTopLeftRadius: 5 }]}>
                                        <Text style={[styles.fontWhite, styles.fontLg]}>
                                            {this.state.imageURLIndex} {OF} {this.props.qcImageURLDataArray.length}
                                        </Text>
                                    </View>
                                </View>
                            }
                            <View>
                                <View style={[styles.marginTop10]}>
                                    <Text>{this.props.qcAttributeMaster.label}</Text>
                                </View>
                                <FlatList
                                    data={this.props.qcDataArray}
                                    renderItem={({ item }) => this.renderData(item)}
                                    keyExtractor={item => '' + item.objectId}
                                />
                            </View>
                        </View>
                    </Content>
                    <Footer style={[styles.footer]}>
                        <FooterTab style={[styles.padding10]}>
                            <Button danger full onPress={() => this.props.actions.saveQCDataAndNavigate(false, { qcDataArray: this.props.qcDataArray, qcAttributeMaster: this.props.qcAttributeMaster }, { jobTransaction: this.props.navigation.state.params.jobTransaction, formLayoutState: this.props.navigation.state.params.formLayoutState })}>
                                <Text style={[styles.fontLg, styles.fontWhite]}>{this.props.qcAttributeMaster && this.props.qcAttributeMaster.qcValidationMap && this.props.qcAttributeMaster.qcValidationMap.qcFailButtonTextValidation ? this.props.qcAttributeMaster.qcValidationMap.qcFailButtonTextValidation : FAIL}</Text>
                            </Button>
                            <Button success full onPress={() => this.props.actions.saveQCDataAndNavigate(true, { qcDataArray: this.props.qcDataArray, qcAttributeMaster: this.props.qcAttributeMaster }, { jobTransaction: this.props.navigation.state.params.jobTransaction, formLayoutState: this.props.navigation.state.params.formLayoutState })} style={[styles.marginLeft10]}>
                                <Text style={[styles.fontLg, styles.fontWhite]}>{this.props.qcAttributeMaster && this.props.qcAttributeMaster.qcValidationMap && this.props.qcAttributeMaster.qcValidationMap.qcPassButtonTextValidation ? this.props.qcAttributeMaster.qcValidationMap.qcPassButtonTextValidation : PASS}</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </Container>
            </StyleProvider>
        )
    }
}

const style = StyleSheet.create({
    iconContainer: {
        paddingRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

});
export default connect(mapStateToProps, mapDispatchToProps)(QCAttribute)