import Sidebar from "@/components/shared/dashboardLayout/sidebar";
import TopNav from "@/components/shared/dashboardLayout/top-nav";
import UserPrivateRoute from "@/lib/PrivateRoute/UserPrivateRoute";


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserPrivateRoute>
            <div className={`flex h-screen `}>
                <Sidebar role="admin" />
                <div className="w-full flex flex-1 flex-col">
                    <header className="h-16 border-b border-gray-200">
                        <TopNav />
                    </header>
                    <main className="flex-1 overflow-auto p-4 xl:p-6 bg-gray-50">
                        {children}
                    </main>
                </div>
            </div>
        </UserPrivateRoute>
    );
}
