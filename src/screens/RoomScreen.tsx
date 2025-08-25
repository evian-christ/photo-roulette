import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../types/navigation';

type RoomScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Room'>;

const RoomScreen: React.FC = () => {
  const navigation = useNavigation<RoomScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room ABCD</Text>
      <Text style={styles.status}>Waiting for player...</Text>
      
      <View style={styles.infoBox}>
        <Icon name="people" size={30} color="#007AFF" />
        <Text style={styles.infoText}>Share this room code with a friend:</Text>
        <Text style={styles.roomCode}>ABCD</Text>
      </View>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Game')}>
        <Icon name="play" size={20} color="white" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Start Game (Test)</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={() => navigation.goBack()}>
        <Icon name="home" size={20} color="white" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Back to Home</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  roomCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    letterSpacing: 2,
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
  backButton: {
    backgroundColor: '#666',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RoomScreen;