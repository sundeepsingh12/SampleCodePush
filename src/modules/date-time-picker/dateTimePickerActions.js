const {
    SHOW_DATETIME_PICKER,
    HIDE_DATETIME_PICKER,
    HANDLE_DATE_PICKED,
    HANDLE_TIME_PICKED,
} = require('../../lib/constants').default

export function pickDateTimeShow() {
    return {
        type: SHOW_DATETIME_PICKER,
    }
}
export function pickDateTimeHide() {
    return {
        type: HIDE_DATETIME_PICKER,
    }
}
export function pickTimeHandle(time) {
    return {
        type: HANDLE_TIME_PICKED,
        payload:time,
    }
}
export function pickDateHandle(date) {
    return {
        type: HANDLE_DATE_PICKED,
        payload:date,
    }
}
export function getDateTimePicker() {
    return async function (dispatch) {
        try {
            dispatch(pickDateTimeShow())
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
        }
    }
}
export function handleTimePicker(time) {
    return async function (dispatch) {
        try {
            dispatch(pickTimeHandle({time:time}))
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
        }
    }
}
export function handleDatePicker(date) {
    return async function (dispatch) {
        try {
            dispatch(pickDateHandle({date:date}))
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
        }
    }
}
export function hideDateTimePicker() {
    return async function (dispatch) {
        try {
            dispatch(pickDateTimeHide())
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
        }
    }
}