import React, { createContext, useState, ReactNode } from 'react';

interface State {
    showLogin: boolean;
}

interface ContextProps {
    state: State;
    setShowLogin: (showLogin: boolean) => void;
}

const initialState: State = {
    showLogin: false,
};

export const GlobalContext = createContext<ContextProps>({
    state: initialState,
    setShowLogin: () => {},
});

interface GlobalProviderProps {
    children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
    const [state, setState] = useState<State>(initialState);

    const setShowLogin = (showLogin: boolean) => {
        setState((prevState) => ({
            ...prevState,
            showLogin,
        }));
    };

    return (
        <GlobalContext.Provider value={{ state, setShowLogin }}>
            {children}
        </GlobalContext.Provider>
    );
};