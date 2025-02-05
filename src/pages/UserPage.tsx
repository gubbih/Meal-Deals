import React, { useState } from 'react';
import { signIn, signOut, useAuth } from '../services/firebase';
import { User } from "../models/User";

function UserPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user: User | null = useAuth();

interface SignInEvent extends React.FormEvent<HTMLFormElement> {}

const handleSignIn = (e: SignInEvent): void => {
    e.preventDefault();
    signIn(email, password);
};

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">User Page</h1>
      {user ? (
        <div>
          <p>Welcome, {(user as User).firstName} {(user as User).lastName}</p>
          <button onClick={handleSignOut} className="bg-red-500 text-white p-2 rounded">Sign Out</button>
        </div>
      ) : (
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button type="submit" className="bg-green-500 text-white p-2 rounded">Sign In</button>
        </form>
      )}
    </div>
  );
}

export default UserPage;
