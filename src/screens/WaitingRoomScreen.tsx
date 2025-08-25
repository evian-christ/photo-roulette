import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const WaitingRoomScreen = ({navigation, route}: any) => {
  const {roomCode, isHost} = route.params;
  const [guestJoined, setGuestJoined] = useState(false);

  useEffect(() => {
    // TODO: Firebase 리스너 설정
    // 방 상태 변화 감지
    if (isHost) {
      // 호스트: 게스트 참가 대기
    } else {
      // 게스트: 즉시 게임 시작 가능
      setGuestJoined(true);
    }
  }, []);

  const handleStartGame = () => {
    if (isHost && !guestJoined) {
      Alert.alert('알림', '상대방이 참가할 때까지 기다려주세요');
      return;
    }
    navigation.navigate('Game', {roomCode, isHost});
  };

  const handleLeaveRoom = () => {
    // TODO: Firebase에서 방 나가기 처리
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.roomCode}>방 코드: {roomCode}</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          👤 {isHost ? '방장: 당신' : '참가자: 당신'}
        </Text>
        <Text style={styles.statusText}>
          {isHost 
            ? (guestJoined ? '✅ 상대방 참가완료' : '⏳ 상대방 대기 중...')
            : '✅ 게임 준비완료'
          }
        </Text>
      </View>

      {(guestJoined || !isHost) && (
        <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
          <Text style={styles.startButtonText}>게임 시작</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveRoom}>
        <Text style={styles.leaveButtonText}>방 나가기</Text>
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
  roomCode: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  statusContainer: {
    marginBottom: 40,
  },
  statusText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  leaveButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  leaveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WaitingRoomScreen;