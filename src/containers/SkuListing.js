'use strict'
import React, { PureComponent } from 'react'
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
import * as globalActions from '../modules/global/globalActions'
import SearchBarV2 from '../components/SearchBarV2'
import { SEARCH_PLACE_HOLDER } from '../lib/ContainerConstants'
import { SET_SKU_CODE, SKU_CODE_CHANGE } from '../lib/constants'
class SkuListing extends PureComponent {

  componentDidMount() {
    const fieldAttributeMasterId = this.props.navigation.state.params.currentElement.fieldAttributeMasterId
    const jobId = this.props.navigation.state.params.jobTransaction.jobId
    this.props.actions.prepareSkuList(this.props.navigation.state.params.currentElement.fieldAttributeMasterId, this.props.navigation.state.params.jobTransaction.jobId)
  }

  renderData(item) {
    return (
      <SkuListItem item={item} skuObjectValidation={this.props.skuObjectValidation} updateSkuActualQuantity={this.updateSkuActualQty.bind(this)} reasonsList={this.props.reasonsList} navigateToScene={this.props.actions.navigateToScene.bind(this)} />
    )
  }

  updateSkuActualQty(value, rowItem) {
    this.props.actions.updateSkuActualQuantityAndOtherData(value, rowItem, this.props.skuListItems, this.props.skuChildItems, this.props.skuValidationForImageAndReason)
  }

  onChangeSkuCode(skuCode) {
    this.props.actions.setState(SKU_CODE_CHANGE, skuCode)
  }

  static navigationOptions = ({ navigation }) => {
    return { header: null }
  }

  setSearchText = (searchText) => {
    this.props.actions.setState(SET_SKU_CODE, searchText)
  }

  returnValue = (searchText) => {
    this.setSearchText(searchText)
    this.props.actions.scanSkuItem({
      skuListItems: this.props.skuListItems,
      searchText,
      skuObjectValidation: this.props.skuObjectValidation,
      skuValidationForImageAndReason: this.props.skuValidationForImageAndReason,
      skuChildItems: this.props.skuChildItems
    })
  }

  searchIconPressed = () => {
    if (this.props.searchText) {
      this.props.actions.scanSkuItem({
        skuListItems: this.props.skuListItems,
        searchText: this.props.searchText,
        skuObjectValidation: this.props.skuObjectValidation,
        skuValidationForImageAndReason: this.props.skuValidationForImageAndReason,
        skuChildItems: this.props.skuChildItems
      })
    }
  }

  render() {
    if (this.props.skuListingLoading) {
      return <Loader />
    }
    else {
      return (
        <StyleProvider style={getTheme(platform)}>
          <Container>
            <Header searchBar style={StyleSheet.flatten([{backgroundColor : styles.bgPrimaryColor}, style.header])}>
              <Body>
                <View
                  style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.marginBottom5, styles.marginTop15]}>
                  <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]} onPress={() => { this.props.navigation.goBack(null) }} />
                  <Text
                    style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>SKU</Text>
                  <View />
                </View>
                {this.props.isSearchBarVisible ? <SearchBarV2 placeholder={SEARCH_PLACE_HOLDER} setSearchText={this.setSearchText} navigation={this.props.navigation} returnValue={this.returnValue} onPress={this.searchIconPressed} searchText={this.props.searchText} /> : null}
              </Body>
            </Header>

            <Content style={[styles.flex1, styles.padding10, styles.bgLightGray]}>
              <FlatList
                initialNumToRender={_.size(this.props.skuListItems)}
                data={_.values(this.props.skuListItems)}
                renderItem={({ item }) => this.renderData(item)}
                keyExtractor={item => String(_.values(this.props.skuListItems).indexOf(item))}
              />
            </Content>

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

  saveSkuList = () => {
    this.props.actions.saveSkuListItems(
      this.props.skuListItems,
      this.props.skuObjectValidation,
      this.props.skuChildItems,
      this.props.skuObjectAttributeId,
      this.props.navigation.state.params.jobTransaction,
      this.props.navigation.state.params.currentElement,
      this.props.navigation.state.params.formLayoutState,
      this.props.skuValidationForImageAndReason,
      this.props.skuObjectAttributeKey)
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
    skuObjectAttributeKey: state.skuListing.skuObjectAttributeKey,
    skuValidationForImageAndReason: state.skuListing.skuValidationForImageAndReason,
    reasonsList: state.skuListing.reasonsList,
    searchText: state.skuListing.searchText,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...skuListingActions, ...globalActions }, dispatch)
  }
}

const style = StyleSheet.create({
  header: {
    borderBottomWidth: 0,
    height: 'auto',
    paddingTop: 10,
    paddingBottom: 10
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SkuListing)
