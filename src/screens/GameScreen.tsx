import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';

const GameScreen = ({navigation, route}: any) => {
  const {roomCode, isHost} = route.params;
  const [currentTurn, setCurrentTurn] = useState(isHost ? 'host' : 'guest');
  const [countdown, setCountdown] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [receivedImage, setReceivedImage] = useState<string | null>(null);

  const isMyTurn = () => {
    return (isHost && currentTurn === 'host') || (!isHost && currentTurn === 'guest');
  };

  const handlePickImage = () => {
    // TODO: react-native-image-picker로 랜덤 이미지 선택
    const mockImageUri = 'https://picsum.photos/300/300';
    setSelectedImage(mockImageUri);
    
    // 3초 카운트다운 시작
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSendImage(mockImageUri);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendImage = (imageUri: string) => {
    // TODO: Firebase Storage에 이미지 업로드 및 상대방에게 전송
    Alert.alert('전송완료', '사진이 상대방에게 전송되었습니다!');
    
    // 턴 변경
    setCurrentTurn(currentTurn === 'host' ? 'guest' : 'host');
    setSelectedImage(null);
  };

  const handleLeaveRoom = () => {
    Alert.alert(
      '방 나가기',
      '정말로 게임을 종료하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {text: '나가기', onPress: () => navigation.navigate('Home')},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.roomCode}>방: {roomCode}</Text>
      
      <Text style={styles.turnText}>
        {isMyTurn() ? '당신의 차례!' : '상대방 차례'}
      </Text>

      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{uri: selectedImage}} style={styles.previewImage} />
          {countdown > 0 && (
            <View style={styles.countdownOverlay}>
              <Text style={styles.countdownText}>{countdown}</Text>
              <Text style={styles.countdownSubtext}>자동 공유됩니다</Text>
            </View>
          )}
        </View>
      )}

      {receivedImage && (
        <View style={styles.imageContainer}>
          <Text style={styles.receivedLabel}>받은 사진:</Text>
          <Image source={{uri: receivedImage}} style={styles.receivedImage} />
        </View>
      )}

      {isMyTurn() && !selectedImage && (
        <TouchableOpacity style={styles.pickButton} onPress={handlePickImage}>
          <Text style={styles.pickButtonText}>📸 사진 뽑기</Text>
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
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  roomCode: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  turnText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  receivedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  receivedLabel: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#666',
  },
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  countdownSubtext: {
    fontSize: 16,
    color: 'white',
    marginTop: 10,
  },
  pickButton: {
    backgroundColor: '#FF6B6B',
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 30,
  },
  pickButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  leaveButton: {
    backgroundColor: '#999',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  leaveButtonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default GameScreen;