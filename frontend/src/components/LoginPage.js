export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="bg-white/30 backdrop-blur-xl shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 drop-shadow-2xl">Login</h2>

        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-xl bg-white/60 backdrop-blur-md border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-xl bg-white/60 backdrop-blur-md border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all drop-shadow-2xl"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-700">
          Don't have an account? <span className="text-blue-800 font-semibold cursor-pointer">Sign Up</span>
        </p>
      </div>
    </div>
  );
}
