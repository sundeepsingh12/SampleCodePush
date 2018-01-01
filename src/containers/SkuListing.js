'use strict'
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
}
  from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as skuListingActions from '../modules/skulisting/skuListingActions'
import Loader from '../components/Loader'
import SkuListItem from '../components/SkuListItem'
import {
  Container,
  Content,
  Text,
  Footer,
  FooterTab,
  Button,
  Input,
  StyleProvider,
  Header,
  Left,
  Body,
  Right,
  Icon,
  Toast
} from 'native-base'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf'
import _ from 'lodash'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'

class SkuListing extends Component {

  componentDidMount() {
    const fieldAttributeMasterId = this.props.navigation.state.params.currentElement.fieldAttributeMasterId
    const jobId = this.props.navigation.state.params.jobTransaction.jobId
    this.props.prepareSkuList(this.props.navigation.state.params.currentElement.fieldAttributeMasterId, this.props.navigation.state.params.jobTransaction.jobId)
  }

  renderData(item) {
    return (
      <SkuListItem item={item} skuObjectValidation={this.props.skuObjectValidation} updateSkuActualQuantity={this.updateSkuActualQty.bind(this)} />
    )
  }

  updateSkuActualQty(value, parentId) {
    this.props.updateSkuActualQuantityAndOtherData(value, parentId, this.props.skuListItems, this.props.skuChildItems)
  }

  onChangeSkuCode(skuCode) {
    this.props.changeSkuCode(skuCode)
  }

  static navigationOptions = ({ navigation }) => {
    return { header: null }
  }

  render() {
    if (this.props.skuListingLoading) {
      return <Loader />
    }
    else {
      return (
        <StyleProvider style={getTheme(platform)}>
          <Container>
            <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
              <Body>
                <View
                  style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.marginBottom10, styles.marginTop15]}>
                  <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]} onPress={() => { this.props.navigation.goBack(null) }} />
                  <Text
                    style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>SKU</Text>
                  <View />
                </View>
                {/* <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.relative]}>
                <Input
                  placeholder="Filter Reference Numbers"
                  placeholderTextColor={'rgba(255,255,255,.4)'}
                  style={[style.headerSearch]}/>
                <Button small transparent style={[style.headerQRButton]}>
                  <Icon name="md-qr-scanner" style={[styles.fontWhite, styles.fontXl]}/>
                </Button>
              </View> */}
              </Body>

            </Header>

            <Content style={[styles.flex1, styles.padding10, styles.bgLightGray]}>
              <FlatList
                data={_.values(this.props.skuListItems)}
                renderItem={({ item }) => this.renderData(item)}
                keyExtractor={item => _.values(this.props.skuListItems).indexOf(item)}
              />
            </Content>

            {/* {renderIf(this.props.isSearchBarVisible,
            <View style={{ flex: 2, flexDirection: 'row' }}>
              <View style={{ backgroundColor: '#fff', flexGrow: .90, height: 40 }}>
                <Input value={this.props.skuSearchTerm}
                  onChangeText={value => this.onChangeSkuCode(value)}
                  bordered='true'
                  rounded
                  style={{ fontSize: 14, backgroundColor: '#ffffff', borderColor: '#d3d3d3', borderWidth: 1 }}
                  placeholder="Scan Sku Code" />
              </View>
              <View onPress={() => this.scanSkuItem()} style={{ backgroundColor: '#d7d7d7', flexGrow: .10, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name='ios-barcode-outline' style={{ fontSize: 34 }} />
              </View>
            </View>)} */}

            <Footer style={[styles.heightAuto, styles.column, styles.padding10]}>
              <Button primary full onPress={this.saveSkuList}>
                <Text style={[styles.fontLg, styles.fontWhite]}>Proceed</Text>
              </Button>
            </Footer>
          </Container>
        </StyleProvider>
      )
    }
  }

  scanSkuItem() {
    //Code incomplete
    const searchTerm = this.props.skuSearchTerm;
    if (skuSearchTerm) {
      this.props.scanSkuItem(this.props.skuListItems, searchTerm)
    }
  }

  saveSkuList = () => {
    this.props.saveSkuListItems(
      this.props.skuListItems, this.props.skuObjectValidation, this.props.skuChildItems,
      this.props.skuObjectAttributeId, this.props.navigation.state.params.jobTransaction, this.props.navigation.state.params.latestPositionId,
      this.props.navigation.state.params.currentElement, this.props.navigation.state.params.formElements,
      this.props.navigation.state.params.isSaveDisabled, this.props.navigation
    )

  }

}

function mapStateToProps(state) {
  return {
    skuListingLoading: state.skuListing.skuListingLoading,
    skuListItems: state.skuListing.skuListItems,
    isSearchBarVisible: state.skuListing.isSearchBarVisible,
    skuSearchTerm: state.skuListing.skuSearchTerm,
    skuObjectValidation: state.skuListing.skuObjectValidation,
    skuChildItems: state.skuListing.skuChildItems,
    skuObjectAttributeId: state.skuListing.skuObjectAttributeId,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...skuListingActions }, dispatch)
  }
}

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

export default connect(mapStateToProps, skuListingActions)(SkuListing)