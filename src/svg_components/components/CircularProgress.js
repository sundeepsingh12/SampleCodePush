import React from 'react'
import {View, StyleSheet} from 'react-native'
import Svg, {Path, Circle} from 'react-native-svg'

const styles = StyleSheet.create({
    textView: {
        position: 'absolute',
        top: 0, left: 0, bottom: 0, right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

function generateArc(percentage){
    if (percentage === 100) percentage = 99.999
    const a = percentage*2*Math.PI/100 // angle (in radian) depends on percentage
    const r = 100 // radius of the circle
    var rx = r,
        ry = r,
        xAxisRotation = 0,
        largeArcFlag = 1,
        sweepFlag = 1,
        x = r + r*Math.sin(a),
        y = r - r*Math.cos(a)
    if (percentage <= 50){
        largeArcFlag = 0;
    }else{
        largeArcFlag = 1
    }

    return `A${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y} `
}


const CircularProgress = ({
    percentage = 95, 
    blankColor = "rgba(254, 254, 254, 0.5)", 
    donutColor = "#ffffff",
    fillColor = "transparent",
    progressWidth = 5,
    children
}) => {
    return <View style={styles.base}>
        <Svg width="200" height="200" viewBox='-8 -8 220 220'>
            <Circle cx="100" cy="100" r="100" strokeWidth="3" fill='transparent' stroke={blankColor}/>
            <Path 
                d={`M100 00 L100 0 ${generateArc(percentage)}`}
                stroke={donutColor}
                strokeWidth={progressWidth}
                fill='transparent'
            />
            {<Circle cx="50" cy="50" strokeWidth={progressWidth} fill='transparent' stroke={fillColor}/>}
        </Svg>
        <View style={styles.textView}>
            {children}
        </View>
    </View>
}
export default CircularProgress