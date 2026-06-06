import { useAuth } from "@/context/AuthContext";
import { Redirect } from "wouter";

export default function MultipleRole() {
    const { user } = useAuth();

    if (!user) return <Redirect to="/login" />;

    if (user.user.role.length <= 1) {
        const defaultRole = user.user.role.at(0)?.id;
        return <Redirect to="/dashboard" />;
    }

    return (
        <ul>
            {user.user.role.map((role) => (
                <li key={role.id} onClick={(e) => {
                    e.preventDefault();
                    const selectedRole = e.currentTarget.value;
                }}>
                    {role.name}
                </li>
            ))}
        </ul>
    );
}