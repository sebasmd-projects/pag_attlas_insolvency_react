'use client';

import { useRef } from 'react';

export default function Step2Informe({ data, onNext, onBack, isSubmitting }) {
    const editorRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const htmlContent = editorRef.current.innerHTML;

        if (!htmlContent || htmlContent.trim() === '') {
            alert('El informe no puede estar vacío.');
            return;
        }

        const allowedTags = ['<b>', '</b>', '<u>', '</u>'];
        const cleanHtml = htmlContent.replace(/<(?!\/?(b|u)>)[^>]+>/gi, '');

        onNext({ default_report: cleanHtml });
    };

    const format = (tag) => {
        document.execCommand(tag, false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-2">
                <label className="form-label mx-3">Informe de cesación de pagos </label>
                <div className="btn-group mb-2">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => format('bold')}>
                        <b>B</b>
                    </button>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => format('underline')}>
                        <u>U</u>
                    </button>
                </div>
                <div
                    ref={editorRef}
                    contentEditable
                    className="form-control"
                    style={{ minHeight: '250px' }}
                    dangerouslySetInnerHTML={{ __html: data.default_report || '' }}
                />
            </div>

            <div className="d-flex justify-content-between mt-3">
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                    Atrás
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    Siguiente
                </button>
            </div>
        </form>
    );
}
