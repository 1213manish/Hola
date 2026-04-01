import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { ArrowLeft, Plus, Minus, Play } from 'lucide-react-native';
import { colors } from '../theme/colors';

const DashboardScreen = ({ navigation, route }) => {
    const { userName } = route.params || {};
    const displayHeaderName = userName || ''; // No name if skipped, or use userName
    const avatarInitial = displayHeaderName ? displayHeaderName.charAt(0).toUpperCase() : 'U';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft color={colors.white} size={24} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.welcomeText}>WELCOME BACK</Text>
                    <Text style={styles.nameText}>
                        Hi{displayHeaderName ? `, ${displayHeaderName}` : ''}!
                    </Text>
                </View>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{avatarInitial}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('Calculator')}
                >
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconContainer, { backgroundColor: '#2C3A5A' }]}>
                            <Plus color="#A5B4FC" size={24} />
                        </View>
                        <View style={styles.playButton}>
                            <Play fill="#A5B4FC" color="#A5B4FC" size={24} />
                        </View>
                    </View>
                    <Text style={styles.cardTitle}>Calculator</Text>
                    <Text style={styles.cardSubtitle}>Scientific and simple calculations</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('Scanner')}
                >
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconContainer, { backgroundColor: '#4A2A3A' }]}>
                            <Minus color="#F472B6" size={24} />
                        </View>
                        <View style={[styles.playButton, { backgroundColor: '#F472B6' }]}>
                            <Play fill="#FFFFFF" color="#FFFFFF" size={24} />
                        </View>
                    </View>
                    <Text style={styles.cardTitle}>QR Scanner</Text>
                    <Text style={styles.cardSubtitle}>Quick and secure code scanning</Text>
                </TouchableOpacity>
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
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        marginTop: 50,
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 30,
        elevation: 4,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitleContainer: {
        flex: 1,
    },
    welcomeText: {
        color: colors.textSecondary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
        fontFamily: 'Poppins-Bold',
    },
    nameText: {
        color: colors.white,
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: colors.black,
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
    },
    content: {
        padding: 20,
        gap: 20,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 40,
        padding: 25,
        borderWidth: 1,
        borderColor: '#33363B',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#3F4D71',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        color: colors.white,
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: 'Poppins-Bold',
    },
    cardSubtitle: {
        color: colors.textSecondary,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
});

export default DashboardScreen;
