import React, { useContext, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { GlobalContext } from '@site/src/context/GlobalContext';
import { getCookie } from '@site/src/util/cookie';
import { ModalProps } from '@site/src/types/components';
import './index.scss';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const [isClosing, setIsClosing] = useState(false);
    const { setShowLogin } = useContext(GlobalContext);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    if (!isOpen && !isClosing) return null;
    if (!getCookie('x-callgent-jwt')) {
        setShowLogin(true);
        onClose();
        return null;
    }

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
