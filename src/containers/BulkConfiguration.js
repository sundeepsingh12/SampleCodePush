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
import { StyleSheet, View, TouchableHighlight, FlatList } from 'react-native'
import Loader from '../components/Loader'
import * as globalActions from '../modules/global/globalActions'
import { BulkListing } from '../lib/constants'

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
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          <Header style={StyleSheet.flatten([styles.bgPrimary])}>
            <Left>
              <Button transparent onPress={() =>
                this.props.navigation.goBack(null)}>
                <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]} />
              </Button>
            </Left>
            <Body>
              <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>Bulk Update</Text>
            </Body>
            <Right />
          </Header>
          <Content>
            <Text style={[styles.fontSm, styles.fontPrimary, styles.padding15]}>Select Status you would like to Bulk Update</Text>
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