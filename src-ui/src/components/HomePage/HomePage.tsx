import styles from './HomePage.module.scss';

import { Button, Navbar, NavbarGroup, NavbarHeading } from '@blueprintjs/core';
import { useState } from 'react';
import { CardWithTitle } from '../CardWithTitle/CardWithTitle';
import { GamesList } from '../GamesList';
import { NewGameDialog } from '../NewGameDialog';
import { useDarkThemeContext } from '../../contexts';

export const HomePage = () => {

    const [isNewGameDialogOpen, setIsNewGameDialogOpen] = useState(false);

    const { useDarkTheme, setUseDarkTheme } = useDarkThemeContext();

    const onNewGameClicked = () => {
        setIsNewGameDialogOpen(true);
    };

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
            <div className={styles.homeContent}>
                <CardWithTitle header="Games" buttons={<Button icon="plus" onClick={onNewGameClicked}>New</Button>}>
                    <GamesList />
                </CardWithTitle>
            </div>
            { isNewGameDialogOpen && <NewGameDialog isOpen={isNewGameDialogOpen} onClose={() => setIsNewGameDialogOpen(false)} /> }
        </div>
    );
}