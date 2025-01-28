import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB4O9CFcOUh6ck4A1NDyIcu9P6vT-iPDSU",
  authDomain: "monthly-lottery.firebaseapp.com",
  projectId: "monthly-lottery",
  storageBucket: "monthly-lottery.firebasestorage.app",
  messagingSenderId: "434393685420",
  appId: "1:434393685420:web:cd2864fb4cd8a7c99a2e09"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 获取 Firestore 实例
export const db = getFirestore(app); 