/**
 * # Main.js
 *  This is the main app screen
 *
 */
'use strict'
/*
 * ## Imports
 *
 * Imports from redux
 */
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

/**
 * The actions we need
 */
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Preloader from '../containers/Preloader'
import Loader from '../components/Loader'
import ResyncLoader from '../components/ResyncLoader'

/**
 * The components needed from React
 */
import React, {Component} from 'react'
import {StyleSheet, View, Image, TouchableHighlight} from 'react-native'

import {
  Container,
  Content,
  Header,
  Button,
  Text,
  Input,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Icon,
  Footer,
  CheckBox,
  StyleProvider
} from 'native-base';

import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import * as homeActions from '../modules/home/homeActions'
import * as globalActions from '../modules/global/globalActions'

function mapStateToProps(state) {
  return {}
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...globalActions,
      ...homeActions
    }, dispatch)
  }
}

/**
 * ## App class
 */
class SkuDetails extends Component {

  static navigationOptions = ({navigation}) => {
    return {header: null}
  }

  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
            <Body>
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.marginBottom10, styles.marginTop15]}>
                <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]}/>
                <Text
                  style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>SKU</Text>
                <View/>
              </View>
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.relative]}>
                <Input
                  placeholder="Filter Reference Numbers"
                  placeholderTextColor={'rgba(255,255,255,.4)'}
                  style={[style.headerSearch]}/>
                <Button small transparent style={[style.headerQRButton]}>
                  <Icon name="md-qr-scanner" style={[styles.fontWhite, styles.fontXl]}/>
                </Button>
              </View>
            </Body>

          </Header>
          <Content style={[styles.flex1, styles.padding10, styles.bgLightGray]}>
            {/*card 1*/}
            <View style={[style.card, styles.row]}>
              {/*Left Wrapper*/}
              <View style={[style.cardLeft]}>
                <View style={[style.cardLeftTopRow]}>
                  <Text
                    style={[styles.flexBasis40, styles.fontSm, styles.paddingTop10, styles.paddingBottom10, styles.paddingRight10]}>SKU Code</Text>
                  <Text style={[styles.flexBasis60, styles.fontDefault, styles.padding10]}>235436547</Text>
                </View>
                <View style={[styles.row]}>
                  <Text
                    style={[styles.flexBasis40, styles.fontSm, styles.paddingTop10, styles.paddingBottom10, styles.paddingRight10]}>SKU Code</Text>
                  <Text style={[styles.flexBasis60, styles.fontDefault, styles.padding10]}>235436547</Text>
                </View>
              </View>

              {/*Right Wrapper*/}
              <View style={[style.cardRight]}>
                <CheckBox checked={true} style={[style.cardCheckbox]}/>
              </View>
            </View>

            {/*card 2*/}
            <View style={[style.card, styles.row]}>
              {/*Left Wrapper*/}
              <View style={[style.cardLeft]}>
                <View style={[style.cardLeftTopRow]}>
                  <Text
                    style={[styles.flexBasis40, styles.fontSm, styles.paddingTop10, styles.paddingBottom10, styles.paddingRight10]}>SKU Code</Text>
                  <Text style={[styles.flexBasis60, styles.fontDefault, styles.padding10]}>235436547</Text>
                </View>
                <View style={[styles.row]}>
                  <Text
                    style={[styles.flexBasis40, styles.fontSm, styles.paddingTop10, styles.paddingBottom10, styles.paddingRight10]}>SKU Code</Text>
                  <Text style={[styles.flexBasis60, styles.fontDefault, styles.padding10]}>235436547</Text>
                </View>
              </View>

              {/*Right Wrapper*/}
              <View style={[style.cardRight]}>
                <CheckBox checked={false} style={[style.cardCheckbox]}/>
              </View>
            </View>

          </Content>
          <Footer
            style={[styles.heightAuto, styles.column, styles.padding10]}>
            <Text
              style={[styles.fontSm, styles.marginBottom10]}>Total Count : 9</Text>
            <Button primary full>
              <Text style={[styles.fontLg, styles.fontWhite]}>Save</Text>
            </Button>
          </Footer>
        </Container>
      </StyleProvider>

    )
  }

};

const style = StyleSheet.create({
  header: {
    borderBottomWidth: 0,
    height: 'auto',
    paddingTop: 10,
    paddingBottom: 10
  },
  headerIcon: {
    width: 24
  },
  headerSearch: {
    paddingLeft: 10,
    paddingRight: 30,
    backgroundColor: '#1260be',
    borderRadius: 2,
    height: 30,
    color: '#fff',
    fontSize: 10
  },
  headerQRButton: {
    position: 'absolute',
    right: 5,
    paddingLeft: 0,
    paddingRight: 0
  },
  card: {
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowColor: '#d3d3d3',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  cardLeft: {
    flex: 0.85,
    borderRightColor: '#f3f3f3',
    borderRightWidth: 1
  },
  cardLeftTopRow: {
    flexDirection: 'row',
    borderBottomColor: '#f3f3f3',
    borderBottomWidth: 1
  },
  cardRight: {
    width: 40,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardCheckbox: {
    alignSelf: 'center',
    backgroundColor: 'green',
    position: 'absolute',
    marginLeft: 10,
    borderRadius: 0,
    left: 0
  }

});

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(SkuDetails)
