import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#141414] border-b border-white/5 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#e50914] to-[#b20710] rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            Oral<span className="text-[#e50914]">Scan</span> AI
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-8">
                        <Link
                            to="/"
                            className={`text-sm font-medium transition-colors duration-200 ${location.pathname === '/'
                                ? 'text-white'
                                : 'text-[#b3b3b3] hover:text-white'
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/analysis"
                            className={`text-sm font-medium transition-colors duration-200 ${location.pathname === '/analysis'
                                ? 'text-white'
                                : 'text-[#b3b3b3] hover:text-white'
                                }`}
                        >
                            Analysis
                        </Link>
                        <Link
                            to="/validation"
                            className={`text-sm font-medium transition-colors duration-200 ${location.pathname === '/validation'
                                ? 'text-white'
                                : 'text-[#b3b3b3] hover:text-white'
                                }`}
                        >
                            Validation
                        </Link>
                        <Link
                            to="/about"
                            className={`text-sm font-medium transition-colors duration-200 ${location.pathname === '/about'
                                ? 'text-white'
                                : 'text-[#b3b3b3] hover:text-white'
                                }`}
                        >
                            About
                        </Link>
                    </div>

                    {/* CTA Button */}
                    <Link
                        to="/analysis"
                        className="btn-primary text-sm px-6 py-2.5"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        Start Scan
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
