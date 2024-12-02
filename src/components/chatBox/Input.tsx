import React, { useEffect, useRef } from 'react';

interface InputFieldProps {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    handleSendMessage: () => void;
}

const InputField: React.FC<InputFieldProps> = ({ input, setInput, handleSendMessage }) => {

    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        const handleInput = () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
        };
        textarea.addEventListener('input', handleInput);
        return () => { textarea.removeEventListener('input', handleInput); };
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        } else if (e.key === 'Enter' && e.shiftKey) {
            // 默认行为：换行
            return;
        }
    };

    return (
        <div className="flex flex-col w-full bg-[#F4F4F4] dark:bg-[#2F2F2F] rounded-xl p-3">
            <div className="w-full">
                <textarea
                    ref={textareaRef}
                    placeholder="Describe the UI you'd like to generate."
                    className="resize-none w-full border-none border-transparent bg-transparent focus:outline-none focus:ring-0"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <div className="w-full flex justify-end">
                <svg
                    className="mr-[-1px]"
                    onClick={handleSendMessage}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path
                        fillRule="evenodd"
                        d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"
                    />
                </svg>
            </div>
        </div>
    );
};

export default InputField;
