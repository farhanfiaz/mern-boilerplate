import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-4">
            <div className="max-w-lg w-full text-center">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-white/20 shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="bg-red-500/20 p-5 rounded-full">
                            <AlertTriangle className="w-14 h-14 text-red-400" />
                        </div>
                    </div>

                    <h1 className="text-7xl font-extrabold text-white mb-2">404</h1>

                    <h2 className="text-2xl font-semibold text-gray-200 mb-4">
                        Page Not Found
                    </h2>

                    <p className="text-gray-400 mb-8">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>

                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:scale-105"
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>
                </div>

                <p className="text-gray-500 mt-6 text-sm">
                    SDACDN • Fast & Secure Content Delivery
                </p>
            </div>
        </div>
    );
}