import {doc, updateDoc} from 'firebase/firestore';
import {db} from './firebase'; 

const updateUserRole = async (userId, newRole) =>{
    try{
        await updateDoc(doc(db, 'users', userId), {
            role:newRole,
        });

    }catch(error){
        console.error("Error loggin in user", error.message);
    }
};