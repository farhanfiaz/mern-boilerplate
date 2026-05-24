import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "wouter";

export function Sidebar() {
    const { user, logout } = useAuth();

    if (!user) {
        return <Redirect to="/login" />;
    }
    return (
        <>
            <div>
                {/* Navigation */}
                <nav
                    className={(
                        "py-3 flex-1 overflow-y-auto min-h-0 px-3"
                    )}
                >


                    <div className="mt-8 pt-4 border-t border-sidebar-border">
                        {(
                            <Button
                                // variant="ghost"
                                onClick={logout}
                                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                                {/* <LogOut className="mr-3 h-4 w-4" /> */}
                                Logout
                            </Button>
                        )}
                    </div>
                </nav>
            </div>
        </>
    );
}