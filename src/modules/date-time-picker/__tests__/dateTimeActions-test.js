/**
 * # dateTimePickerActi-test.js
 *
 * This test is for deviceActions
 *
 */
var actions=require('../dateTimePickerActions')
const {
    SHOW_DATETIME_PICKER,
    HIDE_DATETIME_PICKER,
    HANDLE_DATE_PICKED,
    HANDLE_TIME_PICKED,
} = require('../../../lib/constants').default

describe('dateTimePickerActions', () => {
    it('should set pickDateTimeShow()', () => {
        expect(actions.pickDateTimeShow()).toEqual({ type: SHOW_DATETIME_PICKER })
    })

    it('should set pickDateTimeHide()', () => {
        expect(actions.pickDateTimeHide()).toEqual({ type: HIDE_DATETIME_PICKER })
    })
  it('should  pickTimeHandle', () => {
    let time= 'Tue Oct 17 2017 20:40:00 GMT+0530 (IST)'
    expect(actions. pickTimeHandle(time)).toEqual({
      type: HANDLE_TIME_PICKED,
      payload: time
    })
  })
})