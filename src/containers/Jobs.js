'use strict'
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Dimensions,
  ListView,
  Platform,
  TouchableHighlight,
  FlatList,
  ActivityIndicator
}
  from 'react-native'

import { Form, Item, Input, Container, Content, ListItem, CheckBox, List, Body, Left, Right, Text, Header, Icon, Button } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as homeActions from '../modules/home/homeActions'
import { Actions } from 'react-native-router-flux';
import _ from 'underscore'
import renderIf from '../lib/renderIf';

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 2,
    backgroundColor: '#f7f7f7',
    marginBottom: Platform.OS === 'ios' ? 60 : 50,
  },
  style_row_view: {
    flex: 1,
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#f7f7f7',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5
  },
  listCircle: {
    width: 64,
    height: 64,
    backgroundColor: 'green',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

  },
  listCircleCheckbox: {
    width: 64,
    height: 64,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15
  },
  hidden: {
    width: 0,
    height: 0
  },
  testsad: {
    borderBottomWidth: 0
  },
  circleLine1: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },
  circleLine2: {
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
    color: '#ffffff',
    width: 60
  }
})

function mapStateToProps(state) {
  return {
    tabIdJobTransactions: state.home.tabIdJobTransactions,
    isRefreshing: state.home.isRefreshing
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...homeActions }, dispatch)
  }
}

class Jobs extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.actions.fetchJobs(this.props.tabId, 0)
  }

  toggleStatus() {
    this.setState({
      status: !this.state.status
    });
    console.log('toggle button handler: ' + this.state.status);
  }

  renderData = (item) => {
    return (
      <ListItem avatar>
        <Left>
          <TouchableHighlight underlayColor='#e7e7e7' style={[styles.listCircle]} onPress={() => this.toggleStatus()}>
            <View>
              <Text style={StyleSheet.flatten(styles.circleLine1)}>{`${item.circleLine1}`}</Text>
              <Text style={StyleSheet.flatten(styles.circleLine2)}>{`${item.circleLine2}`}</Text>
            </View>
          </TouchableHighlight>
        </Left>
        <Body >
          <Text adjustsFontSizeToFit>
            {`${item.line1}`}
          </Text>
          <Text note adjustsFontSizeToFit>
            {`${item.line2}`}
          </Text>
        </Body>
      </ListItem>
    )
  }

  renderFooter = () => {
    if (this.props.tabIdJobTransactions[this.props.tabId] && !this.props.tabIdJobTransactions[this.props.tabId].isFetching) {
      return null
    }

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE'
        }}>
        <ActivityIndicator animating size='large' />
      </View>
    )
  }

  handleLoadMore = () => {
    if (!this.props.tabIdJobTransactions[this.props.tabId].isLastPage) {
      this.props.actions.fetchJobs(this.props.tabId, this.props.tabIdJobTransactions[this.props.tabId].pageNumber)
    }
  }

  checkIfTransactionsPresent() {
    if (this.props.tabIdJobTransactions[this.props.tabId] &&
      this.props.tabIdJobTransactions[this.props.tabId].jobTransactionCustomization &&
      (this.props.tabIdJobTransactions[this.props.tabId].jobTransactionCustomization.length > 0 || this.props.tabIdJobTransactions[this.props.tabId].isFetching)) {
      return true
    }
    return false
  }

  render() {
    return (
      <Container>
        {renderIf(this.checkIfTransactionsPresent(),
          <View style={styles.container}>
            <List
              style={{ marginTop: 5, marginBottom: 50 }}>
              <FlatList
                data={
                  (this.props.tabIdJobTransactions[this.props.tabId]) ? (this.props.tabIdJobTransactions[this.props.tabId].jobTransactionCustomization) : []
                }
                renderItem={({ item }) => this.renderData(item)}
                keyExtractor={item => item.id}
                ListFooterComponent={this.renderFooter}
                onEndReached={this.handleLoadMore}
              />
            </List>
            <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 5, marginLeft: 5, marginRight: 5 }}>
              <View style={{ backgroundColor: '#fff', flexGrow: .90, height: 40 }}>
                <Input bordered='true' rounded style={{ fontSize: 14, backgroundColor: '#ffffff', borderColor: '#d3d3d3', borderWidth: 1 }}
                  placeholder="Search Reference No." />
              </View>
              <View style={{ backgroundColor: '#d7d7d7', flexGrow: .10, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name='ios-barcode-outline' style={{ fontSize: 34 }} />
              </View>
            </View>
          </View>
        )}
        {renderIf(!this.checkIfTransactionsPresent(),
          <View>
            <Text>
              
            </Text>
          </View>
        )}
      </Container>
    )
  }

  _renderRow(rowData: string, sectionID: number, rowID: number) {

    return (
      <View style={styles.style_row_view}>
        <TouchableHighlight underlayColor='#e7e7e7' style={[styles.listCircle, this.state.status ? styles.hidden : {}]} onPress={() => this.toggleStatus()}>
          <View>
            <Text style={{ fontSize: 14, color: '#ffffff', textAlign: 'center', fontWeight: 'bold', backgroundColor: 'transparent' }}>Del</Text>
            <Text style={{ fontSize: 11, marginTop: 5, textAlign: 'center', color: '#ffffff', width: 60 }}>Run1234asd56</Text>
          </View>
        </TouchableHighlight>

        <View style={[styles.listCircleCheckbox, !this.state.status ? styles.hidden : {}]} >
          <CheckBox
            size={36}
            icon_check='ios-checkmark-circle-outline'
            icon_open='ios-radio-button-off'
            text=''
          />
        </View>

        <TouchableHighlight underlayColor='#e7e7e7' style={{ flex: 1, height: 64 }} onPress={this._onPressRow.bind(this.rowID, rowData)}>
          <View style={{ padding: 5, paddingTop: 10, paddingLeft: 10 }}>
            <Text style={{ fontSize: 14, color: '#000000' }}>{rowData.row}</Text>
            <Text style={{ marginTop: 10, color: '#666666' }}>{rowData.isSelect ? 'true' : 'false'}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  _onPressRow(rowID, rowData) {
    console.log(rowID);
    console.log(rowData);
  }

};

export default connect(mapStateToProps, mapDispatchToProps)(Jobs)
