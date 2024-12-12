import React, { useState, createContext, useContext, ReactNode } from 'react';

const LoadingGlobalContext = createContext<LoadingGlobalContextType | undefined>(undefined);

export const LoadingGlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);

    return (
        <LoadingGlobalContext.Provider value={{ isLoadingGlobal, setIsLoadingGlobal }}>
            {children}
        </LoadingGlobalContext.Provider>
    );
};

export const useLoadingGlobal = () => {
    const context = useContext(LoadingGlobalContext);
    if (!context) {
        throw new Error('useLoadingGlobal must be used within a LoadingGlobalProvider');
    }
    return context;
};
