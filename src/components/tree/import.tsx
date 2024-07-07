import { ModalFormProps } from '@site/src/types/components';
import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useState, useRef } from 'react';
import useSubmit from '@site/src/hooks/button';
import axios from 'axios';

const Import: React.FC<ModalFormProps> = ({ initialData, type, adaptorKey, treeData, onSubmit, onClose }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, handleSubmit] = useSubmit();
    const [importState, setImportState] = useState<boolean | string | null>(null);
    const submitFunction = async () => {
        const formData = new FormData(formRef.current);
        const formValues = Object.fromEntries(formData.entries()) as { endpoint: string, text: any, format: string };
        formValues.endpoint = initialData.id;
        formValues.format = "openAPI";
        type === 'Edit' ?
            // await axios.post('/api/endpoints/' + adaptorKey + '/create', formValues).then(req => {
            //     setImportState(true);
            //     setTimeout(() => { onClose(); }, 350);
            //     let { data } = req.data;
            //     data.id = data.uuid;
            //     data.edit = true;
            //     data.delete = true;
            //     data.import = formValues?.type === 'SERVER' ? true : false;
            //     onSubmit(data)
            // }).catch(error => {
            //     const { data } = error.response;
            //     setImportState(data.message);
            // });
            null
            :
            await axios.post('/api/bff/callgent-functions/import', formValues).then(req => {
                setImportState(true);
                setTimeout(() => { onClose(); }, 350);
                let { data } = req.data;
                data.id = data.uuid;
                data.type = "Import";
                data.name = formValues?.text
                onSubmit(data);
            }).catch(error => {
                const { data } = error.response;
                setImportState(data.message);
            });
    };

    return (
        <form ref={formRef}>
            <div className="form-group">
                <label htmlFor="text">Import SEP Functions</label>
                <textarea className="customTextarea" name='text' id='text' style={{ maxHeight: '180px', }}></textarea>
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

export default Import;
