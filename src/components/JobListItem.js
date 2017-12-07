import React, { Component } from 'react'
import { StyleSheet, View, Image, TouchableHighlight } from 'react-native'
import styles from '../themes/FeStyle'

import {
  Container,
  Content,
  Header,
  Button,
  Text,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Icon,
  Title,
  Footer,
  FooterTab,
  StyleProvider
} from 'native-base'
import moment from 'moment'
export default class JobListItem extends Component {

  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPressItem}
        onLongPress={this.props.onLongPressItem}
        underlayColor={'#eee'} {...this.props.sortHandlers}>
        <View style={[style.seqCard, this.props.data.isChecked ? { backgroundColor: '#d3d3d3' } : null]}>
          <View style={[style.seqCircle, styles.relative]}>
            <Text style={[styles.fontWhite, styles.fontCenter, styles.fontLg]}>
              {this.props.data.jobMasterIdentifier}
            </Text>
            {this.props.data.isChecked ? <View style={[styles.absolute, styles.bgSuccess, styles.justifyCenter, styles.alignCenter, style.selectedItemCircle]}>
              <Icon name="ios-checkmark" style={[styles.bgTransparent, styles.fontWhite]} />
            </View> : null}

          </View>
          <View style={style.seqCardDetail}>

            {this.renderJobListItemDetails()}

            {this.props.callingActivity == 'Sequence' ? <View
              style={{
                width: 30,
                alignSelf: 'center'
              }}>
              <Icon
                name="ios-menu"
                style={[
                  styles.fontXl, {
                    color: '#c9c9c9'
                  }
                ]} />
            </View> : <View />}

          </View>
          {this.props.jobEndTime ?
            <Text style={[styles.bgWarning, styles.flexBasis50]}>
              {
                (moment(this.props.jobEndTime, "HH:mm:ss")).hours() + ' hours ' +
                (moment(this.props.jobEndTime, "HH:mm:ss")).minutes() + ' minutes' +
                (moment(this.props.jobEndTime, "HH:mm:ss")).seconds() + ' seconds left'
                // (moment(this.props.jobEndTime, "HH:mm:ss").hours() > 0) ? (moment(this.props.jobEndTime, "HH:mm:ss")).hours() + ' hours ' : '' +
                // (moment(this.props.jobEndTime, "HH:mm:ss").minutes() > 0) ? (moment(this.props.jobEndTime, "HH:mm:ss")).minutes() + ' minutes ' : '' +
                // (moment(this.props.jobEndTime, "HH:mm:ss").seconds()) + 'Left'
              }
            </Text> : <View />}
        </View>
      </TouchableHighlight>
    )
  }

  /**This function shows Line1,Line2,Circle Line1,Circle Line 2
   * 
   */
  renderJobListItemDetails() {
    return (
      <View>
        <Text style={[styles.fontDefault, styles.fontWeight500, styles.lineHeight25]}>
          {this.props.data.line1}
        </Text>
        <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20]}>
          {this.props.data.line2}
        </Text>
        <Text
          style={[styles.fontSm, styles.italic, styles.fontWeight300, styles.lineHeight20]}>
          {this.props.data.circleLine1} . {this.props.data.circleLine2}
        </Text>
      </View>
    )
  }
}

const style = StyleSheet.create({
  headerIcon: {
    fontSize: 18
  },
  seqCard: {
    minHeight: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10
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
    borderBottomColor: '#e4e4e4',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  selectedItemCircle: {
    width: 24,
    bottom: 0,
    right: -5,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff'
  }

})