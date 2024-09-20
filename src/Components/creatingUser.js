import { doc, setDoc} from 'firebase/firestore'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {db, auth} from './firebase';

const creatNewUser = async (email,password,role) => {

try{

    const userCred = await createUserWithEmailAndPassword(auth,email,password);
    const user = userCred.user;

    await setDoc(doc(db,'users',user.uid), {
        email: newUser.email,
        role: role,
        uid: newUser.uid,
        createdAt: new Date(),
        status: 'active', 
    });

console.log('user ${newUser.email} created with role: ${role}');

}
catch (error)
{
    console.error('Error creating user: ', error.message);
}

};
