import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDFoKT5T_Ng6UwgyQV4qCpprviqR9TaTgw',
  authDomain: 'fir-authentication-hands.firebaseapp.com',
  projectId: 'fir-authentication-hands',
  storageBucket: 'fir-authentication-hands.firebasestorage.app',
  messagingSenderId: '422450192262',
  appId: '1:422450192262:web:633f2151552278906fd607'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function App() {
  const [user, setUser] = useState(null);
  const [apiResponse, setApiResponse] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,
      (user) => {
        console.log(`onAuthStateChanged successed user:${user}`);
        setUser(user);
      },
      (error) => {
        console.log(`onAuthStateChanged error:${error.message}`);
        setApiResponse(`onAuthStateChanged error:${error.message}`);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(`signInWithPopup successed user:${result.user}`);

      }).catch((error) => {
        console.log(`signInWithPopup error:${error.message}`);
        setApiResponse(`signInWithPopup error:${error.message}`);
      });
  };

  // ログアウト処理
  const handleLogout = async () => {
    signOut(auth)
      .then(() => {
        console.log(`signOut successed`);
        setUser(null);
        setApiResponse('');
      })
      .catch((error) => {
        console.log(`signOut error:${error.message}`);
        setApiResponse(`signOut error:${error.message}`);
      });
  };

  const handleApi = async () => {
    if (!user) {
      console.log(`user is not logged in`);
      setApiResponse('');
      return;
    }

    user.getIdToken()
      .then(token => {
        console.log(`getIdToken successed token:${token}`);
        return fetch(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      }).then(res => {
        return res.json();
      }).then(data => {
        console.log(`API successed`);
        setApiResponse(JSON.stringify(data));
      })
      .catch(error => {
        console.log(`API error:${error.message}`);
        setApiResponse(`API error:${error.message}`);
      });
  };

  const handleApiWithInvalidToken = async () => {
    const invalidToken = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxeyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3NzQ4NTAwMmYwNWJlMDI2N2VmNDU5ZjViNTEzNTMzYjVjNThjMTIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVGFybyBTZW8iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSnNRMGFkRmd3cWY5bFlnLUlQbnMzZWJHcDgtQk5FYnJyMWZFTW5UM2dmcFFOTnY2UExVUT1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9maXItYXV0aGVudGljYXRpb24taGFuZHMiLCJhdWQiOiJmaXItYXV0aGVudGljYXRpb24taGFuZHMiLCJhdXRoX3RpbWUiOjE3NTE2ODE1MjUsInVzZXJfaWQiOiJ0OEZXQWF4bmVIVDNkWkR5bnI5STNqcE9SZjEzIiwic3ViIjoidDhGV0FheG5lSFQzZFpEeW5yOUkzanBPUmYxMyIsImlhdCI6MTc1MTY4MTUyNSwiZXhwIjoxNzUxNjg1MTI1LCJlbWFpbCI6Im1haWwyMDE3QHNlb3Rhcm8uY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTAwNTYzMzAzMjY1OTI4NTE2NDYiXSwiZW1haWwiOlsibWFpbDIwMTdAc2VvdGFyby5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.ED1U-pNJ8jpkqwTllqyqRi8C2GFtrxzbTp4TxpZSZc7rq_t0yM51_kcalBt0Lt-k7HC6k7xzgFiGC0Rm9Se0kcVwa_BKwud8KTRrNC03tgRzbPP1ZRTVvOtRSbxUd0fhLAYlk4WvD5N_5zklEwINr68dJtCgdl6RIGROtdDCggAtoS9NZQqKh87wGCJbJLZWoWJzvuXwoEtSU3oAoPKruyH6rB_gDXRcvVILiXki3pzB8vRLlSTcy5MJxBH261LCz1TErdk8lM6qLbQYz5XUwkAhkvp3I';

    fetch(API_URL, { headers: { Authorization: `Bearer ${invalidToken}` } })
      .then(res => {
        return res.json();
      }).then(data => {
        console.log(`API successed`);
        setApiResponse(JSON.stringify(data));
      })
      .catch(error => {
        console.log(`API error:${error.message}`);
        setApiResponse(`API error:${error.message}`);
      });
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* ヘッダー */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-6xl mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                firebase-authentication-hands-on
              </h1>
            </div>
            <div>
              <span className='mr-4 text-sm text-gray-600'>
                {user ? `${user.displayName}でログイン中` : '未ログイン'}
              </span>
              <button
                className={`mr-2 px-4 py-1 rounded ${user ? 'bg-gray-200 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                onClick={handleLogin}
                disabled={user}
              >
                Googleでログイン
              </button>
              <button
                className={`px-4 py-1 rounded ${user ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 hover:bg-gray-300'}`}
                onClick={handleLogout}
                disabled={!user}
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className='max-w-6xl mx-auto px-4 py-6'>
        <div className='space-y-4'>
          <div className='p-5 bg-white rounded-lg shadow-sm border overflow-hidden'>
            <div className='mb-4'>
              <button
                className={`mr-4 px-4 py-1 rounded ${user ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 hover:bg-gray-300'}`}
                onClick={handleApi}
                disabled={!user}
              >
                API実行
              </button>

              <button
                className='px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700'
                onClick={handleApiWithInvalidToken}
              >
                不正なユーザートークンでAPI実行
              </button>
            </div>
            <div className=''>
              <p>レスポンス: {apiResponse}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;