import React from 'react';
import {
    Modal,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { colors } from '../theme/colors';
import { Copy } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const CustomAlert = ({
    visible,
    title,
    message,
    buttons = [],
    onClose,
    onCopy,
    boxed = false
}) => {
    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <View style={styles.alertContainer}>
                {title ? (
                    <Text style={styles.title}>{title}</Text>
                ) : null}

                {message ? (
                    boxed ? (
                        <View style={styles.messageBox}>
                            <Text style={styles.message}>{message}</Text>
                            {onCopy && (
                                <TouchableOpacity
                                    style={styles.copyButton}
                                    onPress={() => onCopy(message)}
                                >
                                    <Copy color={colors.textSecondary} size={20} />
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <Text style={styles.plainMessage}>{message}</Text>
                    )
                ) : null}

                <View style={styles.buttonContainer}>
                    {buttons.length > 0 ? (
                        buttons.map((button, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.button,
                                    button.style === 'cancel' ? styles.cancelButton : styles.primaryButton,
                                    buttons.length > 2 && { width: '100%', marginBottom: 10 }
                                ]}
                                onPress={() => {
                                    if (button.onPress) button.onPress();
                                    onClose();
                                }}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    button.style === 'cancel' ? styles.cancelButtonText : styles.primaryButtonText
                                ]}>
                                    {button.text}
                                </Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>OK</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        zIndex: 1000,
    },
    alertContainer: {
        width: width * 0.85,
        maxWidth: 400,
        backgroundColor: colors.card,
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        elevation: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.58,
        shadowRadius: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 12,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
        letterSpacing: 0.5,
    },
    messageBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    message: {
        fontSize: 14,
        color: colors.text,
        fontFamily: 'Poppins-Medium',
        lineHeight: 20,
        flex: 1,
        textAlign: 'left',
    },
    plainMessage: {
        fontSize: 15,
        color: colors.textSecondary,
        marginBottom: 24,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
        lineHeight: 22,
    },
    copyButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        marginLeft: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        gap: 12,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
    },
    primaryButton: {
        backgroundColor: colors.primary,
    },
    cancelButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    primaryButtonText: {
        color: '#000',
    },
    cancelButtonText: {
        color: colors.textSecondary,
    },
});

export default CustomAlert;
