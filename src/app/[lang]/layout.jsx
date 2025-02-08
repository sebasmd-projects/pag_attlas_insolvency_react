import 'aos/dist/aos.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function GlobalLayout({ children }) {
    return (
        <main className="main">
            {children}
        </main>
    );
}
