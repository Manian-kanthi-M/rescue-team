import React, { useState, useCallback } from 'react';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';

// Main App component containing the complete UI and logic
const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // --- Utility Components ---

  const InputField = ({ id, label, type = 'text', icon: Icon, value, onChange }) => (
    <div className="relative mb-6">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 sr-only">
        {label}
      </label>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="w-5 h-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        id={id}
        name={id}
        type={type}
        required
        value={value}
        onChange={onChange}
        className="block w-full py-3 pl-10 pr-4 text-gray-900 border border-gray-300 rounded-lg shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
        placeholder={label}
        autoComplete={type === 'password' ? 'current-password' : 'username'}
      />
    </div>
  );

  const PrimaryButton = ({ children, onClick, disabled, icon: Icon }) => (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center w-full px-4 py-3 text-base font-semibold text-white transition duration-200 ease-in-out bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 disabled:bg-indigo-400 disabled:cursor-not-allowed"
    >
      {disabled ? (
        <>
          <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          <Icon className="w-5 h-5 mr-2" />
          {children}
        </>
      )}
    </button>
  );

  // --- Placeholder Logic ---

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Placeholder validation/success logic
    if (email.length < 5 || password.length < 5) {
      setMessage('Please enter valid credentials (min 5 chars).');
    } else {
      const action = isLogin ? 'Login' : 'Registration';
      setMessage(`${action} successful! Welcome, ${email}. (This is a style demo only)`);
      // In a real app, you would handle Firebase auth here.
    }

    setIsLoading(false);
  }, [email, password, isLogin]);

  // --- Main Render ---

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 font-sans antialiased">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="p-3 mb-4 text-white bg-indigo-600 rounded-full shadow-lg">
            {isLogin ? <LogIn className="w-8 h-8" /> : <UserPlus className="w-8 h-8" />}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {isLogin ? 'Sign in to access your dashboard' : 'Join us to get started'}
          </p>
        </div>

        {/* The professional-looking card */}
        <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-2xl transition duration-500 hover:shadow-3xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              id="email"
              label="Email address"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              id="password"
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <PrimaryButton
              disabled={isLoading}
              icon={isLogin ? LogIn : UserPlus}
            >
              {isLogin ? 'Sign In Securely' : 'Sign Up'}
            </PrimaryButton>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-lg text-sm font-medium ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
