import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export async function signUpUser(email, password, name, role = 'volunteer') {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore with role
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      role, // 'ngo', 'volunteer', or 'admin'
      createdAt: new Date(),
    });

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}
