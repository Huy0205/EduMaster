import { initializeApp } from "firebase/app";
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDm_oi-MITnp22ssUeP9vt3TYYs4WEc2fY",
  authDomain: "edumaster-f3619.firebaseapp.com",
  projectId: "edumaster-f3619",
  storageBucket: "edumaster-f3619.appspot.com",
  messagingSenderId: "179311449886",
  appId: "1:179311449886:web:8feba192d4842628f8db0f",
  measurementId: "G-4FGTFTKJF3"
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
