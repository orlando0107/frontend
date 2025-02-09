import PublicHeader from "./PublicHEader";
import Footer from '@/components/layout/Foother';


export default function LayoutPrivate({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <PublicHeader />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
