import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void; // Callback for successful login (or simulation)
  onGoBack: () => void; // Callback to go back to the main app
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGoBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Simulating login with:', { email, password });
    // In a real app, you would send these to a backend for authentication
    // For now, we just simulate success and go back to the main app
    alert('Simulated Login Successful!');
    onLogin(); // Go back to the main app
  };

  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-[#F8F5F1] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-xl border border-gray-200">
        <div>
          <h2 className="mt-6 text-center text-4xl font-bold text-[#1A202C]">
            Login to Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to access the app.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#6B46C1] focus:border-[#6B46C1] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#6B46C1] focus:border-[#6B46C1] focus:z-10 sm:text-sm mt-px"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#6B46C1] focus:ring-[#6B46C1] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-[#6B46C1] hover:text-[#553C9A]">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#6B46C1] hover:bg-[#553C9A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B46C1]"
            >
              Sign in
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={onGoBack}
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
            >
              Go Back
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};