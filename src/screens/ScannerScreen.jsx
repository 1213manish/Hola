import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Linking,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import {
    Camera,
    useCameraDevice,
    useCodeScanner,
} from 'react-native-vision-camera';
import { colors } from '../theme/colors';
import Clipboard from '@react-native-clipboard/clipboard';
import CustomAlert from '../components/CustomAlert';

const { width, height } = Dimensions.get('window');
const SCAN_AREA_SIZE = 250;

const ScannerScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(false);
    const [active, setActive] = useState(true);
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        buttons: [],
    });
    const camera = useRef(null);
    const device = useCameraDevice('back');

    const showAlert = (title, message, buttons = [], boxed = false) => {
        setAlertConfig({
            visible: true,
            title,
            message,
            buttons,
            boxed,
        });
    };

    const copyToClipboard = (text) => {
        Clipboard.setString(text);
    };

    const handleFocus = async (event) => {
        if (camera.current) {
            const { locationX, locationY } = event.nativeEvent;
            try {
                await camera.current.focus({
                    x: locationX,
                    y: locationY,
                });
            } catch (e) {
                // Focus might not be supported or fail silently
            }
        }
    };

    useEffect(() => {
        checkPermission();
    }, []);

    const checkPermission = async () => {
        const status = await Camera.getCameraPermissionStatus();
        if (status === 'granted') {
            setHasPermission(true);
        } else if (status === 'not-determined') {
            const permission = await Camera.requestCameraPermission();
            setHasPermission(permission === 'granted');
        } else {
            showAlert(
                'Permission Required',
                'Camera permission is needed to scan QR codes. Please enable it in settings.',
                [
                    { text: 'Cancel', style: 'cancel', onPress: () => navigation.goBack() },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() }
                ]
            );
        }
    };

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {
            if (active && codes.length > 0) {
                setActive(false);
                const value = codes[0].value;
                showAlert(
                    'QR Code Scanned',
                    value,
                    [{ text: 'OK', onPress: () => setActive(true) }],
                    true // boxed: true
                );
            }
        }
    });

    if (!device) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}>
                    <Text style={styles.errorText}>No camera device found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" transparent backgroundColor="transparent" />

            {hasPermission ? (
                <Camera
                    ref={camera}
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={active}
                    codeScanner={codeScanner}
                    enableZoomGesture
                />
            ) : (
                <View style={[styles.center, { backgroundColor: '#000' }]}>
                    <Text style={styles.scannerText}>Requesting Camera Permissions...</Text>
                </View>
            )}

            {/* Full Screen Overlay */}
            <TouchableWithoutFeedback onPress={handleFocus}>
                <View style={styles.overlayContainer}>
                    {/* Top Dimmed Area */}
                    <View style={styles.unfocusedContainer}>
                        <SafeAreaView>
                            <View style={styles.header}>
                                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                    <ArrowLeft color={colors.white} size={32} />
                                </TouchableOpacity>
                                <Text style={styles.headerTitle}>QR Scanner</Text>
                                <View style={{ width: 32 }} />
                            </View>
                            <Text style={styles.instructions}>Align QR code within the frame to scan</Text>
                        </SafeAreaView>
                    </View>

                    {/* Middle Scanning Row */}
                    <View style={styles.middleRow}>
                        <View style={styles.unfocusedSide}></View>
                        <View style={styles.focusedArea}>
                            {/* Corner Markers */}
                            <View style={[styles.corner, styles.topLeft]} />
                            <View style={[styles.corner, styles.topRight]} />
                            <View style={[styles.corner, styles.bottomLeft]} />
                            <View style={[styles.corner, styles.bottomRight]} />
                        </View>
                        <View style={styles.unfocusedSide}></View>
                    </View>

                    {/* Bottom Dimmed Area */}
                    <View style={styles.unfocusedContainer}>
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.cancelButtonText}>Cancel Scanning</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>

            {/* Custom Alert Overlay */}
            {alertConfig.visible && (
                <View style={StyleSheet.absoluteFill}>
                    <CustomAlert
                        visible={alertConfig.visible}
                        title={alertConfig.title}
                        message={alertConfig.message}
                        buttons={alertConfig.buttons}
                        onCopy={copyToClipboard}
                        boxed={alertConfig.boxed}
                        onClose={() => {
                            setAlertConfig({ ...alertConfig, visible: false });
                            setActive(true); // Ensure scanner is reactivated on any close
                        }}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    unfocusedContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    header: {
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 70,
    },
    headerTitle: {
        color: colors.white,
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
    },
    instructions: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginTop: 25,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    middleRow: {
        flexDirection: 'row',
        height: SCAN_AREA_SIZE,
    },
    unfocusedSide: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    focusedArea: {
        width: SCAN_AREA_SIZE,
        height: SCAN_AREA_SIZE,
        backgroundColor: 'transparent',
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: colors.primary,
        borderWidth: 5,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: 15,
    },
    topRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: 15,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: 15,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: 15,
    },
    footer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 40,
    },
    cancelButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    cancelButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scannerText: {
        color: colors.white,
        fontSize: 14,
        textAlign: 'center',
    },
    errorText: {
        color: colors.white,
    },
});

export default ScannerScreen;
