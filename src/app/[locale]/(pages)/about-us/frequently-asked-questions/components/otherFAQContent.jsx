import DOMPurify from 'dompurify';
import { ListGroup } from "react-bootstrap";
import styles from '../FAQPage.module.css';

export default function OtherFAQComponent({ t, filteredOtherFAQs, openItems, toggleItem }) {
    return (
        <>
            <ListGroup className="w-100">
                {filteredOtherFAQs.length === 0 ? (
                    <ListGroup.Item className="text-center">{t('no_search_avaible')}</ListGroup.Item>
                ) : (
                    filteredOtherFAQs.map((faq) => (
                        <ListGroup.Item
                            key={faq.id}
                            action
                            className="list-group-item-action"
                            onClick={() => toggleItem(faq.id)}
                        >
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">{faq.question}</h5>
                            </div>
                            <p className="mb-1">{faq.short_answer}</p>
                            <small className="text-muted">
                                <u>{openItems.includes(faq.id) ? t('show_less') : t('show_more')}</u>
                            </small>
                            <div
                                className={`${styles.collapseContent} ${openItems.includes(faq.id) ? styles.open : ""}`}
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(faq.answer) }}
                            />
                        </ListGroup.Item>
                    ))
                )}
            </ListGroup>
        </>
    );
}