'use strict'

import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Container, Content, Footer, FooterTab, Input, Button, Item, CheckBox, StyleProvider, Icon } from 'native-base';
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
import { PASS, FAIL, CHECKLIST } from '../lib/ContainerConstants'
import { SET_QC_MODAL_VIEW } from '../lib/constants'
import QCModal from './QCModal'

function mapStateToProps(state) {
    return {
        qcLoading: state.qc.qcLoading,
        qcAttributeMaster: state.qc.qcAttributeMaster,
        qcDataArray: state.qc.qcDataArray,
        qcModal: state.qc.qcModal
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

    static navigationOptions = ({ navigation }) => {
        return { header: <TitleHeader pageName={navigation.state.params.currentElement.label} goBack={navigation.goBack} /> }
    }

    componentDidMount() {
        this.props.actions.getQcData({ currentElement: this.props.navigation.state.params.currentElement, formLayoutState: this.props.navigation.state.params.formLayoutState, jobTransaction: this.props.navigation.state.params.jobTransaction })
    }

    renderItem() {
        return (
            <View>
                {/* images for carousel */}
                <View style={[styles.relative, styles.alignCenter, styles.justifyCenter, { height: 200 }]}>
                    <Image
                        style={{ resizeMode: 'contain', width: '100%', height: '100%', marginLeft: -20 }}
                        source={{ uri: 'https://wallpaperbrowse.com/media/images/3848765-wallpaper-images-download.jpg' }}
                    />

                </View>
            </View>)
    }

    renderCrouselView() {
        return (
            <Carousel
                ref={(c) => {}}
                data={['a', 'b', 'c']}
                renderItem={this.renderItem}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                firstItem={SLIDER_1_FIRST_ITEM}
                inactiveSlideScale={1}
                inactiveSlideOpacity={0.7}
                enableMomentum={false}
                loop={false}
                onSnapToItem={(index) => console.log('on snap', index)}
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

    passFailAction(isEventPass) {
        if (this.props.qcAttributeMaster.qcImage) {
            this.props.actions.setState(SET_QC_MODAL_VIEW, { qcModal: isEventPass ? PASS : FAIL });
        }
        if (isEventPass) {
            if (this.props.qcAttributeMaster.qcPassRemarks) {
                let failList = this.props.qcDataArray.filter(qcObject => !qcObject.qcResult)
                if (failList.length > 0) {
                    this.props.actions.setState(SET_QC_MODAL_VIEW, { qcModal: PASS });
                } else {
                    console.log('navigate to summary');
                }
            }
        } else {
            if (this.props.qcAttributeMaster.qcFailReasons) {
                this.props.actions.setState(SET_QC_MODAL_VIEW, { qcModal: FAIL });
            } else {
                console.log('navigate to summary');
            }
        }
    }

    render() {
        console.log('qc attribute render', this.props)
        if (this.props.qcLoading) {
            return <Loader />
        }
        if (_.isEmpty(this.props.qcDataArray)) {
            return <View></View>
        }
        // let flatlistData = _.sortBy(this.props.qcDataArray, function (object) { return object.qcSequence })
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    {(this.props.qcModal) ? <QCModal qcDataArray={this.props.qcDataArray} qcAttributeMaster={this.props.qcAttributeMaster} qcPassFail={this.props.qcModal} jobTransaction={this.props.navigation.state.params.jobTransaction} /> : null}
                    <Content style={[styles.flex1, styles.bgWhite, styles.padding10]}>
                        <View>
                            <View style={[styles.relative]}>
                                {this.renderCrouselView()}
                                <Text style={[styles.absolute, styles.paddingHorizontal5, styles.fontWhite, styles.fontDefault, { bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,.4)', borderTopLeftRadius: 5 }]}>
                                    1 of 4
                                </Text>
                            </View>
                            <View>
                                <View style={[styles.marginTop10]}>
                                    <Text>{CHECKLIST}</Text>
                                </View>
                                <FlatList
                                    data={this.props.qcDataArray}
                                    renderItem={({ item }) => this.renderData(item)}
                                    keyExtractor={item => '' + item.objectId}
                                />
                            </View>
                        </View>
                    </Content>
                    <SafeAreaView style={[styles.bgWhite]}>
                        <Footer style={[styles.footer]}>
                            <FooterTab style={[styles.padding10]}>
                                <Button danger full
                                    onPress={() => this.passFailAction(false)}
                                    disabled={false}>
                                    <Text style={[styles.fontLg, styles.fontWhite]}>{this.props.qcAttributeMaster && this.props.qcAttributeMaster.qcFailButtonText ? this.props.qcAttributeMaster.qcFailButtonText : FAIL}</Text>
                                </Button>
                                <Button success full
                                    onPress={() => this.passFailAction(true)}
                                    style={[styles.marginLeft10]}
                                    disabled={false}>
                                    <Text style={[styles.fontLg, styles.fontWhite]}>{this.props.qcAttributeMaster && this.props.qcAttributeMaster.qcPassButtonText ? this.props.qcAttributeMaster.qcPassButtonText : PASS}</Text>
                                </Button>
                            </FooterTab>
                        </Footer>
                    </SafeAreaView>
                </Container>
            </StyleProvider>
        )
    }
}

const style = StyleSheet.create({

    paymentCard: {
        width: '49%',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderWidth: 1,
        marginBottom: 5,
        justifyContent: 'space-between'
    },
    paymentList: {
        borderBottomColor: '#ECECEC',
        borderBottomWidth: 1,
        paddingVertical: 15,
        width: '100%',
        justifyContent: 'space-between'
    },
    footer: {
        height: 'auto',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3'
    },
    iconContainer: {
        paddingRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

});
export default connect(mapStateToProps, mapDispatchToProps)(QCAttribute)