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
      isActive: true, // Needed for matching algorithm
      createdAt: new Date(),
      rating: 5.0, // Initial rating
      skills: [],
      location: null, // To be set by user later
    });

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}
