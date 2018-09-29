import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableHighlight, Alert } from 'react-native'
import styles from '../themes/FeStyle'

import {
  Text,
  Icon,
} from 'native-base'
import moment from 'moment'
import _ from 'lodash'
import MessagingCallingSmsButtonView from './MessagingCallingSmsButtonView'

export default class JobListItem extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      timer: 0,
      counter: 0,
    };
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  showJobMasterIdentifierAndCheckMark() {
    return (
      <View style={[style.seqCircle, styles.relative, !this.props.data.disabled ? { backgroundColor: this.props.data.identifierColor, zIndex: 3 } : { backgroundColor: this.props.data.identifierColor + '98' }]}>
        <Text style={[styles.fontWhite, styles.fontCenter, styles.fontLg]}>
          {this.props.data.jobMasterIdentifier}
        </Text>
        {this.props.data.isChecked ? <View style={[styles.absolute, styles.bgSuccess, styles.justifyCenter, styles.alignCenter, style.selectedItemCircle]}>
          <Icon name="ios-checkmark" style={[styles.bgTransparent, styles.fontWhite, { marginTop: -5 }]} />
        </View> : null}
      </View>
    )
  }
  
  componentDidMount() {
    if (this.props.jobEndTime && !this.state.timer) {
      let currentTime = moment()
      this.setState({ counter: moment.utc(moment(this.props.jobEndTime, "HH:mm:ss").diff(moment(currentTime, "HH:mm:ss"))).format("HH:mm:ss") })
      let timer = setInterval(this.tick, 1000);
      this.setState({ timer });
    }
  }

  tick = () => {
    let currentTime = moment()
    if (moment(this.props.jobEndTime, "HH:mm:ss").diff(moment(currentTime, "HH:mm:ss")) <= 0) {
      this.setState({ counter: moment.utc(moment(currentTime, "HH:mm:ss").diff(moment(currentTime, "HH:mm:ss"))).format("HH:mm:ss") })
      clearInterval(this.state.timer);
    } else {
      this.setState({ counter: moment.utc(moment(this.props.jobEndTime, "HH:mm:ss").diff(moment(currentTime, "HH:mm:ss"))).format("HH:mm:ss") })
    }
  }

  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPressItem}
        onLongPress={this.props.onLongPressItem}
        underlayColor={'#eee'} {...this.props.sortHandlers}>
        <View style={[style.seqCard, this.props.data.isChecked ? { backgroundColor: '#d3d3d3' } : { backgroundColor: '#ffffff' }]}>
          {!this.props.lastId ? null : <View style={{ position: 'absolute', width: 3, backgroundColor: '#d9d9d9', height: this.props.lastId == 'lastTransaction' ? '30%' : '100%', top: 0, left: 36, zIndex: 1 }}></View>}
          {this.showJobMasterIdentifierAndCheckMark()}
          <View style={style.seqCardDetail}>
            {this.renderJobListItemDetails()}
            {this.props.callingActivity == 'Sequence' ? <SequenceVerticalBar /> : <View />}
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  /**
   * 
   * @param {*} data 
   * this method is use in case previous sequence(i.e seqActual) is different from new sequence(i.e seqSelected)
   */
  previousAndCurrentSequenceView(data) {
    if (_.includes(data.line1, 'Sequence') || _.includes(data.line2, 'Sequence') || _.includes(data.circleLine1, 'Sequence') || _.includes(data.circleLine2, 'Sequence')) {
      if (data.seqActual && data.seqActual < data.seqSelected) {
        return (
          <View style={[styles.row]}>
            <Icon name="md-arrow-dropdown" style={[styles.fontXl, styles.fontDanger, styles.marginTop5, styles.marginBottom5, styles.marginLeft5]} />
            <Text style={[styles.fontDefault, styles.fontDanger, styles.italic, styles.margin5]}>
              was {data.seqActual}
            </Text>
          </View>
        )
      }
      else if (data.seqActual && data.seqActual > data.seqSelected) {
        return (
          <View style={[styles.row]}>
            <Icon name="md-arrow-dropup" style={[styles.fontXl, styles.fontSuccess, styles.marginTop5, styles.marginBottom5, styles.marginLeft5]} />
            <Text style={[styles.fontDefault, styles.italic, styles.fontSuccess, styles.margin5]}>
              was {data.seqActual}
            </Text>
          </View>
        )
      }
    }
  }

  /**This function shows Line1,Line2,Circle Line1,Circle Line 2
   * 
   */
  renderJobListItemDetails() {
    return (
      <View style={[styles.flexBasis90]}>
        {this.showLine1Line2Details()}

        {this.props.jobEndTime ?
          <View style={[styles.marginTop10, styles.bgBlack, styles.bgWarning, styles.padding5, { borderRadius: 5 }]}>
            <Text style={[styles.fontWhite, styles.fontDefault, styles.fontCenter]}>
              {(moment(this.state.counter, "HH:mm:ss")).hours() + ' hours ' +
                (moment(this.state.counter, "HH:mm:ss")).minutes() + ' minutes ' +
                (moment(this.state.counter, "HH:mm:ss")).seconds() + ' seconds left'}
            </Text>
          </View> : null}

        {/* action buttons section */}
        {this.showActionButtonSection()}
      </View>
    )
  }

  showLine1Line2Details() {
    return (
      <View>
        {this.props.data.line1 ?
          <Text style={[styles.fontDefault, styles.fontWeight500, styles.lineHeight25, !this.props.data.disabled ? styles.fontBlack : styles.fontDarkGray]}>
            {this.props.data.line1}
          </Text>
          : null
        }
        {this.props.data.line2 ?
          <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20, !this.props.data.disabled ? styles.fontBlack : styles.fontDarkGray]}>
            {this.props.data.line2}
          </Text>
          : null
        }
        {this.props.data.circleLine1 || this.props.data.circleLine2 ?
          <Text
            style={[styles.fontSm, styles.italic, styles.fontWeight300, styles.lineHeight20, !this.props.data.disabled ? styles.fontBlack : styles.fontDarkGray]}>
            {this.props.data.circleLine1} . {this.props.data.circleLine2}
          </Text>
          : null
        }
        {this.previousAndCurrentSequenceView(this.props.data)}
      </View>
    )
  }

  showActionButtonSection() {
    if (this.props.data) {
      return (
        <MessagingCallingSmsButtonView sendMessageToContact={this.props.onChatButtonPressed} jobTransaction={this.props.data} />
      )
    }
  }
}

const SequenceVerticalBar = () => {
  return (
    <View
      style={{
        width: 30,
        alignSelf: 'center',
        flexBasis: '10%'
      }} >
      <Icon
        name="ios-menu"
        style={[
          styles.fontXl, {
            color: '#c9c9c9'
          }
        ]} />
    </View>
  )
}

const style = StyleSheet.create({
  headerIcon: {
    fontSize: 18
  },
  seqCard: {
    minHeight: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 10
  },
  seqCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: 12,
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
    right: 0,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff'
  }

})