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
  StyleProvider,
  List,
  ListItem,
  Footer,
  FooterTab
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

class JobDetailsV2 extends Component {
  static navigationOptions = ({ navigation }) => {
    return { header: null }
  }

  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container style={[styles.bgLightGray]}>
          <Header style={[style.header]}>
            <View style={style.seqCard}>
              <View style={style.seqCircle}>
                <Text style={[styles.fontWhite, styles.fontCenter, styles.fontLg]}>
                  PKUP
                </Text>
              </View>
              <View style={style.seqCardDetail}>
                <View>
                  <Text style={[styles.fontDefault, styles.fontWeight500, styles.lineHeight25]}>
                    dsaf
                  </Text>
                  <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20]}>
                    Plot 345, Saket
                  </Text>
                  <Text
                    style={[styles.fontSm, styles.italic, styles.fontWeight300, styles.lineHeight20]}>
                    Express Delivery · Paid
                  </Text>
                </View>
                <View
                  style={{
                  width: 30,
                  alignSelf: 'flex-start'
                }}>
                  <Icon
                    name="md-close"
                    style={[styles.fontXl, styles.fontBlack, styles.fontXxl]}/>
                </View>
              </View>
            </View>
          </Header>

          <Content>
            
            <View style={[styles.marginTop10, styles.bgWhite]}>
              <List>
                <ListItem style={[style.jobListItem, styles.justifySpaceBetween]} >
                  
                  <View style={[styles.row, styles.alignCenter]}>
                    <View style={[style.statusCircle, {backgroundColor: '#4cd964'}]}></View>
                    <Text style={[styles.fontDefault, styles.fontWeight500, styles.marginLeft10]}>Deliver</Text>
                  </View>
                  <Right>
                    <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontLightGray]} />
                  </Right>
                </ListItem>
              </List>
              <List>
                <ListItem style={[style.jobListItem, styles.justifySpaceBetween]} >
                  
                  <View style={[styles.row, styles.alignCenter]}>
                    <View style={[style.statusCircle, {backgroundColor: '#4cd964'}]}></View>
                    <Text style={[styles.fontDefault, styles.fontWeight500, styles.marginLeft10]}>Fail</Text>
                  </View>
                  <Right>
                    <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontLightGray]} />
                  </Right>
                </ListItem>
              </List>
              <List>
                <ListItem style={[style.jobListItem, styles.justifySpaceBetween]} >
                  
                  <View style={[styles.row, styles.alignCenter]}>
                    <View style={[style.statusCircle, {backgroundColor: '#4cd964'}]}></View>
                    <Text style={[styles.fontDefault, styles.fontWeight500, styles.marginLeft10]}>Cancelled</Text>
                  </View>
                  <Right>
                    <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontLightGray]} />
                  </Right>
                </ListItem>
              </List>
            </View>

            {/*Basic Details*/}
            <View style={[styles.bgWhite, styles.marginTop10, styles.padding10]}>
              <Text style={[styles.fontLg, styles.fontBlack, styles.bold]}>Basic Details</Text>
              
              
              <List>
                <View style={[styles.row]}>
                  <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                    <Text style={[styles.fontDefault]}>Customer Name</Text>
                  </View>
                  <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                    <Text style={[styles.fontDefault, styles.fontBlack]}>Gaurav</Text>
                  </View>
                </View>
                <View style={[styles.row]}>
                  <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                    <Text style={[styles.fontDefault]}>Customer Name</Text>
                  </View>
                  <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                    <Text style={[styles.fontDefault, styles.fontBlack]}>Gaurav</Text>
                  </View>
                </View>
                <View style={[styles.row]}>
                  <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                    <Text style={[styles.fontDefault]}>Customer Details</Text>
                  </View>
                  <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                    <Text style={[styles.fontDefault, styles.fontPrimary]}>Tap to View</Text>
                  </View>
                </View>
                <View style={[styles.marginTop5, styles.marginBottom5,]}>
                  <View style={[styles.row, styles.paddingLeft5, styles.paddingRight5, styles.bgLightGray]}>
                    <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                      <Text style={[styles.fontDefault]}>Customer Name</Text>
                    </View>
                    <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                      <Text style={[styles.fontDefault, styles.fontBlack]}>Rose Ballard</Text>
                    </View>
                  </View>
                  <View style={[styles.row, styles.paddingLeft5, styles.paddingRight5, styles.bgLightGray]}>
                    <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                      <Text style={[styles.fontDefault]}>Phone</Text>
                    </View>
                    <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                      <Text style={[styles.fontDefault, styles.fontBlack]}>9899999292</Text>
                    </View>
                  </View>
                  <View style={[styles.row, styles.paddingLeft5, styles.paddingRight5, styles.bgLightGray]}>
                    <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                      <Text style={[styles.fontDefault]}>Email</Text>
                    </View>
                    <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                      <Text style={[styles.fontDefault, styles.fontBlack]}>rose@fareye.in</Text>
                    </View>
                  </View>
                </View>
              </List>
            </View>

            {/*Payment Details*/}
            <View style={[styles.bgWhite, styles.marginTop10, styles.padding10]}>
              <Text style={[styles.fontLg, styles.fontBlack, styles.bold]}>Payment Details</Text>
              
              <List style={[styles.row]}>
                <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                  <Text style={[styles.fontDefault]}>Customer Name</Text>
                </View>
                <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                  <Text style={[styles.fontDefault]}>Rose Ballard</Text>
                </View>
              </List>
              <List style={[styles.row]}>
                <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                  <Text style={[styles.fontDefault]}>Customer Name</Text>
                </View>
                <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                  <Text style={[styles.fontDefault]}>Rose Ballard</Text>
                </View>
              </List>
              <List style={[styles.row]}>
                <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                  <Text style={[styles.fontDefault]}>Customer Name</Text>
                </View>
                <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                  <Text style={[styles.fontDefault]}>Rose Ballard</Text>
                </View>
              </List>
            </View>
          </Content>
          <Footer style={[style.footer]}>
            <FooterTab>
              <Button full style={[styles.bgWhite]}>
                <Icon name="md-call" style={[styles.fontLg, styles.fontBlack]} />
              </Button>
            </FooterTab>
            <FooterTab>
              <Button full>
                <Icon name="md-map" style={[styles.fontLg, styles.fontBlack]} />
              </Button>
            </FooterTab>
          </Footer>

        </Container>
      </StyleProvider>
    )
  }
}


const style = StyleSheet.create({
  //  styles.column, styles.paddingLeft0, styles.paddingRight0, {height: 'auto'}
  header: {
    flexDirection: 'column',
    paddingLeft: 0,
    paddingRight: 0,
    height: 'auto',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3'
  },
  headerIcon: {
    fontSize: 18
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
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  jobListItem: {
    borderBottomColor: '#f2f2f2', 
    borderBottomWidth: 1, 
    paddingTop: 20, 
    paddingBottom: 20
  },
  statusCircle: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  footer: {
    height: 'auto',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f3f3',
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(JobDetailsV2)
