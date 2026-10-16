import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
    const location = useLocation();

    const isGalleryPage = location.pathname === "/gallery";

    return (
        <nav className="flex items-center justify-between gap-5 border-b border-gray-200 bg-white px-30 py-6 dark:border-gray-800 dark:bg-gray-950">
            <Link
                to="/"
                className="text-xl font-bold text-gray-900 dark:text-white"
            >
                CharaforgeAI
            </Link>

            <div className="flex items-center gap-4">
                {isGalleryPage ? (
                    <Link
                        to="/"
                        className="rounded-lg bg-pink-500 px-4 py-2 font-medium text-white transition-colors hover:bg-pink-600"
                    >
                        Generator
                    </Link>
                ) : (
                    <Link
                        to="/gallery"
                        className="rounded-lg bg-pink-500 px-4 py-2 font-medium text-white transition-colors hover:bg-pink-600"
                    >
                        Gallery
                    </Link>
                )}

                <ThemeToggle />
            </div>
        </nav>
    );
}

export default Navbar;