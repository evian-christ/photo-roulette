# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PhotoRoulette is a React Native social gaming app where users randomly share photos from their gallery in real-time rooms. The app uses a turn-based system with automatic 3-second countdown sharing for a thrilling experience.

## Technology Stack

- **Frontend**: React Native with TypeScript
- **Navigation**: React Navigation
- **Image Handling**: react-native-image-picker
- **Backend**: Firebase Realtime Database, Firebase Storage, Firebase Auth (anonymous)

## Development Commands

When the project is set up, typical commands will be:

```bash
# Install dependencies
npm install
# or
yarn install

# Start Metro bundler
npx react-native start

# Run on iOS
npx react-native run-ios

# Run on Android  
npx react-native run-android

# TypeScript checking
npx tsc --noEmit

# Linting (when configured)
npm run lint
```

## Architecture Overview

### Core Components Structure
- **Room System**: Code-based 2-player matching with Firebase Realtime Database
- **Turn-Based Game Logic**: Host and guest alternate turns with real-time synchronization
- **Random Photo Selection**: Gallery access with random image picker
- **Auto-Share Mechanism**: 3-second countdown with forced image transmission

### Data Flow
1. **Room Creation/Joining**: 4-character room codes stored in Firebase
2. **Real-time State Management**: Room status, current turn, and shared images synchronized via Firebase listeners
3. **Image Pipeline**: Gallery → Random selection → Firebase Storage → Real-time sharing

### Firebase Schema
```
rooms/{roomCode}:
  - host: user_id
  - guest: user_id  
  - current_turn: user_id
  - status: waiting/playing/finished
  - last_image: { sender, url, timestamp }

users/{userId}:
  - current_room: roomCode
  - status: online
```

### Screen Flow
Home → Room Creation/Joining → Waiting Room → Game Screen (alternating turns)

## Key Implementation Notes

- Images are temporarily stored in Firebase Storage with 24-hour auto-deletion
- Anonymous authentication for user identification
- Real-time listeners handle room state synchronization and turn management
- Image compression required before upload for performance
- Platform-specific permissions needed for gallery access (iOS: NSPhotoLibraryUsageDescription, Android: READ_EXTERNAL_STORAGE)