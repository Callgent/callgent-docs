import useIsBrowser from '@docusaurus/useIsBrowser';
import useSubmit from '@site/src/hooks/button';
import { TreeNodeType } from '@site/src/types/components';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';

interface ModalFormProps {
    initialData?: { adaptor: string; definition: string; host: string };
    setTreeData: (data: TreeNodeType[]) => void;
    onClose: () => void;
    treeData: TreeNodeType[];
}

const Callgent: React.FC<ModalFormProps> = ({ initialData, setTreeData, treeData, onClose }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const formRef = useRef<HTMLFormElement>(null);
    const [importState, setImportState] = useState<boolean | string | null>(null);
    const [isSubmitting, handleSubmit] = useSubmit();
    // useEffect(() => {

    // }, [initialData]);

    const submitFunction = async () => {
        const formData = new FormData(formRef.current);
        const formValues = Object.fromEntries(formData.entries());
        try {
            const req = await axios.post('/api/bff/callgent-endpoints', formValues);
            let { data } = req.data;
            data = {
                ...data, edit: true, delete: true,
                children: data.children.map((item: TreeNodeType) => (
                    { ...item, add: true }
                ))
            }
            setTreeData([data])
            setImportState(true);
        } catch (error) {
            const { data } = error.response;
            setImportState(data.message);
        }
        setTimeout(() => {
            onClose();
        }, 350);
    };

    return (
        <form ref={formRef}>
            <div className="form-group">
                <label htmlFor="name"> name</label>
                <input type="text" id='name' name="name" defaultValue="" />
            </div>
            <div>
                {importState === true && <span className="margin--md text--success">Successfully created!</span>}
                {importState !== true && importState !== null && <span className="margin--md text--danger">{importState}</span>}
            </div>
            <div className="modal-footer">
                <button type="button" className="cancel-button" onClick={onClose}>
                    Cancel
                </button>
                <button type="button" onClick={() => handleSubmit(submitFunction)} disabled={isSubmitting} className="button button--info button--secondary create-button">
                    {initialData ? 'Save' : 'Create'}
                </button>
            </div>
        </form>
    );
};

export default Callgent;
