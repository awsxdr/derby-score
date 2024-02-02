import styles from './TeamControlButtons.module.scss';
import { useMemo } from 'react';
import { Button, ButtonGroup } from "@blueprintjs/core";
import { TeamType } from '../../api';
import { useHotkeys } from 'react-hotkeys-hook';

interface ITeamControlButtonsProps {
    team: TeamType;
    isLead: boolean;
    hasLostLead: boolean;
    onLeadToggle?: () => void;
    onLostLeadToggle?: () => void;
}

export const TeamControlButtons = ({ team, isLead, hasLostLead, onLeadToggle, onLostLeadToggle }: ITeamControlButtonsProps) => {
    const teamTypeName = team === TeamType.Home ? 'home' : 'away';

    const hotkeys = useMemo(() => [
        {
            combo: team === TeamType.Home ? 'd' : ';',
            global: true,
            label: `Toggle ${teamTypeName} team lead`,
            onKeyDown: onLeadToggle,
            stopPropagation: true,
        },
        {
            combo: team === TeamType.Home ? 'shift+d' : 'shift+;',
            global: true,
            label: `Toggle ${teamTypeName} lost lead`,
            onKeyDown: onLostLeadToggle,
            stopPropagation: true,
        },
    ], [onLeadToggle, onLostLeadToggle]);

    const hotkeyOptions = {
        enableOnFormTags: true,
        preventDefault: true,
    };

    useHotkeys(team === TeamType.Home ? 'd' : ';', () => onLeadToggle && onLeadToggle(), hotkeyOptions, [onLeadToggle]);
    useHotkeys(team === TeamType.Home ? 'shift+d' : 'shift+:', () => onLostLeadToggle && onLostLeadToggle(), hotkeyOptions, [onLostLeadToggle]);

    return (
        <ButtonGroup>
            <Button className={styles.clearActiveButton} large active={isLead} onClick={onLeadToggle}>Lead</Button>
            <Button className={styles.clearActiveButton} large active={hasLostLead} onClick={onLostLeadToggle}>Lost</Button>
        </ButtonGroup>
    );
}