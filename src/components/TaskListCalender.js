
'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import styles from '../themes/FeStyle'
import { SafeAreaView } from 'react-navigation'
import { Button, Text, Icon, Footer, FooterTab, View } from 'native-base'
import moment from 'moment'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { IS_CALENDAR_VISIBLE, SET_SELECTED_DATE } from '../lib/constants'
import { ALL, TODAY } from '../lib/ContainerConstants'
import * as taskListActions from '../modules/taskList/taskListActions'
import * as globalActions from '../modules/global/globalActions'

function mapStateToProps(state) {
    return {
        isCalendarVisible: state.taskList.isCalendarVisible,
        selectedDate: state.taskList.selectedDate
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...taskListActions, ...globalActions, }, dispatch)
    }
}
class TaskListCalender extends PureComponent {

    setSelectedDate = (date) => {
        this.props.actions.setState(SET_SELECTED_DATE, { selectedDate: date })
    }

    renderCalendarButtonText() {
        return <Text style={[styles.fontBlack, styles.fontWeight500, styles.fontSm]}>{this.props.selectedDate ? this.props.selectedDate == ALL ? ALL : moment(this.props.selectedDate).format('ddd, DD MMM, YYYY') : moment().format('ddd, DD MMM, YYYY')}</Text>
    }
    render() {
        return (
                <Footer style={[styles.bgWhite, { borderTopWidth: 1, borderTopColor: '#f3f3f3' }]}>
                    <FooterTab style={[styles.flexBasis25]}>
                        <Button transparent vertical
                            onPress={() => this.props.actions.setState(SET_SELECTED_DATE, { selectedDate: new Date() })}
                            style={[styles.alignStart]}>
                            <Text style={[{ color: styles.fontPrimaryColor }, styles.fontSm]}>{TODAY}</Text>
                        </Button>
                    </FooterTab>
                    <FooterTab style={[styles.flexBasis50]}>
                        <DateTimePicker
                            isVisible={this.props.isCalendarVisible}
                            onConfirm={this.setSelectedDate}
                            onCancel={() => this.props.actions.setState(IS_CALENDAR_VISIBLE, false)}
                            mode='date'
                            datePickerModeAndroid='spinner'
                            date = {this.props.selectedDate ? (this.props.selectedDate == ALL ? new Date() : this.props.selectedDate) : new Date()}
                        />
                        <Button transparent vertical
                            onPress={() => { this.props.actions.setState(IS_CALENDAR_VISIBLE, true) }}
                            style={[styles.row]}>
                            <Text style={[styles.fontBlack, styles.fontWeight500, styles.fontSm]}>{this.renderCalendarButtonText()}</Text>
                            <Icon name='ios-arrow-down' style={[styles.fontBlack, styles.fontSm]} />
                        </Button>
                    </FooterTab>
                    <FooterTab style={[styles.flexBasis25]}>
                        <Button transparent vertical
                            onPress={() => this.props.actions.setState(SET_SELECTED_DATE, { selectedDate: ALL })}
                            style={[styles.alignEnd]}>
                            <Text style={[{ color: styles.fontPrimaryColor }, styles.fontSm]}>{ALL}</Text>
                        </Button>
                    </FooterTab>
                </Footer>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListCalender)
