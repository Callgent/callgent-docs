import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useState, useEffect } from 'react';
import useSubmit from '@site/src/hooks/button';
import axios from 'axios';
import AuthSchemeForm from './AuthSchemeForm';
import './index.scss';

const NewAuth = ({ callgentId, onClose, initialData = null, securities = null, updateRealms, onSubmit }) => {
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
                onClose();
            } else {
                const { data } = await axios.post('/api/callgent-realms', formValues);
                updateRealms('add', data?.data);
                onClose();
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
            setFormValues(prevState => ({
                ...prevState,
                scheme: { ...prevState.scheme, [name]: value }
            }));
        } else {
            setFormValues(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSubmit(submitFunction);
    };

    const handleSelectClick = async () => {
        try {
            const { data } = await axios.post(`/api/callgent-realms/securities/${securities?.type ? 'endpoint' : 'function'}/${securities?.id}`, [
                {
                    "realmKey": initialData?.realmKey
                }
            ]);
            securities.securities = [...securities.securities, data]
            securities.callgentId = callgentId
            onSubmit(securities)
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
                    name="authType"
                    value={formValues.authType}
                    onChange={(e) => {
                        const { value } = e.target;
                        setFormValues(prevState => ({
                            ...prevState,
                            authType: value,
                            scheme: { type: value, in: '', name: '', provider: '' }
                        }));
                    }}
                    disabled={!isEditable}
                    required
                >
                    <option value="apiKey">apiKey</option>
                    <option value="http">http</option>
                    <option value="oauth2">oauth2</option>
                    <option value="openIdConnect">openIdConnect</option>
                </select>
            </label>

            <AuthSchemeForm
                authType={formValues.authType}
                formValues={formValues}
                handleInputChange={handleInputChange}
                isEditable={isEditable}
            />

            <div className="modal-footer">
                {message && (
                    <span
                        className={`${message === true ? 'text--success' : 'text--danger'}`}
                        style={{ marginRight: '10px' }}
                    >
                        {message === true ? 'Successfully!' : message}
                    </span>
                )}

                {securities ? (
                    <button
                        type="button"
                        onClick={() => handleSubmit(handleSelectClick)}
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
                                onClick={() => handleSubmit(deleteFunction)}
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
