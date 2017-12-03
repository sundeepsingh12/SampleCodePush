import React, { Component } from 'react'
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
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import LinearGradient from 'react-native-linear-gradient'
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
function mapStateToProps(state) {
    return {
        jobMasterSummary : state.summary.jobMasterSummary,
        runSheetSummary : state.summary.runSheetSummary,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...summaryActions }, dispatch)
    }
}


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
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
class SummaryListing extends Component {
       
        renderData(status,item) {
            return status.map(function(status, i){
              return(
                <View style={[styles.padding10, {borderBottomColor: '#d3d3d3', borderBottomWidth:1}]} key={i} >
                    <View style={[styles.row, styles.justifySpaceBetween, styles.alignCenter]}>
                        <Text style={[styles.fontLg, styles.fontWeight500]}>
                            {status}
                        </Text>
                        <Text style={[styles.fontDefault, styles.fontWeight500]}>
                            {item[i+1].count}
                        </Text>
                    </View>
                    <View style={[styles.marginTop5, styles.paddingBottom10]}>
                        <FlatList
                            data={item[i+1].list}
                            renderItem={({ item }) => {
                                return (
                                    <Text style={[styles.fontDefault]}>
                                        {item[1]} -  {item[0]}
                                    </Text>
                                )}}
                            keyExtractor={item => item[2]}
                        />
                    </View>
                </View>
              );
            });
          }
    
        render() {
            return (
            <View>
                {this.renderData(this.props.status,this.props.data)}
            </View>
            )
        }
    }

class Summary extends Component {
    static navigationOptions = ({ navigation }) => {
        return { header: null }
      }
    
    constructor (props) {
        super(props);
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            slider1Ref: null
        };
    }

    componentDidMount() {
        this.props.actions.getDataForJobMasterSummaryAndRunSheetSummary()
    }


    _renderItem ({item, index}) {
        
        return (
           
            <View style={[style.slideInnerContainer]}>
                <Text style={[styles.fontCenter, styles.fontWhite]}>{item[0]}</Text>
                <View style={[styles.row, styles.alignCenter, styles.marginTop10]}>
                    <View style={[styles.justifyCenter, {flexBasis: '45%'}]}>
                        <Text style={[styles.fontLeft, styles.fontWhite, styles.fontWeight500]}>Successful</Text>
                    </View>
                    <View style={[styles.justifyCenter, {flexBasis: '10%'}]}>
                        <Text style={[styles.fontCenter, styles.fontWhite]}>-</Text>
                    </View>
                    <View style={[styles.justifyCenter, {flexBasis: '45%'}]}>
                        <Text style={[styles.fontRight, styles.fontWhite, styles.fontWeight500]}>{item[1]}</Text>
                    </View>
                </View>
                <View style={[styles.row, styles.alignCenter, styles.marginTop10]}>
                    <View style={[styles.justifyCenter, {flexBasis: '45%'}]}>
                        <Text style={[styles.fontLeft, styles.fontWhite, styles.fontWeight500]}>Pending</Text>
                    </View>
                    <View style={[styles.justifyCenter, {flexBasis: '10%'}]}>
                        <Text style={[styles.fontCenter, styles.fontWhite]}>-</Text>
                    </View>
                    <View style={[styles.justifyCenter, {flexBasis: '45%'}]}>
                        <Text style={[styles.fontRight, styles.fontWhite, styles.fontWeight500]}>{item[2]}</Text>
                    </View>
                </View>
                <View style={[styles.row, styles.alignCenter, styles.marginTop10]}>
                <View style={[styles.justifyCenter, {flexBasis: '45%'}]}>
                    <Text style={[styles.fontLeft, styles.fontWhite, styles.fontWeight500]}>Failed</Text>
                </View>
                <View style={[styles.justifyCenter, {flexBasis: '10%'}]}>
                    <Text style={[styles.fontCenter, styles.fontWhite]}>-</Text>
                </View>
                <View style={[styles.justifyCenter, {flexBasis: '45%'}]}>
                    <Text style={[styles.fontRight, styles.fontWhite, styles.fontWeight500]}>{item[3]}</Text>
                </View>
            </View>
            <View style={[styles.row, styles.alignCenter, styles.marginTop10]}>
                    <View style={[styles.justifyCenter, {flexBasis: '45%'}]}>
                        <Text style={[styles.fontLeft, styles.fontWhite, styles.fontWeight500]}>Cash Collected</Text>
                    </View>
                    <View style={[styles.justifyCenter, {flexBasis: '10%'}]}>
                        <Text style={[styles.fontCenter, styles.fontWhite]}>-</Text>
                    </View>
                    <View style={[styles.justifyCenter, {flexBasis: '45%'}]}>
                        <Text style={[styles.fontRight, styles.fontWhite, styles.fontWeight500]}>{item[4]}</Text>
                    </View>
                </View>
            </View>
        );
    }

  

    render() {
        const status = ['Pending','Failed','Successful']
        const { slider1ActiveSlide, slider1Ref } = this.state;
        const listData = this.props.jobMasterSummary
        if(listData.length == 0) {
            return (<Loader/>)
        }
        else {
            return (
               <StyleProvider style={getTheme(platform)}>
                   <Container>
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
                        <Content style={[styles.bgLightGray]}>
                            <LinearGradient 
                                colors={[styles.bgPrimary.backgroundColor, styles.shadeColor]}>
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
                                    onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                                    />

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
                            </LinearGradient>                                
                                 <FlatList
                                    data={listData}
                                    renderItem={({ item }) => {
                                        return (
                                            <View style={[styles.margin10, styles.bgWhite, {elevation: 2}]}>
                                            <View style={[style.seqCard, {borderBottomColor: '#d3d3d3', borderBottomWidth:1}]}>
                                                <View style={style.seqCircle}>
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
                                                    <View style={{width: "90%", borderRadius: 5, height: 8, backgroundColor: '#f3f3f3'}}>
                                                        <View style={{width: (item.count) ? String(((item[3].count)*100)/item.count)+"%" : "0%", height: 8, borderRadius: 5, backgroundColor: 'green'}}>

                                                        </View>
                                                    </View>
                                                    <View>
                                                        <Text style={[styles.fontDefault, styles.lineHeight25]}>
                                                            Total Task : {item.count}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                                 <SummaryListing status = {status} data = {item}/>    
                                            </View>                                                             
                                        )}}
                                    keyExtractor={item => item.id}
                                />  
                        </Content>
                   </Container>
               </StyleProvider>
            )
        }
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
        backgroundColor: '#ffcc00',
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
