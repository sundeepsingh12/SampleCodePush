import React, { PureComponent } from 'react'
import {
    StyleSheet,
    Dimensions,
    Platform,
    View,
    FlatList,
    TouchableHighlight,
    TouchableOpacity
}
    from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as summaryActions from '../modules/summary/summaryActions'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import LinearGradient from 'react-native-linear-gradient'
import * as globalActions from '../modules/global/globalActions'
import Loader from '../components/Loader'
import {
    Container,
    Content,
    List,
    ListItem,
    Header,
    Button,
    Text,
    Body,
    Icon,
    StyleProvider
} from 'native-base';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { RESET_SUMMARY_STATE } from '../lib/constants'
function mapStateToProps(state) {
    return {
        jobMasterSummary: state.summary.jobMasterSummary,
        runSheetSummary: state.summary.runSheetSummary,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...summaryActions, ...globalActions }, dispatch)
    }
}


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.4;

// slider width 
const slideWidth = wp(100);

// Margin from last slide when scroll
const itemHorizontalMargin = wp(10);

// getting slider width
const sliderWidth = viewportWidth;
const itemWidth = slideWidth;


const SLIDER_1_FIRST_ITEM = 0;
class SummaryListing extends PureComponent {

    renderData(status, item) {
        return status.map(function (status, i) {
            return (
                <View style={[styles.padding10, { borderBottomColor: '#d3d3d3', borderBottomWidth: 1 }]} key={String(i)}>
                    <View style={[styles.row, styles.justifySpaceBetween, styles.alignCenter]}>
                        <Text style={[styles.fontLg, styles.fontWeight500]}>
                            {status}
                        </Text>
                        <Text style={[styles.fontDefault, styles.fontWeight500]}>
                            {item[i + 1].count}
                        </Text>
                    </View>
                    <View style={[styles.marginTop5]}>
                        <FlatList
                            data={item[i + 1].list}
                            extraData={this.state}
                            renderItem={({ item }) => {
                                return (
                                    <Text style={[styles.fontDefault]}>
                                        {item.name} -  {item.count}
                                    </Text>
                                )
                            }}
                            listKey={(items) => String(items.id)}
                            keyExtractor={(items) => String(items.id)}
                        />
                    </View>
                </View>
            );
        });
    }

    renderDataForCollection(data) {
        let collectionMode = ['cashCollected', 'cashCollectedByCard', 'cashPayment']
        return collectionMode.map(function (collectionMode, i) {
            return (
                (data[collectionMode] > 0) ?
                    <View style={[styles.padding10, { borderBottomColor: '#d3d3d3', borderBottomWidth: 1 }]} key={String(i)}>
                        <View style={[styles.row, styles.justifySpaceBetween, styles.alignCenter]}>
                            <Text style={[styles.fontLg, styles.fontWeight500]}>
                                {collectionMode}
                            </Text>
                            <Text style={[styles.fontDefault, styles.fontWeight500]}>
                                {data[collectionMode]}
                            </Text>
                        </View>
                    </View> : null
            )
        })
    }

    render() {
        return (
            <View>
                {this.renderData(this.props.status, this.props.data)}
                {this.renderDataForCollection(this.props.data)}
            </View>
        )
    }
}

