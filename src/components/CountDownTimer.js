'use strict'

import React, { PureComponent } from 'react'
import { View, Text } from 'react-native'
import moment from 'moment'
class CountDownTimer extends PureComponent {

    state = {
        timer: null,
        counter: 0,
        counterNegative: false,
    }
    componentWillUnmount() {
        clearInterval(this.state.timer)
    }

    tick = () => {
        let jobEndTime = moment(this.props.value, 'HH:mm:ss')
        let currentTime = moment()
        this.setCounterNgative(jobEndTime, currentTime)
        let time
        if (this.state.counterNegative) {
            time = moment(this.state.counter, 'HH:mm:ss').add(1, 'seconds')
        } else {
            time = moment(this.state.counter, 'HH:mm:ss').subtract(1, 'seconds')
        }
        this.setState({
            counter: moment(time).format('HH:mm:ss')
        });
    }
    getDifference = (currentTime) => {
        if (this.state.counterNegative) {
            let x = moment(currentTime).diff(this.props.value)
            let y = moment.duration(x)
            return y.hours() + ':' + y.minutes() + ':' + y.seconds()
        }
        //return moment.utc(moment(currentTime, "HH:mm:ss").diff(moment(jobEndTime, "HH:mm:ss"))).format("HH:mm:ss")
        else {
            let x = moment(this.props.value).diff(currentTime)
            let y = moment.duration(x)
            return y.hours() + ':' + y.minutes() + ':' + y.seconds()
            //return moment.utc(moment(jobEndTime, "HH:mm:ss").diff(moment(currentTime, "HH:mm:ss"))).format("HH:mm:ss")
        }
    }
    setCounterNgative = (jobEndTime, currentTime) => {

        if (moment(this.props.value).diff(moment(currentTime)) <= 0) {
            this.setState({ counterNegative: true })
        }
    }
    componentWillMount() {
        let jobEndTime = moment(this.props.value, 'HH:mm:ss')
        let currentTime = moment()
        this.setCounterNgative(jobEndTime, currentTime)

    }
    componentDidMount() {
        let currentTime = moment()
        let differenceInTime = this.getDifference(currentTime)
        this.setState({
            counter: differenceInTime
        })
        let timer = setInterval(this.tick, 1000);
        this.setState({ timer });
    }
    renderTime() {
        if (this.state.counterNegative) {
            return (
                <Text>
                    {'Delayed by ' + (moment(this.state.counter, "HH:mm:ss")).hours() + ' hours ' +
                        (moment(this.state.counter, "HH:mm:ss")).minutes() + ' minutes ' +
                        (moment(this.state.counter, "HH:mm:ss")).seconds() + ' seconds'} </Text>
            )
        } else {
            return (
                <Text>
                    {(moment(this.state.counter, "HH:mm:ss")).hours() + ' hours ' +
                        (moment(this.state.counter, "HH:mm:ss")).minutes() + ' minutes ' +
                        (moment(this.state.counter, "HH:mm:ss")).seconds() + ' seconds left'}
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

