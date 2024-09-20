import {doc, getDoc} from 'firebase/firestore'
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth, db} from './firebase';

const loginUser = async (email,password) => {
    try{
        const userCredential = await signInWithEmailAndPassword(auth,email,password); 
        const user = userCredential.user; 
       
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if(userDoc.exists())
        {
            const userData = userDoc.data();
            console.log('Logged in user role: ', userData.role);

            handleUserRole(userData.role);
        }else{
            console.log('No user data found')
        }
    }catch(error){
        console.error('Error loggin in: ', error.message); 
    }
};

const handleUserRole = (role) => {
   /* if(role === 'administrator')
    {
        window.location.href = //admin dashboard ; 
    }
    else if(role === 'manager')
    {
        window.location.href = //manager dashboard ; 
    }
    else
    {
        window.location.href = //user dashboard ; 
    }
        */
};