import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Rect, LinearGradient, Stop } from 'react-native-svg';

const FROM_COLOR = 'rgb(235, 232, 252)';
const TO_COLOR = 'rgb(255, 230, 232)';

const BackgroundGradient = ({children}: {children: React.ReactNode}) => {
    return (
        <View style={{ 
            width: '100%', 
            height: '100%', 
            alignItems: 'center', 
            justifyContent: 'center', 
            position: 'relative' 
        }}>
            <Svg style={[ StyleSheet.absoluteFillObject ]}>
                <Defs>
                    <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0" stopColor={ FROM_COLOR }/>
                        <Stop offset="1" stopColor={ TO_COLOR }/>
                    </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grad)"/>
            </Svg>
            { children }
        </View>
    );
};

export default BackgroundGradient;