import { createUserWithEmailAndPassword } from "firebase/auth";
import {collection, doc, setDoc} from 'firebase/firestore';
import {auth, db} from './firebase';

const registerUser = async (email,password,role) => {
    try{
        const userCredential = await createUserWithEmailAndPassword(auth,email,password); 
        const user = userCredential.user; 

        await setDoc(doc(db,'users',user.uid), {
            email: user.email,
            role: role,
            uid: user.id,
            createdAt: new Date(),
            status: "active",
        });

        console.log('User registered: ', user.id);
    }catch(error){
        console.error('Error registering: ', error.message); 
    }
};