import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { chatBoxState, webcontainerState, webcontainerUrl } from '@site/src/recoil/chatBox';
import { getChat } from '@site/src/api/chatBox';
import InputField from './Input';
import ChatBox from './chat-box';
import { WebContainer } from '@webcontainer/api';
import { asyncForEach, initPackages, runShellCommand, vueFiles, writeFile } from '@site/src/util/webcontainer';
import useIsBrowser from '@docusaurus/useIsBrowser';
export default function Chat(): JSX.Element {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const [chatBox, setChatBox] = useRecoilState(chatBoxState);
    const [input, setInput] = useState<string>('');
    const [started, setStarted] = useState<boolean>(false);
    const queryParams = new URLSearchParams(location.search);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState(false)
    const handleSendMessage = async () => {
        if (!input.trim() || loading) return;
        if (!started) setStarted(true);
        setLoading(true);
        setChatBox((prevChatBox) => [...prevChatBox, { role: 'user', type: 'message', message: input }]);
        setInput('');
        try {
            const callgentId = queryParams.get('callgentId');
            const entryId = queryParams.get('entryId');
            const response = await getChat(callgentId, entryId, input);
            const { data, message } = response.data;
            if (message) {
                setChatBox((prevChatBox) => [...prevChatBox, { role: 'bot', type: 'message', message: message }]);
            } else {
                const webui = data.response.data;
                setChatBox((prevChatBox) => [...prevChatBox, { role: 'bot', type: 'web-ui', ...webui }]);
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
        setLoading(false)
    };

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatBox]);

    const [webcontainer, setWebcontainer] = useRecoilState(webcontainerState);
    const [webcontainerurl, setwebcontainerUrl] = useRecoilState(webcontainerUrl);
    const init = async () => {
        const webcontainer = await WebContainer.boot();
        setWebcontainer(webcontainer)
        const initFiles = vueFiles([], {})
        await asyncForEach(initFiles, async (item) => {
            await new Promise<void>(async (resolve, reject) => {
                await writeFile(webcontainer, item.path, item.code, '/vite');
                resolve();
            });
        });
        await runShellCommand(webcontainer, 'pnpm i', { cwd: '/vite' })
        await runShellCommand(webcontainer, 'pnpm i ' + initPackages.join(' '), { cwd: '/vite' })
        await webcontainer.spawn('pnpm', ['run', 'dev'], { cwd: '/vite' });
        webcontainer.on('server-ready', (port, url) => {
            setwebcontainerUrl(url)
            console.log('ok');
        });
    }

    useEffect(() => {
        if (!webcontainer) { init() }
    }, [])
    return (
        <div className="h-screen items-center justify-center transition-colors overflow-y-scroll scrollbar-custom">
            <div className="fixed w-[calc(100vw-15px)] flex justify-end p-2 bg-white dark:bg-[#1B1B1D]">
                <img
                    src="https://via.placeholder.com/40"
                    alt="头像"
                    className="object-cover w-8 h-8 rounded-full bg-gray-400 overflow-hidden"
                />
            </div>

            <div className="w-full max-w-[850px] mx-auto p-4 mt-12 mb-24">
                <div className="w-full flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto">
                        <ChatBox chatBox={chatBox} />
                    </div>
                    <div ref={chatEndRef}></div>
                </div>
            </div>

            <div className="fixed h-28 w-[calc(100vw-15px)] flex justify-center p-4 bg-white dark:bg-[#1B1B1D] z-50 bottom-0">
                <div className="w-full max-w-[850px]">
                    <InputField
                        input={input}
                        setInput={setInput}
                        handleSendMessage={handleSendMessage}
                    />
                </div>
            </div>
        </div>
    );
}
