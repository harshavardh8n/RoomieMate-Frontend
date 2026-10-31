import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { userState } from '../state/atoms/userAtom';
import { useRecoilState } from 'recoil';
import { roomIdAtom } from '../state/atoms/roomIdAtom';
import { backendPath } from '../config';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useRecoilState(userState); // Recoil state
  const [roomId, setRoomId] = useRecoilState(roomIdAtom);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${backendPath}user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);

        // Set user state only if user data is available
        if (data.user) {
          setUser(data.user);  // Set the user state properly

          const newToken = `Bearer ${data.token}`;
          localStorage.setItem('token', newToken);

          alert('Login successful!');

          // Now that the user state is set, proceed to the next page
          if (data.roomId) {
            // alert(data.roomId)
           setRoomId(data.roomId)
           localStorage.setItem('roomId', data.roomId);
            navigate('/home');
          } else {
            navigate('/createroom');
          }
        } else {
          setError('User data is not available.');
        }
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#EFF3EA] dark:bg-gray-900 h-screen">
      <div className="flex flex-col justify-center items-center h-full px-6 py-8 mx-auto">
        <a href="#" className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">
          RoomieMate
        </a>
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4 md:space-y-6 dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
            Sign in to your account
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-sm text-red-500">
                <p>{error}</p>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {loading ? 'Loading...' : 'Sign in'}
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account yet?{' '}
              <NavLink to={"/signup"}>
              <a
                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                Sign up
              </a>
                </NavLink>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
