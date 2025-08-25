import {launchImageLibrary, ImagePickerResponse, MediaType} from 'react-native-image-picker';
import {PermissionsAndroid, Platform, Alert} from 'react-native';

export class ImageService {
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: '갤러리 접근 권한',
            message: '게임을 위해 갤러리에 접근이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '거부',
            buttonPositive: '허용',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS는 앱 설정에서 자동 요청
  }

  static async getRandomImage(): Promise<string> {
    const hasPermission = await this.requestPermissions();
    
    if (!hasPermission) {
      throw new Error('갤러리 접근 권한이 필요합니다');
    }

    return new Promise((resolve, reject) => {
      const options = {
        mediaType: 'photo' as MediaType,
        includeBase64: true,
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.7,
      };

      launchImageLibrary(options, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          reject(new Error('이미지 선택이 취소되었습니다'));
          return;
        }

        if (response.errorMessage) {
          reject(new Error(response.errorMessage));
          return;
        }

        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          if (asset.base64) {
            resolve(`data:image/jpeg;base64,${asset.base64}`);
          } else {
            reject(new Error('이미지를 불러올 수 없습니다'));
          }
        } else {
          reject(new Error('이미지를 선택해주세요'));
        }
      });
    });
  }

  static async getRandomImageFromGallery(): Promise<string> {
    try {
      // 실제로는 갤러리에서 랜덤하게 선택하는 로직이 필요하지만
      // 현재는 사용자가 직접 선택하도록 구현
      const imageBase64 = await this.getRandomImage();
      return imageBase64;
    } catch (error) {
      console.error('Error getting random image:', error);
      throw error;
    }
  }
}