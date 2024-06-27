import { ModalFormProps } from '@site/src/types/components';
import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useState, useRef } from 'react';
import useSubmit from '@site/src/hooks/button';
import axios from 'axios';

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
            await axios.put('/api/callgents/' + initialData.id, formValues)
            setImportState(true);
            setTimeout(() => { onClose(); }, 350);
            setTreeData([{ ...treeData, name: formValues.name }])
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
                {importState === true && <span className="margin--md text--success">Successfully {initialData ? 'Edit' : 'Create'}!</span>}
                {importState !== true && importState !== null && <span className="margin--md text--danger">{importState}</span>}
            </div>
            <div className="modal-footer">
                <button type="button" className="cancel-button" onClick={onClose}>
                    Cancel
                </button>
                <button type="submit" onClick={() => handleSubmit(submitFunction)} disabled={isSubmitting} className="button button--info button--secondary create-button">
                    {initialData ? 'Save' : 'Create'}
                </button>
            </div>
        </form>
    );
};

export default Callgent;
