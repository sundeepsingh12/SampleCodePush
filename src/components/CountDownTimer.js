'use strict'

import React, { PureComponent } from 'react'
import { View, Text } from 'react-native'
import moment from 'moment'
class CountDownTimer extends PureComponent {

    state = {
        timer: null,
        difference: {},
        counterNegative: false,
    }
    componentWillUnmount() {
        clearInterval(this.state.timer)
    }

    tick = () => {
        let currentTime = moment(), difference = {}
        let counterNegative = this.setCounterNgative(currentTime)
        if (counterNegative) {
            difference = this.getDifference(currentTime)

        } else {
            difference = this.getDifference(currentTime)
        }
        this.setState({
            difference,
            counterNegative
        });
    }

    getDifference = (currentTime) => {
        let difference = {}, y
        if (this.state.counterNegative) {
            let x = moment(currentTime).diff(this.props.value)
            y = moment.duration(x)
        }
        else {
            let x = moment(this.props.value).diff(currentTime)
            y = moment.duration(x)
        }
        difference = {
            days: (y.days() > 0) ? y.days() : null,
            hours: (y.hours() > 0) ? y.hours() : null,
            minutes: (y.minutes() > 0) ? y.minutes() : null,
            seconds: (y.seconds() > 0) ? y.seconds() : null,
        }
        return difference
    }

    setCounterNgative = (currentTime) => {
        if (moment(this.props.value).diff(moment(currentTime)) <= 0) {
            return true
        }
        return
    }

    componentDidMount() {
        let timer = setInterval(this.tick, 1000);
        this.setState({ timer });
    }

    renderTime() {
        let differenceString = ''
        differenceString += this.state.difference.days ? this.state.difference.days + ' days ' : ''
        differenceString += this.state.difference.hours ? this.state.difference.hours + ' hours ' : ''
        differenceString += this.state.difference.minutes ? this.state.difference.minutes + ' minutes ' : ''
        differenceString += this.state.difference.seconds ? this.state.difference.seconds + ' seconds ' : '0 seconds'
        if (this.state.counterNegative) {
            return (
                <Text>
                    {'Delayed by ' + differenceString}
                </Text>
            )
        } else {
            return (
                <Text>
                    {differenceString + ' left'}
                </Text>)
        }
    }
    render() {
        let remainingTime = this.renderTime()
        return (
            <View>
                {remainingTime}
            </View>
        )
    }
}

export default CountDownTimer

