import 'aos/dist/aos.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function IndexLayout({ children }) {
    return (
        <main className="main">
            {children}
        </main>
    );
}
