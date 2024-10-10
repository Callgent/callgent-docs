import { PopconfirmProps, TreeNodeType } from '@site/src/types/components';
import React, { useState, useRef, useEffect } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import useSubmit from '@site/src/hooks/button';
import axios from 'axios';
import './index.scss';

const Popconfirm: React.FC<PopconfirmProps> = ({ title, description, initialData, treeData, setTreeData, onCancel, okText = 'Yes', cancelText = 'No', children }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const [visible, setVisible] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const popconfirmRef = useRef<HTMLDivElement>(null);
    const [isSubmitting, handleSubmit, message] = useSubmit();
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
        setVisible(true);
    };

    const handleConfirm = async () => {
        const { level, id } = initialData;
        if (level === 1) {
            await axios.delete('/api/callgents/' + id).then((req) => {
                setFadeOut(true);
                setTimeout(() => {
                    setVisible(false);
                    setTreeData([]);
                }, 500);
            }).catch((error) => {
                const { data } = error.response;
                throw new Error(JSON.stringify(data.message));
            })
            return null;
        } else if (level === 3) {
            await axios.delete('/api/entries/' + id).then((req) => {
                setFadeOut(true);
                setTimeout(() => {
                    setVisible(false);
                    const newTreeData = [treeData];
                    const deleteNode = (nodes: TreeNodeType[], parent: TreeNodeType[]) => {
                        nodes.forEach((node, index) => {
                            if (node.id === id) {
                                parent.splice(index, 1);
                            } else if (node.children) {
                                deleteNode(node.children, node.children);
                            }
                        });
                    };
                    deleteNode(newTreeData, newTreeData);
                    setTreeData(newTreeData);
                }, 500);
            }).catch((error) => {
                const { data } = error.response;
                throw new Error(JSON.stringify(data.message));
            })
        }
    };

    const handleCancel = () => {
        onCancel();
        setVisible(false);
    };

    return (
        <div className="popconfirm-container">
            <span ref={triggerRef} onClick={handleTriggerClick}>
                {children}
            </span>
            {visible && <div ref={popconfirmRef} className={`popconfirm ${fadeOut ? 'fade-out' : ''}`}>
                <div className="popconfirm-title">{title}</div>
                <div className="popconfirm-description">{description}</div>
                <div>
                    {message === true && <span className="margin--md text--success">Successfully!</span>}
                    {message !== true && message !== null && <span className="margin--md text--danger">{message}</span>}
                </div>
                <div className="popconfirm-buttons">
                    <button onClick={handleCancel}>{cancelText}</button>
                    <button disabled={isSubmitting} onClick={() => handleSubmit(handleConfirm)}
                        className="button button--info button--secondary create-button">{okText}</button>
                </div>
            </div>}
        </div>
    );
};

export default Popconfirm;