class Summary extends PureComponent {
    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    constructor(props) {
        super(props);
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            slider1Ref: null
        };
    }

    componentDidMount() {
        this.props.actions.getDataForJobMasterSummaryAndRunSheetSummary()
    }

    componentWillUnmount() {
        this.props.actions.setState(RESET_SUMMARY_STATE)
    }

    _renderItem({ item, index }) {
        const runSheetCount = ['Successful', 'Pending', 'Failed', 'Cash Collected']
        let runSheetView = runSheetCount.map((name => <View key={runSheetCount.indexOf(name)} style={[styles.row, styles.alignCenter, styles.marginTop10, styles.bgTransparent]}>
            <View style={[styles.justifyCenter, { flexBasis: '45%' }]}>
                <Text style={[styles.fontLeft, styles.fontWhite, styles.fontWeight500]}>{name}</Text>
            </View>
            <View style={[styles.justifyCenter, { flexBasis: '10%' }]}>
                <Text style={[styles.fontCenter, styles.fontWhite]}>-</Text>
            </View>
            <View style={[styles.justifyCenter, { flexBasis: '45%' }]}>
                <Text style={[styles.fontRight, styles.fontWhite, styles.fontWeight500]}>{item[runSheetCount.indexOf(name) + 1]}</Text>
            </View>
        </View>))
        return (
            <View style={[style.slideInnerContainer]}>
                <Text style={[styles.fontCenter, styles.fontWhite, styles.bgTransparent, styles.marginBottom10]}>{item[0]}</Text>
                {runSheetView}
            </View>
        );
    }

    _renderHeader() {
        return (
            <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
                <Body>
                    <View
                        style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                        <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                            <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                        </TouchableOpacity>
                        <View style={[style.headerBody]}>
                            <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter, styles.fontWeight500]}>Summary</Text>
                        </View>
                        <View style={[style.headerRight]}>
                        </View>
                        <View />
                    </View>
                </Body>
            </Header>
        )
    }

    _renderCrouselView() {
        return (
            <Carousel
                ref={(c) => { if (!this.state.slider1Ref) { this.setState({ slider1Ref: c }); } }}
                data={this.props.runSheetSummary}
                renderItem={this._renderItem}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                firstItem={SLIDER_1_FIRST_ITEM}
                inactiveSlideScale={1}
                inactiveSlideOpacity={0.7}
                enableMomentum={false}
                loop={false}
                onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
            />
        )
    }

    _renderPagination() {
        const { slider1ActiveSlide, slider1Ref } = this.state;
        return (
            <Pagination
                dotsLength={this.props.runSheetSummary.length}
                activeDotIndex={slider1ActiveSlide}
                containerStyle={style.paginationContainer}
                dotColor={'rgb(255, 255, 255)'}
                dotStyle={style.paginationDot}
                inactiveDotColor={'rgb(255, 255, 255)'}
                inactiveDotOpacity={0.4}
                inactiveDotScale={1}
                carouselRef={slider1Ref}
                tappableDots={!!slider1Ref}
            />
        )
    }
    _renderCrousel() {
        if (this.props.runSheetSummary && this.props.runSheetSummary.length == 0) {
            return (<Text style={[styles.padding20, styles.fontCenter, styles.fontWhite]}>No RunSheet Available</Text>)
        }
        return (
            <View>
                {this._renderCrouselView()}
                {this._renderPagination()}
            </View>
        )
    }
    _renderJobMasterView(item) {
        return (
            <View style={[style.seqCard, { borderBottomColor: '#d3d3d3', borderBottomWidth: 1 }]}>
                <View style={[style.seqCircle, { backgroundColor: item.identifierColor }]}>
                    <Text style={[styles.fontWhite, styles.fontCenter, styles.fontLg]}>
                        {item.code}
                    </Text>
                </View>
                <View style={style.seqCardDetail}>
                    <View>
                        <Text style={[styles.fontDefault, styles.fontWeight500, styles.paddingTop10, styles.paddingBottom10]}>
                            {item.title}
                        </Text>
                    </View>
                    <View style={{ width: "90%", borderRadius: 5, height: 8, backgroundColor: '#f3f3f3' }}>
                        <View style={{ width: (item.count > 0) ? String(((item[3].count + item[2].count) * 100) / item.count) + "%" : "0%", height: 8, borderRadius: 5, backgroundColor: 'green' }}>

                        </View>
                    </View>
                    <View>
                        <Text style={[styles.fontDefault, styles.lineHeight25]}>
                            Total Task : {item.count}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    _renderView = () => {
        const status = ['Pending', 'Failed', 'Successful']
        const listData = this.props.jobMasterSummary
        listData.sort((master1, master2) => master1.title.toLowerCase().localeCompare(master2.title.toLowerCase()))
        if (this.props.jobMasterSummary && this.props.jobMasterSummary.length == 0) {
            return <Loader />
        }
        return (
            <Content style={[styles.bgLightGray]}>
                <LinearGradient 
                colors={[styles.bgPrimary.backgroundColor, styles.shadeColor]}> 
                { this._renderCrousel() } 
                </LinearGradient>
                <FlatList
                    data={listData}
                    renderItem={({ item }) => {
                        return (
                            <View style={[styles.margin10, styles.bgWhite, { elevation: 2 }]}>
                                {this._renderJobMasterView(item)}
                                <SummaryListing status={status} data={item} />
                            </View>
                        )
                    }
                    }
                    keyExtractor={item => String(item.id)}
                />
            </Content>
        )
    }

    render() {
        const headerView = this._renderHeader()
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    {headerView}
                    {this._renderView()}
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
    seqCard: {
        minHeight: 70,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        backgroundColor: '#ffffff'
    },
    seqCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center'
    },
    seqCardDetail: {
        flex: 1,
        minHeight: 70,
        paddingBottom: 10,
        marginLeft: 15,
    },
    slideInnerContainer: {
        width: itemWidth,
        padding: 10
    },
    paginationContainer: {
        width: '100%',
        paddingTop: 10,
        paddingBottom: 15
    },
    paginationDot: {
        width: 5,
        height: 5,
        borderRadius: 2,
    }

});
export default connect(mapStateToProps, mapDispatchToProps)(Summary)
