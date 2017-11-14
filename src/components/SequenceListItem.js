import React, {Component} from 'react'
import {StyleSheet, View, Image, TouchableHighlight} from 'react-native'
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

export default class SequenceListItem extends Component{
    render(){
         return (
      <TouchableHighlight underlayColor={'#eee'} {...this.props.sortHandlers}>
        <View style={style.seqCard}>
          <View style={style.seqCircle}>
            <Text style={[styles.fontWhite, styles.fontCenter, styles.fontLg]}>
              {this.props.data.jobMasterIdentifier}
            </Text>
          </View>
          <View style={style.seqCardDetail}>
            <View>
              <Text style={[styles.fontDefault, styles.fontWeight500, styles.lineHeight25]}>
                {this.props.data.line1}
              </Text>
              <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20]}>
                {this.props.data.line2}
              </Text>
              <Text
                style={[styles.fontSm, styles.italic, styles.fontWeight300, styles.lineHeight20]}>
                {this.props.data.circleLine1} 
              </Text>
            </View>
            <View
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
              ]}/>
            </View>
          </View>
        </View>
      </TouchableHighlight>
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
  }

})