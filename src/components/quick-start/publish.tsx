import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { CallgentResponse } from '@site/src/types/user';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Publish = ({ name }: { name: string }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) return null;

    const [callgent, setCallgent] = useState<CallgentResponse>();
    const [submitted, setSubmitted] = useState(false);
    const { siteConfig } = useDocusaurusContext();
    const appUrl = siteConfig.customFields.appUrl;

    const init = async () => {
        const LocCallgent = sessionStorage.getItem('callgent');
        if (LocCallgent) {
            setCallgent(JSON.parse(LocCallgent));
        }
    };

    useEffect(() => {
        init();
    }, []);

    const publish = async () => {
        if (!callgent || submitted) return;
        try {
            await axios.post(`/api/hub/callgents/${callgent.id}/commit`, {
                name: callgent.name,
            });
            setSubmitted(true);
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                setSubmitted(true);
            } else {
                console.error('Publish error:', error);
            }
        }
    };

    return (
        <span className="tailwind">
            {callgent?.name ? (
                <span
                    onClick={publish}
                    className={`${submitted ? 'text-green-700 cursor-not-allowed' : 'text-green-700 cursor-pointer hover:underline'
                        }`}
                >
                    {name}
                </span>
            ) : (
                <span className="text-gray-500">{name}</span>
            )}
        </span>
    );
};

export default Publish;
