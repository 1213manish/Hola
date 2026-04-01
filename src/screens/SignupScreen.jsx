import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { User, Lock, Eye, EyeOff, Mail, ArrowLeft } from 'lucide-react-native';
import auth from '@react-native-firebase/auth';
import { colors } from '../theme/colors';
import CustomAlert from '../components/CustomAlert';

const { width } = Dimensions.get('window');

const SignupScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    const handleSignup = async () => {
        if (!email || !password || !name) {
            showAlert("Error", "Please fill in all fields");
            return;
        }
        if (password !== confirmPassword) {
            showAlert("Error", "Passwords don't match!");
            return;
        }

        setLoading(true);
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            // Optionally update user profile with name
            await userCredential.user.updateProfile({
                displayName: name,
            });

            showAlert("Success", "Account created successfully!", [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]);
        } catch (error) {
            let errorMessage = "Something went wrong. Please try again.";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "That email address is already in use!";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "That email address is invalid!";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "The password is too weak!";
            }
            showAlert("Signup failed", errorMessage);
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
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <ArrowLeft color={colors.primary} size={24} />
                        </TouchableOpacity>

                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>Create Account</Text>
                            <Text style={styles.tagline}>Fill in your details to get started</Text>
                        </View>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>FULL NAME</Text>
                            <View style={styles.inputWrapper}>
                                <User color={colors.textSecondary} size={20} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Name"
                                    placeholderTextColor={colors.textSecondary}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>EMAIL</Text>
                            <View style={styles.inputWrapper}>
                                <Mail color={colors.textSecondary} size={20} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="yourname@email.com"
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
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
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

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>CONFIRM PASSWORD</Text>
                            <View style={styles.inputWrapper}>
                                <Lock color={colors.textSecondary} size={20} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="........"
                                    placeholderTextColor={colors.textSecondary}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? (
                                        <EyeOff color={colors.textSecondary} size={20} />
                                    ) : (
                                        <Eye color={colors.textSecondary} size={20} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.signupButton}
                            onPress={handleSignup}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={colors.black} />
                            ) : (
                                <Text style={styles.signupButtonText}>SIGN UP</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginText}>LOGIN</Text>
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
        flex: 0.8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        minHeight: 200,
    },
    backButton: {
        position: 'absolute',
        top: 45,
        left: 20,
    },
    headerTextContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.white,
        letterSpacing: 1,
        fontFamily: 'Poppins-Bold',
    },
    tagline: {
        fontSize: 14,
        color: colors.primary,
        marginTop: 5,
        fontFamily: 'Poppins-Regular',
    },
    formContainer: {
        flex: 1.5,
        backgroundColor: colors.card,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        paddingBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
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
    signupButton: {
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
    signupButtonText: {
        color: colors.black,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
        fontFamily: 'Poppins-Bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
        paddingBottom: 20,
    },
    footerText: {
        color: colors.textSecondary,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    loginText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
    },
});

export default SignupScreen;
