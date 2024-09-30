import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useState, useEffect } from 'react';
import useSubmit from '@site/src/hooks/button';
import axios from 'axios';
import './index.scss';

const NewAuth = ({ callgentId, onClose, initialData = null, securities = null, updateRealms }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) return null;

    const [isEditable, setIsEditable] = useState(!initialData);
    const [formValues, setFormValues] = useState({
        callgentId: callgentId || '',
        authType: 'apiKey',
        realm: '',
        scheme: { type: 'apiKey', in: '', name: '', provider: '' },
        secret: {}
    });

    useEffect(() => {
        setIsEditable(!initialData);
        setFormValues(initialData || {
            callgentId: callgentId || '',
            authType: 'apiKey',
            realm: '',
            scheme: { type: 'apiKey', in: '', name: '', provider: '' },
            secret: {}
        });
    }, [initialData, callgentId]);

    const [isSubmitting, handleSubmit, message] = useSubmit();

    const submitFunction = async () => {
        try {
            if (initialData) {
                const { data } = await axios.put(`/api/callgent-realms/${callgentId}/${initialData?.realmKey}`, {
                    realm: formValues?.realm,
                    scheme: formValues?.scheme
                });
                updateRealms('edit', data?.data, initialData?.realmKey);
                setIsEditable(!initialData);
                onClose()
            } else {
                const { data } = await axios.post('/api/callgent-realms', formValues);
                updateRealms('add', data?.data);
                onClose()
            }
        } catch (error) {
            const { data } = error.response;
            throw new Error(JSON.stringify(data.message));
        }
    };

    const deleteFunction = async () => {
        try {
            await axios.delete(`/api/callgent-realms/${callgentId}/${initialData?.realmKey}`);
            updateRealms('delete', null, initialData?.realmKey);
            onClose();
        } catch (error) {
            const { data } = error.response;
            throw new Error(JSON.stringify(data.message));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (['type', 'in', 'name', 'provider'].includes(name)) {
            setFormValues({ ...formValues, scheme: { ...formValues.scheme, [name]: value } });
        } else {
            setFormValues({ ...formValues, [name]: value });
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSubmit(submitFunction);
    };

    const handleSelectClick = async () => {
        try {
            await axios.post(`/api/callgent-realms/securities/${securities?.type ? 'endpoint' : 'function'}/${securities?.id}`, [
                {
                    "realmKey": initialData?.realmKey
                }
            ]);
            onClose();
        } catch (error) {
            const { data } = error.response;
            throw new Error(JSON.stringify(data.message));
        }
    };

    return (
        <form className='create-auth' onSubmit={handleFormSubmit}>
            <label>
                <span>Scheme Type:</span>
                <select
                    name="type"
                    value={formValues.scheme.type}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                    required
                >
                    <option value="apiKey">apiKey</option>
                </select>
            </label>

            <label>
                <span>Scheme In:</span>
                <input
                    type="text"
                    name="in"
                    placeholder="Enter 'header', 'query', etc."
                    value={formValues.scheme.in}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                    required
                />
            </label>

            <label>
                <span>Scheme Name:</span>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter scheme name, e.g. 'x-callgent'"
                    value={formValues.scheme.name}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                    required
                />
            </label>

            <label>
                <span>Provider:</span>
                <input
                    type="text"
                    name="provider"
                    placeholder="Enter provider, e.g. 'api.callgent.com'"
                    value={formValues.scheme.provider}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                />
            </label>

            <div className="modal-footer">
                {message && (
                    <span className={`${message === true ? 'text--success' : 'text--danger'}`} style={{ marginRight: '10px' }}>
                        {message === true ? 'Successfully!' : message}
                    </span>
                )}

                {securities ? (
                    <button
                        type="button"
                        onClick={handleSelectClick}
                        className="button button--info"
                        disabled={isSubmitting}
                    >
                        Select
                    </button>
                ) : (
                    <>
                        {isEditable ? (
                            <button
                                type="submit"
                                className="button button--info button--secondary"
                                disabled={isSubmitting}
                            >
                                {initialData ? 'Update' : 'Create'}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsEditable(true);
                                }}
                                className="button button--info button--secondary"
                                disabled={isSubmitting}
                            >
                                Edit
                            </button>
                        )}
                        {initialData && (
                            <button
                                type="button"
                                onClick={deleteFunction}
                                className="button button--danger"
                                style={{ marginLeft: '10px' }}
                                disabled={isSubmitting}
                            >
                                Delete
                            </button>
                        )}
                    </>
                )}
            </div>
        </form>
    );
};

export default NewAuth;
