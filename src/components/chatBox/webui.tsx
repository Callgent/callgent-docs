import useIsBrowser from '@docusaurus/useIsBrowser';
import { webcontainerState, webcontainerUrl, webUiState } from '@site/src/recoil/chatBox';
import { startDev } from '@site/src/util/webcontainer';
import { useEffect, useState } from 'react';
import { useRecoilState } from "recoil";

const WebUi = () => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const [webUi] = useRecoilState(webUiState);
    const [webcontainer] = useRecoilState(webcontainerState);

    if (!webUi?.files || !webcontainer) {
        window.history.back();
        return null;
    }
    const [webcontainerurl, setwebcontainerUrl] = useRecoilState(webcontainerUrl);
    const [loading, isLoading] = useState(false)
    const start = async () => {
        isLoading(false)
        await startDev(webcontainer, webUi);
        isLoading(true)
    };

    useEffect(() => {
        start();
    }, []);

    return (
        <div className="w-full h-screen overflow-hidden">
            {(webcontainerurl && loading) && (
                <iframe
                    src={webcontainerurl}
                    className="w-full h-full z-10"
                    style={{ border: 'none' }}
                />
            )}
        </div>
    );
};

export default WebUi;
