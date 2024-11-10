import React, { useState, useEffect } from 'react';

type OptionType = {
    [key: string]: string;
};

interface CustomSelectProps {
    label: string;
    options: OptionType;
    onSelect: (key: string) => void;
    selectedKey?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, options, onSelect, selectedKey }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentSelectedKey, setCurrentSelectedKey] = useState<string>('');

    useEffect(() => {
        if (selectedKey) {
            setCurrentSelectedKey(selectedKey);
        } else if (Object.keys(options).length > 0) {
            setCurrentSelectedKey(Object.keys(options)[0]);
        }
    }, [selectedKey, options]);

    const handleSelect = (key: string) => {
        setCurrentSelectedKey(key);
        onSelect(key);
        setIsOpen(false);
    };

    const selectedValue = options[currentSelectedKey] || '';

    return (
        <div className="form-group">
            <label htmlFor="adaptor">{label}</label>
            <div className="custom-select" onClick={() => setIsOpen(!isOpen)}>
                <div className="selected-text">
                    <span>
                        {selectedValue && (<img src={selectedValue} alt="icon" />)}
                        {currentSelectedKey || 'Select adaptor'}
                    </span>
                    <span className="dropdown-icon">▼</span>
                </div>
                {isOpen && (
                    <ul className="options">
                        {Object.entries(options).map(([key, value]) => (
                            <li key={key} onClick={() => handleSelect(key)} className="option-item">
                                {value && (<img src={value} alt="icon" />)}{key}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CustomSelect;
