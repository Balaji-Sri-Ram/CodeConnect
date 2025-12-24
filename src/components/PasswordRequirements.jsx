
import { Check } from "lucide-react";
import { validatePassword } from "@/utils/passwordValidation";

export const PasswordRequirements = ({ password, visible }) => {
    if (!visible) return null;

    return (
        <div className="absolute top-full left-0 mt-2 md:mt-0 md:left-full md:top-0 md:ml-4 w-full md:w-64 p-4 bg-popover text-popover-foreground rounded-lg shadow-lg border z-50 animate-in fade-in zoom-in-95 md:slide-in-from-left-2">
            <h4 className="font-semibold mb-2 text-sm">Password requirements</h4>
            <ul className="space-y-1 text-xs">
                {Object.entries(validatePassword(password)).map(([key, isValid]) => (
                    <li key={key} className={`flex items-center gap-2 ${isValid ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {isValid ? <Check className="h-3 w-3" /> : <div className="h-1.5 w-1.5 rounded-full bg-current" />}
                        <span>
                            {key === 'length' && 'Minimum 6 characters'}
                            {key === 'uppercase' && 'An alphabet capital letter'}
                            {key === 'lowercase' && 'An alphabet small letter'}
                            {key === 'number' && 'A numeric number'}
                            {key === 'special' && 'A special character'}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
