import styles from './ScoreboardControlPanelPage.module.scss';

import { useParams } from 'react-router-dom';
import { Button, Navbar, NavbarGroup, NavbarHeading } from '@blueprintjs/core';
import { GameContextProvider, ClockContextProvider, useDarkThemeContext, ControlPanelContextProvider } from "../../contexts";
import { ScoreboardControlPanel } from '../ScoreboardControlPanel';

export const ScoreboardControlPanelPage = () => {

    const { gameId } = useParams();
    const { useDarkTheme, setUseDarkTheme } = useDarkThemeContext();

    if(!gameId) return (<></>);

    return (
        <div className={`${useDarkTheme && 'bp4-dark'}`}>
            <Navbar fixedToTop>
                <NavbarGroup>
                    <NavbarHeading>💧 Raindrop</NavbarHeading>
                </NavbarGroup>
                <NavbarGroup align='right'>
                    <Button className="bp4-minimal" icon={useDarkTheme ? 'flash' : 'moon'} onClick={() => setUseDarkTheme(!useDarkTheme)} />
                </NavbarGroup>
            </Navbar>
            <div className={styles.controlPanelContent}>
                <GameContextProvider gameId={gameId}>
                    <ClockContextProvider>
                        <ControlPanelContextProvider>
                            <ScoreboardControlPanel />
                        </ControlPanelContextProvider>
                    </ClockContextProvider>
                </GameContextProvider>
            </div>
        </div>
    );
}