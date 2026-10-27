import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
    const location = useLocation();

    const isGalleryPage = location.pathname === "/gallery";

    return (
        <nav className="flex items-center justify-between gap-5 border-b border-gray-200 bg-white px-30 py-6 dark:border-gray-800 dark:bg-gray-950">
            <Link
                to="/"
                className="flex items-center-safe text-xl font-bold text-gray-900 dark:text-white"
            >
                <img
                    src="/icon.png"
                    alt="C"
                    className="-ml-1.5 -mr-2 h-11 w-11 dark:hidden"
                />
                <img
                    src="/icon-dark.png"
                    alt="C"
                    className="-ml-1.5 -mr-2 hidden h-11 w-11 dark:block"
                />
                haraforgeAI
            </Link>

            <div className="flex items-center gap-4">
                {isGalleryPage ? (
                    <Link
                        to="/"
                        className="rounded-lg bg-blue-950 px-4 py-2 font-medium text-white transition-colors hover:bg-cyan-800"
                    >
                        Generator
                    </Link>
                ) : (
                    <Link
                        to="/gallery"
                        className="rounded-lg bg-blue-950 px-4 py-2 font-medium text-white transition-colors hover:bg-cyan-800"
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
