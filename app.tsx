import { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebaseDB';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface User {
  id: string;
  name: string;
  age: number;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const usersCollectionRef = collection(db, "info");
  const [age, setAge] = useState<number | string>(0); // Allow both number and string to handle empty value
  const [name, setName] = useState<string>("");

  // Fetch users from Firestore
  const getUsers = async () => {
    try {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User)));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Create a new user in Firestore
  const createUser = async () => {
    try {
      await addDoc(usersCollectionRef, { name: name, age: Number(age) });
      await getUsers(); // Refresh data
      setName(""); // Clear the name input field
      setAge(""); // Clear the age input field
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Update user's age in Firestore
  const updateUser = async (id: string, age: number) => {
    try {
      const userDoc = doc(db, "info", id);
      const newFields = { age: age + 1 };
      await updateDoc(userDoc, newFields);
      await getUsers(); // Refresh data
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Delete user from Firestore
  const deleteUser = async (id: string) => {
    try {
      const userDoc = doc(db, "info", id);
      await deleteDoc(userDoc);
      await getUsers(); // Refresh data
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Initial fetch of users when component mounts
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="app">
      <input
        type="text"
        placeholder="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <input
        type="number"
        placeholder="age"
        value={age}
        onChange={(event) => setAge(event.target.value)}
      />
      <button onClick={createUser}>Enter Data</button>
      {users.map((user) => (
        <div key={user.id}>
          <h1>Name: {user.name}</h1>
          <h1>Age: {user.age}</h1>
          <button onClick={() => updateUser(user.id, user.age)}>Update</button>
          <button onClick={() => deleteUser(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
