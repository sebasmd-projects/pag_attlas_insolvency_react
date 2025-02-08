import 'aos/dist/aos.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function DashboardLayout({ children }) {
    return (
        <main className="main">
            {children}
        </main>
    );
}
