import {getApps, initializeApp} from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB4HpXdD2elIhFVncR4BHWSTjBnoDHiJ54",
  authDomain: "polling-website-16f3d.firebaseapp.com",
  projectId: "polling-website-16f3d",
  storageBucket: "polling-website-16f3d.appspot.com",
  messagingSenderId: "509246459295",
  appId: "1:509246459295:web:4a07ef850018fd43ae41aa",
  measurementId: "G-VQF7DV263L"
};

export default function initFirebase() {
  if (getApps().length < 1) {
    initializeApp(firebaseConfig);
    console.log(getApps())
  }
}