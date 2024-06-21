import React, { useState } from 'react';
import './index.scss';
import useIsBrowser from '@docusaurus/useIsBrowser';

interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300); // Duration of the closing animation
    };

    if (!isOpen && !isClosing) return null;

    return (
        <div className={`modal-overlay ${isClosing ? 'fade-out' : ''}`}>
            <div className={`modal ${isClosing ? 'fade-out' : ''}`}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="close-button" onClick={handleClose}>×</button>
                </div>
                <div className="modal-body">
                    {React.cloneElement(children as React.ReactElement, { onClose: handleClose })}
                </div>
            </div>
        </div>
    );
};

export default Modal;
