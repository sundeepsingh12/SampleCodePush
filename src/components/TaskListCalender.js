
'use strict'

import React, { PureComponent } from 'react'
import styles from '../themes/FeStyle'
import {
    Button,
    Text,
    Icon,
    Footer,
    FooterTab,
    View
} from 'native-base'
import moment from 'moment'
import DateTimePicker from 'react-native-modal-datetime-picker'
import {
    IS_CALENDAR_VISIBLE,
} from '../lib/constants'
import {
    ALL,
    TODAY
} from '../lib/ContainerConstants'
export default class TaskListCalender extends PureComponent {

    _renderCalendarButtonText() {
        if ((this.props.selectedDate == "All")) {
            return <Text style={[styles.fontBlack, styles.fontWeight500, styles.fontSm]}>{ALL}</Text>
        } else {
            return <Text style={[styles.fontBlack, styles.fontWeight500, styles.fontSm]}>{moment(this.props.selectedDate).format('ddd, DD MMM, YYYY')}</Text>
        }
    }
    render() {
        if (!this.props.isFutureRunsheetEnabled) {
            return null
        }
        return (
            <Footer style={[styles.bgWhite, { borderTopWidth: 1, borderTopColor: '#f3f3f3' }]}>

                <FooterTab style={[styles.flexBasis25]}>
                    <Button transparent
                        onPress={this.props._transactionsForTodayDate}
                        style={[styles.alignStart]}>
                        <Text style={[styles.fontPrimary, styles.fontSm]}>{TODAY}</Text>
                    </Button>
                </FooterTab>
                <FooterTab style={[styles.flexBasis50]}>
                    <DateTimePicker
                        isVisible={this.props.isCalendarVisible}
                        onConfirm={this.props._onConfirm}
                        onCancel={this.props._onCancel}
                        mode='date'
                        datePickerModeAndroid='spinner'
                    />
                    <Button transparent
                        onPress={() => { this.props.setState(IS_CALENDAR_VISIBLE, true) }}
                        style={[styles.row]}>
                        <Text style={[styles.fontBlack, styles.fontWeight500, styles.fontSm]}>{this._renderCalendarButtonText()}</Text>
                        <Icon name='ios-arrow-down' style={[styles.fontBlack, styles.fontSm]} />
                    </Button>
                </FooterTab>
                <FooterTab style={[styles.flexBasis25]}>
                    <Button transparent
                        onPress={this.props._showAllJobTransactions}
                        style={[styles.alignEnd]}>
                        <Text style={[styles.fontPrimary, styles.fontSm]}>{ALL}</Text>
                    </Button>
                </FooterTab>
            </Footer>
        )
    }
}
