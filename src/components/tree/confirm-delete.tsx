import React, { useState, useRef, useEffect } from 'react';
import './index.scss';
import useIsBrowser from '@docusaurus/useIsBrowser';

interface PopconfirmProps {
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    okText?: string;
    cancelText?: string;
    children: React.ReactNode;
}

const Popconfirm: React.FC<PopconfirmProps> = ({ title, description, onConfirm, onCancel, okText = 'Yes', cancelText = 'No', children }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const [visible, setVisible] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const popconfirmRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (popconfirmRef.current && !popconfirmRef.current.contains(event.target as Node) &&
            triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
            setVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleTriggerClick = () => {
        setVisible(!visible);
    };

    const handleConfirm = () => {
        onConfirm();
        setVisible(false);
    };

    const handleCancel = () => {
        onCancel();
        setVisible(false);
    };

    return (
        <div className="popconfirm-container">
            <div ref={triggerRef} onClick={handleTriggerClick}>
                {children}
            </div>
            {visible && (
                <div ref={popconfirmRef} className="popconfirm">
                    <div className="popconfirm-title">{title}</div>
                    <div className="popconfirm-description">{description}</div>
                    <div className="popconfirm-buttons">
                        <button onClick={handleCancel}>{cancelText}</button>
                        <button onClick={handleConfirm}>{okText}</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Popconfirm;