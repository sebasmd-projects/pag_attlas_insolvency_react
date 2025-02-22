import DOMPurify from 'dompurify';

const sanitizeHTML = (dirtyHTML) => ({
    __html: DOMPurify.sanitize(dirtyHTML)
});