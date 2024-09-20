import {doc, getDoc} from 'firebase/firestore'
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth, db} from './firebase';

const loginUser = async (email,password) => {
    try{
        const userCredential = await signInWithEmailAndPassword(auth,email,password); 
        const user = userCredential.user; 
       
        const userDoc = await getDoc(doc(db, 'users', user.uid))

        if(userDoc.exists()) {
            const userData = userDoc.data();
            const userRole = userData.role; 
            console.log('Loggen in as a ${userRole}'); 

            if(userRole === 'administrator')
            {
                //show administrator 
            }
            else if(userRole === 'manager')
            {
                //show manager
            }
            else{
                //show user
            }
        }

    }catch(error){
        console.error('Error loggin in: ', error.message); 
    }
};