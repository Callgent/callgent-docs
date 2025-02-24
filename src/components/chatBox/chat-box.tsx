import React from 'react';
import { marked } from 'marked';
import { useRecoilState } from 'recoil';
import { webUiState } from '@site/src/recoil/chatBox';
import Link from '@docusaurus/Link';
import useIsBrowser from '@docusaurus/useIsBrowser';
interface Message {
    role: 'user' | 'bot';
    type?: string;
    message?: string;
}

interface ChatBoxProps {
    chatBox: Message[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ chatBox }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const [webUi, setWebUi] = useRecoilState(webUiState);

    const pushWebUi = (item) => {
        setWebUi(item);
    }
    const renderMessageContent = (message: Message) => {
        switch (message?.type) {
            case 'web-ui':
                return (<div className="w-80 h-48 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-lg shadow-lg transition-all" onClick={() => pushWebUi(message)}>
                    <Link className="h-12 bg-gray-400 dark:bg-gray-600 rounded-t-lg px-4 flex items-center justify-between" to='/chatbox/web-ui'>
                        <div>WebUi</div>
                        <div className="flex justify-end items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                            </svg>
                        </div>
                    </Link>
                    <div className="p-4 space-y-2 ">
                        <div className="w-1/2 h-4 bg-gray-400 dark:bg-gray-600 rounded "></div>
                        <div className="w-3/4 h-4 bg-gray-400 dark:bg-gray-600 rounded"></div>
                        <div className="w-2/3 h-4 bg-gray-400 dark:bg-gray-600 rounded"></div>
                    </div>
                </div>);
            case 'message':
                return <div className="p-2 prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: marked(message.message) }} />;
            default:
                return <div className="p-2 prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: marked(message.message) }} />;
        }
    };

    return (
        <div className="flex-1 w-full overflow-y-auto space-y-4">
            {chatBox.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'bot' ? (
                        <div className='rounded-lg text-gray-900 dark:text-gray-100 w-[90vw] flex'>
                            <img
                                src="https://via.placeholder.com/40"
                                alt="头像"
                                className="w-6 h-6 rounded-full bg-gray-400 object-cover mr-4"
                            />
                            <div>
                                {renderMessageContent(message)}
                            </div>
                        </div>
                    ) : (
                        <div className='px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'>
                            {message.message}
                        </div>
                    )}
                </div>
            ))}
            {chatBox.length % 2 !== 0 && (
                <div className="justify-start">
                    <div className='rounded-lg text-gray-900 dark:text-gray-100 flex'>
                        <img
                            src="https://via.placeholder.com/40"
                            alt="头像"
                            className="w-6 h-6 rounded-full bg-gray-400 object-cover mr-8"
                        />
                        <div className='flex items-center'>
                            <div className="w-1 h-1 bg-gray-400 rounded-full animate-grow"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(ChatBox);
