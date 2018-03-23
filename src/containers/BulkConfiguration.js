/**
 * This screen is entry point for Bulk Module
 */


'use strict'

import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as bulkActions from '../modules/bulk/bulkActions'
import {
  Container,
  Content,
  Header,
  Text,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Icon,
  Button,
  StyleProvider,
} from 'native-base'

import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import { StyleSheet, View, TouchableHighlight, FlatList, TouchableOpacity } from 'react-native'
import Loader from '../components/Loader'
import * as globalActions from '../modules/global/globalActions'
import { BulkListing } from '../lib/constants'
import {BULK_UPDATE,SELECT_STATUS_FOR_BULK} from '../lib/ContainerConstants'

function mapStateToProps(state) {
  return {
    isLoaderRunning: state.bulk.isLoaderRunning,
    bulkConfigList: state.bulk.bulkConfigList
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...bulkActions, ...globalActions }, dispatch)
  }
}

class BulkConfiguration extends PureComponent {

  static navigationOptions = ({ navigation }) => {
    return { header: null }
  }

  renderData = (item) => {
    return (

      <ListItem style={[style.jobListItem, styles.justifySpaceBetween]}
        onPress={() => this.goToBulkListing(item)}
      >
        <View style={[styles.row, styles.alignCenter]}>
          <Text style={[styles.fontDefault, styles.fontWeight500]}>{item.jobMasterName}-{item.statusName}</Text>
        </View>
        <Right>
          <Icon name="arrow-forward" style={[styles.fontLg, styles.fontBlack]} />
        </Right>
      </ListItem>
    )
  }

  goToBulkListing(item) {
    this.props.actions.navigateToScene(BulkListing, {
      jobMasterId: item.jobMasterId,
      statusId: item.statusId,
      nextStatusList: item.nextStatusList
    })
  }

  render() {
    if (this.props.isLoaderRunning) {
      return <Loader />
    }
    let headerView = this.props.navigation.state.params.displayName ? this.props.navigation.state.params.displayName : BULK_UPDATE
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, styles.header])}>
              <Body>
                <View
                    style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                    <TouchableOpacity style={[styles.profileHeaderLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                    <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                    </TouchableOpacity>
                    <View style={[styles.headerBody, styles.paddingTop15]}>
                    <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{headerView}</Text>
                    </View>
                    <View style={[styles.headerRight]}>
                    </View>
                    <View />
                </View>
              </Body>
          </Header>
          <Content>
            <Text style={[styles.fontSm, styles.fontPrimary, styles.padding15]}>{SELECT_STATUS_FOR_BULK}</Text>
            <List>
              <FlatList
                data={this.props.bulkConfigList}
                renderItem={({ item }) => this.renderData(item)}
                keyExtractor={item => String(item.id)}>
              </FlatList>
            </List>

          </Content>
        </Container>
      </StyleProvider>
    )
  }
}

const style = StyleSheet.create({
  jobListItem: {
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingBottom: 20
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(BulkConfiguration)