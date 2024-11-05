import { ModalFormProps } from '@site/src/types/components';
import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useState, useRef } from 'react';
import useSubmit from '@site/src/hooks/button';
import axios from 'axios';

const Entries: React.FC<ModalFormProps> = ({ initialData, type, adaptorKey, treeData, onSubmit, onClose }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, handleSubmit, message] = useSubmit();
    const submitFunction = async () => {
        const formData = new FormData(formRef.current);
        const formValues = Object.fromEntries(formData.entries()) as { type: string, host: any, callgentId: string };
        formValues.callgentId = treeData.id;
        formValues.type = initialData.id;
        type === 'Edit' ?
            await axios.put('/api/entries/' + initialData.id, { host: formValues.host }).then(req => {
                setTimeout(() => { onClose(); }, 350);
                let { data } = req.data;
                data.id = data.id;
                data.edit = true;
                data.delete = true;
                data.lock = true;
                data.import = formValues?.type === 'SERVER' ? true : false;
                onSubmit(data)
            }).catch(error => {
                const { data } = error.response;
                throw new Error(JSON.stringify(data.message));
            })
            :
            await axios.post('/api/entries/' + adaptorKey + '/create', formValues).then(req => {
                setTimeout(() => { onClose(); }, 350);
                let { data } = req.data;
                data.id = data.id;
                data.edit = true;
                data.delete = true;
                data.lock = true;
                data.children = [];
                data.import = formValues?.type === 'SERVER' ? true : false;
                onSubmit(data)
            }).catch(error => {
                const { data } = error.response;
                throw new Error(JSON.stringify(data.message));
            });
    };

    return (
        <form ref={formRef}>
            {!adaptorKey && (
                <div className="form-group">
                    <label htmlFor="adaptor">Server Entry adaptor</label>
                    <select id="adaptor" name='adaptor' >
                        <option value="email">Email</option>
                        <option value="restapi">RestAPI</option>
                    </select>
                </div>
            )}
            <div className="form-group">
                <label htmlFor="host">{initialData?.adaptorKey ? `${initialData?.adaptorKey} Host Address` : `${adaptorKey || ''} Host Address`}</label>
                <input
                    type="text"
                    name='host'
                    id="host"
                    defaultValue={typeof initialData?.host === 'string' ? initialData?.host : JSON.stringify(initialData?.host)}
                />
            </div>
            <div>
                {message === true && <span className="margin--md text--success">Successfully {type}!</span>}
                {message !== true && message !== null && <span className="margin--md text--danger">{message}</span>}
            </div>
            <div className="modal-footer">
                <button type="button" className="cancel-button" onClick={onClose}>
                    Cancel
                </button>
                <button type="submit" onClick={() => handleSubmit(submitFunction)} disabled={isSubmitting} className="button button--info button--secondary create-button">
                    {type}
                </button>
            </div>
        </form>
    );
};

export default Entries;