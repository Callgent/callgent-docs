import useIsBrowser from '@docusaurus/useIsBrowser';
import useSubmit from '@site/src/hooks/button';
import { TreeNodeType } from '@site/src/types/components';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';

interface ModalFormProps {
    initialData?: TreeNodeType;
    treeData?: TreeNodeType;
    setTreeData: (data: TreeNodeType[]) => void;
    onClose: () => void;
}

const Callgent: React.FC<ModalFormProps> = ({ initialData, treeData, setTreeData, onClose }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const formRef = useRef<HTMLFormElement>(null);
    const [importState, setImportState] = useState<boolean | string | null>(null);
    const [isSubmitting, handleSubmit] = useSubmit();
    const submitFunction = async () => {
        const formData = new FormData(formRef.current);
        const formValues = Object.fromEntries(formData.entries()) as { name: string };
        try {
            const req = initialData ?
                await axios.put('/api/callgents/' + initialData.id, formValues)
                :
                await axios.post('/api/bff/callgent-endpoints', formValues);
            setImportState(true);
            setTimeout(() => {
                onClose();
            }, 350);
            let { data } = req.data;
            console.log(treeData);
            
            initialData && setTreeData([{ ...treeData, name: formValues.name }])
            data = {
                ...data, edit: true, delete: true,
                children: data.children.map((item: TreeNodeType) => (
                    {
                        ...item, add: true,
                        children: item.children.map((child: TreeNodeType) => (
                            { ...child, edit: true, delete: true, }
                        ))
                    }
                ))
            }
            !initialData && setTreeData([data])
        } catch (error) {
            const { data } = error.response;
            setImportState(data.message);
        }
    };

    return (
        <form ref={formRef}>
            <div className="form-group">
                <label htmlFor="name"> name</label>
                <input type="text" id='name' name="name" defaultValue={initialData?.name} />
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
