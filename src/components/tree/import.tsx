import { ModalFormProps, TreeNodeType } from '@site/src/types/components';
import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useState, useRef } from 'react';
import useSubmit from '@site/src/hooks/button';
import axios from 'axios';

const Import: React.FC<ModalFormProps> = ({ initialData, type, adaptorKey, treeData, onSubmit, onClose }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, handleSubmit, message] = useSubmit();
    const submitFunction = async () => {
        const formData = new FormData(formRef.current);
        const formValues = Object.fromEntries(formData.entries()) as { endpointId: string, text: any, format: string };
        formValues.endpointId = initialData.id;
        // formValues.format = "json";
        type === 'Edit' ?
            // await axios.post('/api/endpoints/' + adaptorKey + '/create', formValues).then(req => {
            //     setImportState(true);
            //     setTimeout(() => { onClose(); }, 350);
            //     let { data } = req.data;
            //     data.id = data.id;
            //     data.edit = true;
            //     data.delete = true;
            //     data.import = formValues?.type === 'SERVER' ? true : false;
            //     onSubmit(data)
            // }).catch(error => {
            //     const { data } = error.response;
            //     throw new Error(JSON.stringify(data.message));
            // });
            null
            :
            await axios.post('/api/bff/callgent-functions/import', formValues).then((req) => {
                const { data } = req.data;
                setTimeout(onClose, 350);
                data
                    .filter((item: TreeNodeType) =>
                        !initialData.children.some((oldItem: TreeNodeType) => oldItem.name === item.name)
                    )
                    .forEach((item: TreeNodeType) => {
                        item.type = "Import";
                        onSubmit(item);
                    });
            }).catch(error => {
                const { data } = error.response;
                throw new Error(JSON.stringify(data.message));
            });
    };
    return (
        <form ref={formRef}>
            <div className="form-group">
                <label htmlFor="text">Import SEP Functions</label>
                <textarea className="customTextarea" name='text' id='text' style={{ maxHeight: '180px', }}></textarea>
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

export default Import;
