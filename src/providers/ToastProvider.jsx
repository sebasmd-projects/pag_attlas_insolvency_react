// providers/ToastProvider.jsx
'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ToastProvider({ children }) {
    return (
        <>
            {children}
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
}
