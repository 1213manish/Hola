import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { ArrowLeft, History, Delete } from 'lucide-react-native';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = (width - 60) / 4;

const CalculatorScreen = ({ navigation }) => {
    const [display, setDisplay] = useState('0');
    const [history, setHistory] = useState('');

    const handlePress = (value) => {
        if (display === '0' && !['+', '-', '*', '/'].includes(value)) {
            setDisplay(value);
        } else {
            setDisplay(display + value);
        }
    };

    const handleClear = () => {
        setDisplay('0');
        setHistory('');
    };

    const handleBackspace = () => {
        if (display.length > 1) {
            setDisplay(display.slice(0, -1));
        } else {
            setDisplay('0');
        }
    };

    const handleCalculate = () => {
        try {
            const result = eval(display).toString();
            setHistory(display + ' =');
            setDisplay(result);
        } catch (error) {
            setDisplay('Error');
        }
    };

    const Button = ({ label, onPress, type = 'number', icon: Icon }) => {
        let backgroundColor = colors.card;
        let textColor = colors.text;

        if (type === 'operator') {
            backgroundColor = colors.surface;
            textColor = colors.primary;
        } else if (type === 'equal') {
            backgroundColor = colors.primary;
            textColor = colors.black;
        } else if (type === 'action') {
            backgroundColor = colors.surface;
            textColor = colors.accent;
        }

        return (
            <TouchableOpacity
                style={[styles.button, { backgroundColor }]}
                onPress={onPress}
            >
                {Icon ? <Icon color={textColor} size={24} /> : <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color={colors.white} size={32} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Calculator</Text>
                <View style={{ width: 32 }} />
            </View>

            <View style={styles.displayContainer}>
                <Text style={styles.historyText}>{history}</Text>
                <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
                    {display}
                </Text>
            </View>

            <View style={styles.buttonsContainer}>
                <View style={styles.row}>
                    <Button label="C" type="action" onPress={handleClear} />
                    <Button label="()" type="action" onPress={() => handlePress('(')} />
                    <Button label="%" type="action" onPress={() => handlePress('%')} />
                    <Button label="/" type="operator" onPress={() => handlePress('/')} />
                </View>
                <View style={styles.row}>
                    <Button label="7" onPress={() => handlePress('7')} />
                    <Button label="8" onPress={() => handlePress('8')} />
                    <Button label="9" onPress={() => handlePress('9')} />
                    <Button label="×" type="operator" onPress={() => handlePress('*')} />
                </View>
                <View style={styles.row}>
                    <Button label="4" onPress={() => handlePress('4')} />
                    <Button label="5" onPress={() => handlePress('5')} />
                    <Button label="6" onPress={() => handlePress('6')} />
                    <Button label="-" type="operator" onPress={() => handlePress('-')} />
                </View>
                <View style={styles.row}>
                    <Button label="1" onPress={() => handlePress('1')} />
                    <Button label="2" onPress={() => handlePress('2')} />
                    <Button label="3" onPress={() => handlePress('3')} />
                    <Button label="+" type="operator" onPress={() => handlePress('+')} />
                </View>
                <View style={styles.row}>
                    <Button label="0" onPress={() => handlePress('0')} />
                    <Button label="." onPress={() => handlePress('.')} />
                    <Button icon={Delete} type="number" onPress={handleBackspace} />
                    <Button label="=" type="equal" onPress={handleCalculate} />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
    },
    headerTitle: {
        color: colors.white,
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
    },
    displayContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: 30,
    },
    historyText: {
        color: colors.textSecondary,
        fontSize: 24,
        marginBottom: 10,
        fontFamily: 'Poppins-Regular',
    },
    displayText: {
        color: colors.white,
        fontSize: 64,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
    },
    buttonsContainer: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: colors.card,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    button: {
        width: BUTTON_WIDTH,
        height: BUTTON_WIDTH,
        borderRadius: BUTTON_WIDTH / 2,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    buttonText: {
        fontSize: 28,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
});

export default CalculatorScreen;
