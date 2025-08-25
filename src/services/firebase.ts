import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export class FirebaseService {
  static async initializeAuth() {
    try {
      if (!auth().currentUser) {
        const userCredential = await auth().signInAnonymously();
        console.log('User signed in anonymously:', userCredential.user.uid);
        return userCredential.user.uid;
      }
      return auth().currentUser.uid;
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      throw error;
    }
  }

  static async createRoom(hostId: string): Promise<string> {
    const roomCode = Math.random().toString(36).substr(2, 4).toUpperCase();
    
    const roomData = {
      host: hostId,
      guest: null,
      status: 'waiting',
      current_turn: hostId,
      created_at: Date.now(),
      last_image: null,
    };

    try {
      await database().ref(`rooms/${roomCode}`).set(roomData);
      await database().ref(`users/${hostId}`).set({
        current_room: roomCode,
        status: 'online',
      });
      
      console.log('Room created:', roomCode);
      return roomCode;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  static async joinRoom(guestId: string, roomCode: string): Promise<boolean> {
    try {
      const roomRef = database().ref(`rooms/${roomCode}`);
      const roomSnapshot = await roomRef.once('value');
      
      if (!roomSnapshot.exists()) {
        throw new Error('방이 존재하지 않습니다');
      }

      const roomData = roomSnapshot.val();
      
      if (roomData.guest) {
        throw new Error('방이 가득 찼습니다');
      }

      await roomRef.update({
        guest: guestId,
        status: 'playing',
      });

      await database().ref(`users/${guestId}`).set({
        current_room: roomCode,
        status: 'online',
      });

      console.log('Joined room:', roomCode);
      return true;
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }

  static listenToRoom(roomCode: string, callback: (roomData: any) => void) {
    const roomRef = database().ref(`rooms/${roomCode}`);
    
    const onValueChange = roomRef.on('value', snapshot => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      }
    });

    return () => roomRef.off('value', onValueChange);
  }

  static async sendImage(roomCode: string, senderId: string, imageBase64: string) {
    try {
      const imageData = {
        sender: senderId,
        image: imageBase64,
        timestamp: Date.now(),
      };

      await database().ref(`rooms/${roomCode}/last_image`).set(imageData);
      
      // 턴 변경
      const roomSnapshot = await database().ref(`rooms/${roomCode}`).once('value');
      const roomData = roomSnapshot.val();
      
      const nextTurn = roomData.current_turn === roomData.host ? roomData.guest : roomData.host;
      await database().ref(`rooms/${roomCode}/current_turn`).set(nextTurn);
      
      console.log('Image sent and turn changed');
    } catch (error) {
      console.error('Error sending image:', error);
      throw error;
    }
  }

  static async leaveRoom(userId: string, roomCode: string) {
    try {
      // 사용자 정보 정리
      await database().ref(`users/${userId}`).remove();
      
      // 방 정보 확인
      const roomSnapshot = await database().ref(`rooms/${roomCode}`).once('value');
      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.val();
        
        // 혼자 남은 경우 방 삭제
        if (roomData.host === userId && !roomData.guest) {
          await database().ref(`rooms/${roomCode}`).remove();
        } else if (roomData.guest === userId && roomData.host) {
          await database().ref(`rooms/${roomCode}/guest`).set(null);
          await database().ref(`rooms/${roomCode}/status`).set('waiting');
        } else {
          // 방 전체 삭제
          await database().ref(`rooms/${roomCode}`).remove();
        }
      }
      
      console.log('Left room:', roomCode);
    } catch (error) {
      console.error('Error leaving room:', error);
      throw error;
    }
  }
}