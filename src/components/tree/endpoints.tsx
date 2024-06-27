import { ModalFormProps } from '@site/src/types/components';
import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useState, useRef } from 'react';
import useSubmit from '@site/src/hooks/button';
import axios from 'axios';

const Endpoints: React.FC<ModalFormProps> = ({ initialData, type, adaptorKey, treeData, onSubmit, onClose }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, handleSubmit] = useSubmit();
    const [importState, setImportState] = useState<boolean | string | null>(null);
    const submitFunction = async () => {
        const formData = new FormData(formRef.current);
        const formValues = Object.fromEntries(formData.entries()) as { type: string, host: any, callgentUuid: string };
        formValues.callgentUuid = treeData.id;
        formValues.type = initialData.id;
        formValues.type = 'CLIENT';
        type === 'Edit' ?
            await axios.put('/api/endpoints/' + initialData.id, { host: formValues.host }).then(req => {
                setImportState(true);
                setTimeout(() => { onClose(); }, 350);
                let { data } = req.data;
                data.id = data.uuid;
                data.edit = true;
                data.delete = true;
                onSubmit(data)
            }).catch(error => {
                const { data } = error.response;
                setImportState(data.message);
            })
            :
            await axios.post('/api/endpoints/' + adaptorKey + '/create', formValues).then(req => {
                setImportState(true);
                setTimeout(() => { onClose(); }, 350);
                let { data } = req.data;
                data.id = data.uuid;
                data.edit = true;
                data.delete = true;
                onSubmit(data)
            }).catch(error => {
                const { data } = error.response;
                setImportState(data.message);
            });
    };

    return (
        <form ref={formRef}>
            {!adaptorKey && (
                <div className="form-group">
                    <label htmlFor="adaptor">Server Endpoint adaptor</label>
                    <select id="adaptor" name='adaptor' >
                        <option value="email">Email</option>
                        <option value="restapi">RestAPI</option>
                    </select>
                </div>
            )}
            <div className="form-group">
                <label htmlFor="host">{initialData.adaptorKey ? `${initialData.adaptorKey} Host Address` : 'Server Address'}</label>
                <input
                    type="text"
                    name='host'
                    id="host"
                    defaultValue={typeof initialData?.host === 'string' ? initialData?.host : JSON.stringify(initialData?.host)}
                />
            </div>
            <div>
                {importState === true && <span className="margin--md text--success">Successfully {type}!</span>}
                {importState !== true && importState !== null && <span className="margin--md text--danger">{importState}</span>}
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

export default Endpoints;
