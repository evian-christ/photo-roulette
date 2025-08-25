import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {FirebaseService} from '../services/firebase';

const HomeScreen = ({navigation}: any) => {
  const [roomCode, setRoomCode] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      const uid = await FirebaseService.initializeAuth();
      setUserId(uid);
    } catch (error) {
      Alert.alert('오류', 'Firebase 연결에 실패했습니다');
    }
  };

  const handleJoinRoom = async () => {
    if (roomCode.length !== 4) {
      Alert.alert('알림', '4자리 방 코드를 입력해주세요');
      return;
    }

    if (!userId) {
      Alert.alert('오류', '사용자 인증이 필요합니다');
      return;
    }

    try {
      await FirebaseService.joinRoom(userId, roomCode.toUpperCase());
      navigation.navigate('WaitingRoom', {
        roomCode: roomCode.toUpperCase(),
        isHost: false,
        userId,
      });
    } catch (error: any) {
      Alert.alert('오류', error.message);
    }
  };

  const handleCreateRoom = async () => {
    if (!userId) {
      Alert.alert('오류', '사용자 인증이 필요합니다');
      return;
    }

    try {
      const newRoomCode = await FirebaseService.createRoom(userId);
      navigation.navigate('WaitingRoom', {
        roomCode: newRoomCode,
        isHost: true,
        userId,
      });
    } catch (error: any) {
      Alert.alert('오류', '방 생성에 실패했습니다');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PhotoRoulette</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="방 코드 입력 (예: ABCD)"
          value={roomCode}
          onChangeText={setRoomCode}
          maxLength={4}
          autoCapitalize="characters"
        />
        <TouchableOpacity style={styles.button} onPress={handleJoinRoom}>
          <Text style={styles.buttonText}>참가하기</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCreateRoom}>
        <Text style={styles.buttonText}>방 만들기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;