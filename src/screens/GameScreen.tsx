import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary, ImagePickerResponse, MediaType} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../types/navigation';

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;

const GameScreen: React.FC = () => {
  const navigation = useNavigation<GameScreenNavigationProp>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectRandomImage = () => {
    setIsLoading(true);
    
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      setIsLoading(false);
      
      if (response.didCancel) {
        Alert.alert('Cancelled', 'Photo selection was cancelled');
        return;
      }

      if (response.errorMessage) {
        Alert.alert('Error', `Failed to select photo: ${response.errorMessage}`);
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        if (asset.uri) {
          setSelectedImage(asset.uri);
          Alert.alert('Success!', 'Photo selected successfully! In a real game, this would be shared with other players.');
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Screen</Text>
      <Text style={styles.subtitle}>Your turn!</Text>
      
      <View style={styles.gameArea}>
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Text style={styles.instruction}>Photo selected and shared!</Text>
            <Image source={{uri: selectedImage}} style={styles.selectedImage} />
          </View>
        ) : (
          <>
            <Text style={styles.instruction}>
              Tap "Select Photo" to choose a photo from your gallery
            </Text>
            
            <View style={styles.countdown}>
              <Text style={styles.countdownText}>3</Text>
              <Text style={styles.countdownLabel}>seconds remaining</Text>
            </View>
          </>
        )}
      </View>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={selectRandomImage}
        disabled={isLoading}>
        <Icon 
          name={selectedImage ? "refresh" : "images"} 
          size={20} 
          color="white" 
          style={styles.buttonIcon} 
        />
        <Text style={styles.buttonText}>
          {isLoading ? 'Selecting...' : selectedImage ? 'Select Another Photo' : 'Select Photo'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={20} color="white" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Back to Room</Text>
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
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 30,
  },
  gameArea: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  countdown: {
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  countdownLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
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
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  imageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 15,
  },
});

export default GameScreen;