import { Form } from "react-bootstrap";

export default function InputSearchComponent({ t, searchTerm, setSearchTerm }) {
    return (
        <>
            <Form.Control
                type="text"
                placeholder={t('heroSection.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
            />
        </>
    );
}