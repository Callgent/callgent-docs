import React, { useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { TabsProps } from '@site/src/types/components';
import './index.scss';

const Tabs: React.FC<TabsProps> = ({ tabs, callgentId }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="tabs-container">
            <div className="tabs-header">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`tab-button ${index === activeTab ? 'active' : ''}`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="tabs-content">
                {tabs[activeTab] && tabs[activeTab].content}
            </div>
        </div>
    );
};

export default Tabs;
