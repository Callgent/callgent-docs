import { ModalFormProps, Realm, Realms } from '@site/src/types/components';
import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useEffect, useState, useCallback } from 'react';
import Tabs from '../tree/component/tabs';
import NewAuth from './component/create-auth';

const Auth: React.FC<ModalFormProps> = ({ treeData, onClose, setTreeData, initialData = null }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }

    const [realms, setRealms] = useState<any>(treeData?.realms || []);
    const [tabsData, setTabsData] = useState([]);

    const updateRealms = (type: 'edit' | 'add', updatedItem: Realm, realmKey: string) => {
        if (type === 'edit') {
            setRealms((prevRealms: Array<Realm>) => prevRealms.map((realm: Realm) =>
                realm.realmKey === realmKey ? updatedItem : realm
            ));
        } else if (type === 'add') {
            setRealms((prevRealms: Array<Realm>) => [...prevRealms, updatedItem]);
        } else if (type === 'delete') {
            setRealms((prevRealms: Array<Realm>) => prevRealms.filter((realm: Realm) => realm.realmKey !== realmKey));
        }
    };

    const init = () => {
        const tabs = realms.map((item: Realm) => {
            return {
                label: item.authType,
                content: (
                    <NewAuth
                        callgentId={treeData?.id}
                        initialData={item}
                        onClose={onClose}
                        securities={initialData}
                        updateRealms={updateRealms}
                    />
                )
            };
        });
        if (!initialData) {
            tabs.push({
                label: '+',
                content: (
                    <NewAuth
                        callgentId={treeData?.id}
                        onClose={onClose}
                        updateRealms={updateRealms}
                    />
                )
            });
        }
        setTabsData(tabs);
    };

    useEffect(() => {
        init();
        setTreeData([
            { ...treeData, realms: realms }
        ])
    }, [realms]);

    return (
        <div>
            <Tabs tabs={tabsData} callgentId={treeData?.id} />
        </div>
    );
};

export default Auth;
