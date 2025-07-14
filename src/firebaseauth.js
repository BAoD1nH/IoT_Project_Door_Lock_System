import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// ------------------------------------------------ FIREBASE SECTION ------------------------------------------------ //
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJL4_QZhwMQ9lvGmRClid44-zkxhBoTKw",
    authDomain: "smart-door-lock-system-b9897.firebaseapp.com",
    projectId: "smart-door-lock-system-b9897",
    storageBucket: "smart-door-lock-system-b9897.firebasestorage.app",
    messagingSenderId: "944814146140",
    appId: "1:944814146140:web:8f01ba9d1a1281b1e6dc99",
    measurementId: "G-C6BHJ1T7ZQ"
};


const app = initializeApp(firebaseConfig);

// Show message 
function showMessage(message, divId) {
    let messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function(){
        messageDiv.style.opacity = 0;
    }, 10000);
}

// Sign Up Functionality - User need to provide {UserName}, {Email}, {PhoneNumber}, {Password}
// The user data will be saved / wrote on the FirebaseStore database 
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    
    const name = document.getElementById('rname').value;
    const email = document.getElementById('remail').value;
    const phoneNumber = document.getElementById('rphonenumber').value;
    const password = document.getElementById('rpassword').value;

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
            Name: name,
            Email: email,
            PhoneNumber: phoneNumber
        };

        showMessage('Account created successfully', 'signUpMessage');
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then(() => {
            window.location.href = 'register_login.html#signin';
        })
        .catch((error) => {
            console.error("Error writing document", error);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error("🔥 Firebase Auth Error Code:", errorCode);
        console.error("🔥 Firebase Auth Error Message:", errorMessage);

        if (errorCode === 'auth/email-already-in-use') {
            showMessage('Email đã được sử dụng!', 'signUpMessage');
        } else if (errorCode === 'auth/invalid-email') {
            showMessage('Email không hợp lệ.', 'signUpMessage');
        } else if (errorCode === 'auth/weak-password') {
            showMessage('Mật khẩu phải từ 6 ký tự trở lên.', 'signUpMessage');
        } else if (errorCode === 'auth/operation-not-allowed') {
            showMessage('Tính năng Email/Password chưa được bật trong Firebase.', 'signUpMessage');
        } else {
            showMessage('Không thể tạo tài khoản: ' + errorMessage, 'signUpMessage');
        }
    });
})

// Sign In Functionality - User need to provide {Email}, {Password}
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        showMessage('Login is successful', 'signInMessage');
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = 'user.html';
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode=='auth/invalid-credential'){
            showMessage('Incorrect Email or Password', 'signInMessage');
        }
        else {
            showMessage("Account does not Exist", 'signInMessage');
        }
    })
})