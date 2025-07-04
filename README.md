# RentMate - Local Item Rental Platform

A full-stack web and mobile application that connects local item owners (lessors) with renters in Davao del Sur, featuring intelligent geospatial search.

## 🚀 Features

- **Shared Authentication**: Firebase Auth for both web and mobile
- **Geospatial Search**: Find items near you or in specific locations
- **Item Management**: Upload, browse, and manage rental items
- **User Roles**: Renters can upgrade to become lessors
- **Real-time Messaging**: Chat between renters and lessors
- **Reviews & Ratings**: Build trust through user feedback
- **Image Upload**: Firebase Storage for item photos
- **Push Notifications**: Stay updated on rental activities

## 🛠 Tech Stack

### Frontend
- **Web**: React 18 + Tailwind CSS + Vite
- **Mobile**: React Native + Expo SDK 50

### Backend & Services
- **Authentication**: Firebase Auth
- **Database**: Firestore with geospatial queries
- **Storage**: Firebase Storage
- **Functions**: Firebase Functions
- **Hosting**: Firebase Hosting (web) + Expo EAS (mobile)
- **Geospatial**: GeoFire + Firebase Extensions

## 📁 Project Structure

```
RentMate/
├── web/                    # React web application
├── mobile/                 # React Native mobile app
├── shared/                 # Shared utilities and types
├── firebase/               # Firebase configuration and functions
└── docs/                   # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase CLI
- Expo CLI

### 1. Clone and Setup
```bash
git clone <repository-url>
cd RentMate
npm install
```

### 2. Firebase Setup
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (run in firebase/ directory)
cd firebase
firebase init
```

### 3. Environment Variables
Create `.env` files in both `web/` and `mobile/` directories with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Start Development

**Web Application:**
```bash
cd web
npm install
npm run dev
```

**Mobile Application:**
```bash
cd mobile
npm install
npx expo start
```

## 📱 Mobile App Features

- User authentication (login/signup)
- Browse items with geospatial search
- Item details and booking
- User profile management
- Real-time messaging
- Push notifications
- Camera integration for item photos

## 🌐 Web App Features

- Responsive design with Tailwind CSS
- Advanced search filters
- Dashboard for lessors
- Item management interface
- User reviews and ratings
- Real-time chat interface

## 🔧 Firebase Configuration

The application uses Firebase for:
- **Authentication**: Email/password, Google, Facebook
- **Firestore**: User data, items, reviews, messages
- **Storage**: Item images and user avatars
- **Functions**: Geospatial queries, notifications
- **Extensions**: Algolia GeoSearch for advanced location search

## 🗺 Geospatial Features

- Location-based item search
- Distance calculation
- Address geocoding
- Map integration (Google Maps)
- Province-specific filtering (Davao del Sur)

## 📦 Deployment

### Web App
```bash
cd web
npm run build
firebase deploy --only hosting
```

### Mobile App
```bash
cd mobile
eas build --platform all
eas submit --platform all
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@rentmate.com or create an issue in the repository. 

## �� Next Steps

To get started with the application:

1. **Install Dependencies:**
   ```bash
   npm run setup
   ```

2. **Configure Firebase:**
   - Follow the detailed setup guide in `SETUP.md`
   - Set up environment variables
   - Configure Firebase project

3. **Start Development:**
   ```bash
   # Start all services
   npm run dev
   
   # Or start individually
   npm run dev:web      # Web app on localhost:3000
   npm run dev:mobile   # Mobile app with Expo
   npm run dev:firebase # Firebase emulators
   ```

### 🎯 Key Benefits

1. **Shared Code**: Common types and utilities between web and mobile
2. **Scalable Architecture**: Modular design with clear separation of concerns
3. **Geospatial Focus**: Optimized for location-based rental services
4. **Security First**: Comprehensive Firebase security rules
5. **Modern Development**: Latest React and React Native features
6. **Production Ready**: Deployment configurations for both platforms

The application is now ready for development! The comprehensive setup guide in `SETUP.md` will walk you through all the configuration steps needed to get the application running locally and deployed to production. #   R e n t M a t e 
 
 