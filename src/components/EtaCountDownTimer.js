
'use strict'

import React, { PureComponent } from 'react'
import {
    View,
    Text
}
    from 'react-native'
import moment from 'moment'
import styles from '../themes/FeStyle'

class EtaCountDownTimer extends PureComponent {

    state = {
        timer: null,
        counter: 0,
        counterNegative: 0,
    }
    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    tick = () => {
        let jobEndTime = moment(this.props.endTime, 'HH:mm:ss')
        let jobStartTime = moment(this.props.startTime, 'HH:mm:ss')
        let currentTime = moment()
        this.setCounterNgative(jobEndTime, currentTime, jobStartTime)
        if (this.state.counterNegative == 1) {
            this.setState({
                counter: moment(this.state.counter, 'HH:mm:ss').subtract(1, 'seconds')
            });
        } else if (this.state.counterNegative == 2) {
            this.setState({
                counter: moment(this.state.counter, 'HH:mm:ss').add(1, 'seconds')
            });
        } else {
            this.setState({
                counter: moment(this.state.counter, 'HH:mm:ss').subtract(1, 'seconds')
            });
        }
    }
    getDifference = (jobEndTime, currentTime, jobStartTime) => {

        if (this.state.counterNegative == 1)
            return moment.utc(moment(jobEndTime, "HH:mm:ss").diff(moment(currentTime, "HH:mm:ss"))).format("HH:mm:ss")
        else if (this.state.counterNegative == 2) {
            return moment.utc(moment(currentTime, "HH:mm:ss").diff(moment(jobEndTime, "HH:mm:ss"))).format("HH:mm:ss")
        } else {
            return moment.utc(moment(jobStartTime, "HH:mm:ss").diff(moment(currentTime, "HH:mm:ss"))).format("HH:mm:ss")
        }
    }
    setCounterNgative = (jobEndTime, currentTime, jobStartTime) => {
        if ((moment(jobStartTime).diff(moment(currentTime)) <= 1000) && (moment(jobEndTime).diff(moment(currentTime)) > 0) && this.state.counterNegative == 0) {
            this.setState({ counterNegative: 1 })
            let differenceInTime = this.getDifference(jobEndTime, currentTime, jobStartTime)
            this.setState({
                counter: differenceInTime
            })
        } else if (moment(jobEndTime).diff(moment(currentTime)) <= 1000) {
            this.setState({ counterNegative: 2 })
        }
    }
    componentWillMount() {
        let jobStartTime = moment(this.props.startTime, 'HH:mm:ss')
        let jobEndTime = moment(this.props.endTime, 'HH:mm:ss')
        let currentTime = moment()
        this.setCounterNgative(jobEndTime, currentTime, jobStartTime)

    }
    componentDidMount() {
        let jobEndTime = moment(this.props.endTime, 'HH:mm:ss')
        let jobStartTime = moment(this.props.startTime, 'HH:mm:ss')
        let currentTime = moment()
        let differenceInTime = this.getDifference(jobEndTime, currentTime, jobStartTime)
        this.setState({
            counter: differenceInTime
        })
        let timer = setInterval(this.tick, 1000);
        this.setState({ timer });
    }
    renderTime() {
        if (this.state.counterNegative == 1) {
            return (
                <View style={[styles.heightAuto, styles.bgWarning]}>
                    <Text style={[styles.alignSelfCenter, styles.fontWhite]}>
                        {'Ends in ' + (moment(this.state.counter, "HH:mm:ss")).hours() + ' hours ' +
                            (moment(this.state.counter, "HH:mm:ss")).minutes() + ' minutes ' +
                            (moment(this.state.counter, "HH:mm:ss")).seconds() + ' seconds'} </Text>
                </View>
            )
        } else if (this.state.counterNegative == 2) {
            return (
                <View style={[styles.heightAuto, styles.bgDanger]}>
                    <Text style={[styles.alignSelfCenter, styles.fontWhite]}>
                        {'Delayed by ' + (moment(this.state.counter, "HH:mm:ss")).hours() + ' hours ' +
                            (moment(this.state.counter, "HH:mm:ss")).minutes() + ' minutes ' +
                            (moment(this.state.counter, "HH:mm:ss")).seconds() + ' seconds '}
                    </Text>
                </View>
            )
        } else {
            return (
                <View style={[styles.heightAuto, styles.bgSuccess]}>
                    <Text style={[styles.alignSelfCenter, styles.fontWhite]}>
                        {'Starts in ' + (moment(this.state.counter, "HH:mm:ss")).hours() + ' hours ' +
                            (moment(this.state.counter, "HH:mm:ss")).minutes() + ' minutes ' +
                            (moment(this.state.counter, "HH:mm:ss")).seconds() + ' seconds '}
                    </Text>
                </View>
            )
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

module.exports = EtaCountDownTimer

