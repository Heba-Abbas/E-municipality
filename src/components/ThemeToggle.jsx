import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {

    const { darkMode, toggleTheme } = useTheme();

    return (

        <button
            onClick={toggleTheme}
            className="
                w-9
                h-9
                rounded-full
                flex
                items-center
                justify-center
                transition
                duration-300
                bg-slate-200
                dark:bg-slate-700
                hover:scale-110
            "
        >

            {darkMode ? (

                <Moon className="text-amber-300" size={20} />

            ) : (

                
                <Sun className="text-amber-300" size={20} />

            )}

        </button>
    );
}