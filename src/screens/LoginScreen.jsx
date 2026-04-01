import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Dimensions,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { User, Lock, Eye, EyeOff } from 'lucide-react-native';
import auth from '@react-native-firebase/auth';
import { colors } from '../theme/colors';
import CustomAlert from '../components/CustomAlert';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        buttons: [],
    });

    const showAlert = (title, message, buttons = []) => {
        setAlertConfig({
            visible: true,
            title,
            message,
            buttons,
        });
    };

    const handleLogin = async () => {
        if (!email || !password) {
            showAlert("Error", "Please enter both email and password.");
            return;
        }

        setLoading(true);
        try {
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            navigation.navigate('Dashboard', {
                userName: user.displayName || email.split('@')[0]
            });
        } catch (error) {
            let errorMessage = "Invalid email or password.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = "Incorrect email or password.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "That email address is invalid!";
            }
            showAlert("Login Failed", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={() => navigation.navigate('Dashboard', { userName: '' })}
                        >
                            <Text style={styles.skipText}>Skip</Text>
                        </TouchableOpacity>

                        <View style={styles.logoContainer}>
                            <View style={styles.logoIcon}>
                                <View style={styles.logoLine} />
                                <View style={[styles.logoLine, { height: 40 }]} />
                                <View style={styles.logoLine} />
                            </View>
                            <Text style={styles.logoText}>Hola</Text>
                            <Text style={styles.tagline}>Enter the light</Text>
                        </View>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>EMAIL</Text>
                            <View style={styles.inputWrapper}>
                                <User color={colors.textSecondary} size={20} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor={colors.textSecondary}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>PASSWORD</Text>
                            <View style={styles.inputWrapper}>
                                <Lock color={colors.textSecondary} size={20} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="........"
                                    placeholderTextColor={colors.textSecondary}
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <EyeOff color={colors.textSecondary} size={20} />
                                    ) : (
                                        <Eye color={colors.textSecondary} size={20} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={colors.black} />
                            ) : (
                                <Text style={styles.loginButtonText}>LOGIN</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don’t have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text style={styles.signupText}>SIGN UP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                buttons={alertConfig.buttons}
                onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        minHeight: 250,
    },
    skipButton: {
        position: 'absolute',
        top: 40,
        right: 30,
    },
    skipText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logoIcon: {
        width: 80,
        height: 80,
        backgroundColor: '#E6B89C',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        marginBottom: 20,
        elevation: 10,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
    logoLine: {
        width: 6,
        height: 25,
        backgroundColor: '#6D4C41',
        borderRadius: 3,
    },
    logoText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: colors.white,
        letterSpacing: 1,
        fontFamily: 'Poppins-Bold',
    },
    tagline: {
        fontSize: 18,
        color: colors.primary,
        marginTop: 5,
        fontFamily: 'Poppins-Regular',
    },
    formContainer: {
        backgroundColor: colors.card,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        paddingBottom: 50,
        flex: 1,
    },
    inputGroup: {
        marginBottom: 25,
    },
    label: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
        letterSpacing: 1,
        fontFamily: 'Poppins-Bold',
    },
    inputWrapper: {
        backgroundColor: colors.inputBackground,
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: colors.text,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    loginButton: {
        backgroundColor: colors.primary,
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    loginButtonText: {
        color: colors.black,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
        fontFamily: 'Poppins-Bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
    },
    footerText: {
        color: colors.textSecondary,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    signupText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
    },
});

export default LoginScreen;
