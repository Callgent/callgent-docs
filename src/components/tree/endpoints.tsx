import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useState, useEffect } from 'react';

interface ModalFormProps {
    initialData?: { adaptor: string; definition: string; host: string };
    onSubmit: (data: { adaptor: string; definition: string; host: string }) => void;
    onClose: () => void;
}

const Endpoints: React.FC<ModalFormProps> = ({ initialData, onSubmit, onClose }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const [adaptor, setAdaptor] = useState(initialData?.adaptor || 'RestAPI');
    const [definition, setDefinition] = useState(initialData?.definition || '');
    const [host, setHost] = useState(initialData?.host || '');

    useEffect(() => {
        if (initialData) {
            setAdaptor(initialData.adaptor);
            setDefinition(initialData.definition);
            setHost(initialData.host);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ adaptor, definition, host });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="adaptor">Server Endpoint adaptor</label>
                <select
                    id="adaptor"
                    value={adaptor}
                    onChange={(e) => setAdaptor(e.target.value)}
                >
                    <option value="Email">Email</option>
                    <option value="RestAPI">RestAPI</option>
                    <option value="WebhooK">WebhooK</option>
                    <option value="glue-code">Glue Code</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="definition">OpenAPI Definition</label>
                <textarea
                    id="definition"
                    className="form-textarea"
                    value={definition}
                    onChange={(e) => setDefinition(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="host">API Server host</label>
                <input
                    type="text"
                    id="host"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                />
            </div>
            <div className="modal-footer">
                <button type="button" className="cancel-button" onClick={onClose}>
                    Cancel
                </button>
                <button type="submit" className="create-button">
                    {initialData ? 'Save' : 'Create'}
                </button>
            </div>
        </form>
    );
};

export default Endpoints;
