import { createContext, useContext, useCallback, useState, PropsWithChildren, useEffect } from "react";
import { getCookie, setCookie } from 'typescript-cookie';

export interface DarkThemeContextProps {
    useDarkTheme: boolean;
    setUseDarkTheme: (useDarkTheme: boolean) => void;
};

const DefaultDarkThemeContext = (): DarkThemeContextProps => ({
    useDarkTheme: false,
    setUseDarkTheme: _ => {},
});

const DarkThemeContext = createContext<DarkThemeContextProps>(DefaultDarkThemeContext());

export const useDarkThemeContext = () => useContext(DarkThemeContext);

export const DarkThemeContextProvider = ({ children }: PropsWithChildren) => {

    const [useDarkTheme, setUseDarkTheme] = useState(false);

    const handleDarkThemeSet = (value: boolean) => {
        setUseDarkTheme(value);
        setCookie('darkmode', value);
    };

    useEffect(() => {
        setUseDarkTheme(getCookie('darkmode')?.toLowerCase() === 'true');
    }, [setUseDarkTheme])

    return (
        <DarkThemeContext.Provider value={{ useDarkTheme, setUseDarkTheme: handleDarkThemeSet }}>
            { children }
        </DarkThemeContext.Provider>
    ); }