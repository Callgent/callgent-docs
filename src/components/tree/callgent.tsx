import { ModalFormProps } from '@site/src/types/components';
import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useState, useRef } from 'react';
import useSubmit from '@site/src/hooks/button';
import axios from 'axios';

const Callgent: React.FC<ModalFormProps> = ({ initialData, treeData, setTreeData, onClose }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, handleSubmit, message] = useSubmit();
    const submitFunction = async () => {
        const formData = new FormData(formRef.current);
        const formValues = Object.fromEntries(formData.entries()) as { name: string };
        try {
            await axios.put('/api/callgents/' + initialData.id, formValues)
            setTimeout(() => { onClose(); }, 350);
            setTreeData([{ ...treeData, name: formValues.name }])
        } catch (error) {
            const { data } = error.response;
            throw new Error(JSON.stringify(data.message));
        }
    };

    return (
        <form ref={formRef}>
            <div className="form-group">
                <label htmlFor="name"> name</label>
                <input type="text" id='name' name="name" defaultValue={initialData?.name} />
            </div>
            <div>
                {message === true && <span className="margin--md text--success">Successfully {initialData ? 'Edit' : 'Create'}!</span>}
                {message !== true && message !== null && <span className="margin--md text--danger">{message}</span>}
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
