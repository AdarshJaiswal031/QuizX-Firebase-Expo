import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Text as SvgText } from 'react-native-svg';

const AnimatedCircle = ({ progress }) => {
    // const [progress, setProgress] = useState(0.2); // Change this to the desired progress value (between 0 and 1)

    const radius = 50;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference * ((progress - 0.1) <= 0 ? 0 : (progress - 0.1));

    return (
        <View style={styles.container}>
            <Svg width={radius * 2} height={radius * 2}>
                <Circle
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                    fill="white"
                    stroke="#ccc"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={dashoffset}
                />
                <Circle
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                    fill="transparent"
                    stroke="#2a2a32" // Change the color to green
                    strokeWidth={strokeWidth}
                    // strokeDasharray={`0 ${circumference}`}
                    strokeDashoffset={0}
                />
                <Circle
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                    fill="transparent"
                    stroke="green" // Change the color to green
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${dashoffset} ${circumference}`}
                    strokeDashoffset={0}
                />
                <SvgText
                    x={radius}
                    y={radius}
                    textAnchor="middle"
                    alignmentBaseline="central"
                    fontSize={18}
                    fill="black"
                >
                    {`${Math.floor(progress * 100)}%`}
                </SvgText>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default AnimatedCircle;
