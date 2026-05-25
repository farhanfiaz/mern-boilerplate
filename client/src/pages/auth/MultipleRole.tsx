import { useAuth } from "@/context/AuthContext";
import { Redirect } from "wouter";

export default function MultipleRole() {
    const { user } = useAuth();

    if (!user) return <Redirect to="/login" />;

    if (user.user.role.length <= 1) {
        return <Redirect to="/dashboard" />;
    }

    return (
        <ul>
            {user.user.role.map((role) => (
                <li key={role.Id}>
                    {role.name}
                </li>
            ))}
        </ul>
    );
}