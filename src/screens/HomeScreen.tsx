import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from '@react-native-firebase/app';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../types/navigation';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [firebaseStatus, setFirebaseStatus] = useState<string>('Checking...');

  const checkFirebaseManually = async () => {
    console.log('🔥 Manual Firebase Check: Button pressed');
    try {
      // Check if already initialized
      if (firebase.apps.length === 0) {
        console.log('🔥 Manual Firebase Check: No apps found, manual init needed');
        setFirebaseStatus('Not initialized - restart app');
        return;
      }
      
      const app = firebase.app();
      console.log('🔥 Manual Firebase Check: App name:', app.name);
      console.log('🔥 Manual Firebase Check: App options:', app.options);
      console.log('🔥 Manual Firebase Check: Project ID:', app.options.projectId);
      setFirebaseStatus(`Connected ✅ Project: ${app.options.projectId}`);
    } catch (error) {
      console.error('🔥 Manual Firebase Check: Error:', error);
      setFirebaseStatus(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    const initFirebase = async () => {
      console.log('🔥 Firebase Debug: Starting initialization...');
      
      try {
        // Check if already initialized
        let app;
        try {
          app = firebase.app();
          console.log('🔥 Firebase Debug: Already initialized');
          setFirebaseStatus(`Connected ✅ ${app.options.projectId}`);
          return;
        } catch (noDefaultApp) {
          console.log('🔥 Firebase Debug: No default app, initializing...');
        }
        
        // Initialize Firebase manually if not auto-initialized
        const firebaseConfig = {
          apiKey: "AIzaSyBuHIxIFmU_IFCBpkvf4djGlxWyuswYCxk",
          authDomain: "photoroulette-ef3c1.firebaseapp.com",
          databaseURL: "https://photoroulette-ef3c1-default-rtdb.firebaseio.com/",
          projectId: "photoroulette-ef3c1",
          storageBucket: "photoroulette-ef3c1.firebasestorage.app",
          messagingSenderId: "4307345694",
          appId: "1:4307345694:ios:df2b0b43eee15838b1a90f"
        };
        
        await firebase.initializeApp(firebaseConfig);
        app = firebase.app();
        console.log('🔥 Firebase Debug: Successfully initialized');
        console.log('🔥 Firebase Debug: Project ID:', app.options.projectId);
        setFirebaseStatus(`Connected ✅ ${app.options.projectId}`);
      } catch (error) {
        console.error('🔥 Firebase Debug: Initialization error:', error);
        setFirebaseStatus(`Init Error: ${error.message}`);
      }
    };
    
    initFirebase();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="camera" size={50} color="#007AFF" />
        <Text style={styles.title}>PhotoRoulette</Text>
      </View>
      <Text style={styles.subtitle}>Share random photos in real-time!</Text>
      
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{firebaseStatus}</Text>
        <TouchableOpacity 
          style={styles.debugButton} 
          onPress={checkFirebaseManually}>
          <Text style={styles.debugButtonText}>🔍 Manual Check</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Room')}>
        <Icon name="enter" size={20} color="white" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Join Room</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Room')}>
        <Icon name="add-circle" size={20} color="white" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Create Room</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    minWidth: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  statusBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  debugButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'center',
  },
  debugButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default HomeScreen;