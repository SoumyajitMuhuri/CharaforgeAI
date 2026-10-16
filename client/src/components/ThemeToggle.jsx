import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(
        document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode((previous) => !previous)}
            aria-label="Toggle theme"
            className="relative flex h-9 w-16 items-center rounded-full border border-gray-300 bg-gray-200 p-1 transition-colors dark:border-gray-700 dark:bg-gray-800"
        >
            <span
                className={`flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 dark:bg-gray-950 ${
                    darkMode ? "translate-x-7" : "translate-x-0"
                }`}
            >
                {darkMode ? (
                    <Moon size={16} color="gray" />
                ) : (
                    <Sun size={16} />
                )}
            </span>
        </button>
    );
}

export default ThemeToggle;