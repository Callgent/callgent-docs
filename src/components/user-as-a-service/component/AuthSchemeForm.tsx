import React from 'react';

const EmptyForm = () => (
    <div>
        <p>This authentication type is not supported yet.</p>
    </div>
);

const ApiKeyForm = ({ formValues, handleInputChange, isEditable }) => (
    <>
        <label>
            <span>Scheme In:</span>
            <select
                name="in"
                value={formValues.scheme.in}
                onChange={handleInputChange}
                disabled={!isEditable}
                defaultValue="header"
                required
            >
                <option value="header">header</option>
                <option value="query">query</option>
                <option value="cookie">cookie</option>
            </select>
        </label>

        <label>
            <span>Scheme Name:</span>
            <input
                type="text"
                name="name"
                placeholder="Enter scheme name, e.g. 'x-api-key'"
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
                placeholder="Enter provider hostname, e.g. 'api.callgent.com'"
                value={formValues.scheme.provider}
                onChange={handleInputChange}
                disabled={!isEditable}
            />
        </label>

        <label>
            <span>Secret:</span>
            <input
                type="text"
                name="secret"
                placeholder="Enter secret, leave empty for user to fill in"
                value={formValues.scheme.secret}
                onChange={handleInputChange}
                disabled={!isEditable}
            />
        </label>
    </>
);

const AuthSchemeForm = ({ authType, formValues, handleInputChange, isEditable }) => {
    switch (authType) {
        case 'apiKey':
            return <ApiKeyForm formValues={formValues} handleInputChange={handleInputChange} isEditable={isEditable} />;
        case 'http':
        case 'oauth2':
        case 'openIdConnect':
            return <EmptyForm />;
        default:
            return null;
    }
};

export default AuthSchemeForm;
