import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { chatBoxState } from '@site/src/recoil/chatBox';
import { getChat } from '@site/src/api/chatBox';
import { useLocation } from '@docusaurus/router';
import InputField from './Input';
import ChatBox from './chat-box';

export default function Chat(): JSX.Element {
    const [chatBox, setChatBox] = useRecoilState(chatBoxState);
    const [input, setInput] = useState<string>('');
    const [started, setStarted] = useState<boolean>(false);
    const queryParams = new URLSearchParams(location.search);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        if (!started) setStarted(true);

        setChatBox((prevChatBox) => [...prevChatBox, { role: 'user', type: 'message', message: input }]);
        setInput('');
        
        try {
            const callgentId = queryParams.get('callgentId');
            const entryId = queryParams.get('entryId');
            const response = await getChat(callgentId,entryId,input);
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
    };

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatBox]);

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
