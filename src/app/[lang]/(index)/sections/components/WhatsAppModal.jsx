'use client';
import { useState } from 'react';
import styles from '../../css/modal.module.css';

export default function WhatsAppModal({ isOpen, hero_data, setIsOpen }) {

    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-backdrop fade show" onClick={() => setIsOpen(false)}></div>

            <div
                className={`${styles.modalWhatsapp} modal fade show`}
                style={{ display: 'block' }}
                tabIndex="-1"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className={`${styles.chatHeader}`}>
                            <span>WhatsApp</span>
                            <button
                                type="button"
                                className="btn-close btn-close-black"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close"
                            ></button>
                        </div>

                        <div className={`${styles.chatBody}`}>
                            <h5>⚖️{hero_data.askConcerns}🤝</h5>
                            <h6>
                                <i className="bi bi-chat-left-text-fill me-2"></i>
                                {hero_data.talkToLawyer}
                            </h6>
                        </div>

                        <div className={`${styles.chatFooter}`}>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={hero_data.messagePlaceholder}
                                className="form-control"
                            />
                            <button
                                id="sendMessage"
                                onClick={() => {
                                    window.open(`https://wa.me/573183280176?text=${encodeURIComponent(message)}`)
                                }}
                            >
                                <i className="bi bi-send"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}