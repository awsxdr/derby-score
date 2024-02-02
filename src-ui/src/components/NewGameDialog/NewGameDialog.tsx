import { Button, ControlGroup, Dialog, DialogBody, DialogFooter, FormGroup, InputGroup, MenuItem, Spinner } from '@blueprintjs/core';
import { Select2 } from '@blueprintjs/select';
import { ItemRenderer, ItemPredicate } from '@blueprintjs/select/lib/esm/common';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api, { CreateGameRequest, Team } from '../../api';
import { TeamColorSet, TeamType } from '../../api/events';
import { useDarkThemeContext } from '../../contexts/DarkThemeContext';
import { Color } from '../../types';
import { ColorPicker } from '../ColorPicker';

interface INewGameDialogProps {
    isOpen: boolean;
    onClose?: () => void;
}

const teamItemRenderer: ItemRenderer<Team> = (team, { handleClick, handleFocus, modifiers, query}) => {
    if(!modifiers.matchesPredicate) {
        return null;
    }

    return (<MenuItem 
        active={modifiers.active}
        disabled={modifiers.disabled}
        key={team.name}
        roleStructure="listoption"
        text={team.name}
        onClick={handleClick}
        onFocus={handleFocus}
    />);
}

const filterTeam: ItemPredicate<Team> = (query, team, __index, exactMatch) => {
    const normalizedName = team.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    return exactMatch
        ? normalizedName === normalizedQuery
        : normalizedName.indexOf(normalizedQuery) >= 0;
}

interface ITeamSelectProps {
    teams: Team[];
    selectedTeam?: Team;
    onTeamSelected: (team: Team) => void;
    disabled?: boolean;
}

const TeamSelect = ({teams, selectedTeam, onTeamSelected, disabled}: ITeamSelectProps) => (
    <Select2<Team>
        items={teams}
        itemPredicate={filterTeam}
        itemRenderer={teamItemRenderer}
        inputProps={{ className: 'team-select-filter' }}
        noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
        onItemSelect={onTeamSelected}
        disabled={disabled}
        className="teamSelect"
        >
        <Button text={selectedTeam?.name || "Select a team"} rightIcon="double-caret-vertical" placeholder="Select a team" disabled={disabled} />
    </Select2>
);

export const NewGameDialog = ({ isOpen, onClose }: INewGameDialogProps) => {

    const { useDarkTheme } = useDarkThemeContext();

    const navigate = useNavigate();

    const [hasLoaded, setHasLoaded] = useState(false);
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedHomeTeam, setSelectedHomeTeam] = useState<Team>();
    const [selectedAwayTeam, setSelectedAwayTeam] = useState<Team>();
    const [homeTeamColor, setHomeTeamColor] = useState(Color.fromHex('#000'));
    const [awayTeamColor, setAwayTeamColor] = useState(Color.fromHex('#fff'));
    const [isCreatingGame, setIsCreatingGame] = useState(false);

    const isInputValid =
        selectedHomeTeam
        && selectedAwayTeam;

    useEffect(() => {

        Api.Teams.getTeams()
            .then(setTeams)
            .then(() => setHasLoaded(true));

    }, [setHasLoaded, setTeams]);

    const handleCreateGame = () => {
        setIsCreatingGame(true);

        Api.Games.createGame(new CreateGameRequest(selectedHomeTeam!.id, selectedAwayTeam!.id))
            .then(gameId => 
                Api.Events.addEvent(gameId, new TeamColorSet(TeamType.Home, homeTeamColor))
                .then(() => Api.Events.addEvent(gameId, new TeamColorSet(TeamType.Away, awayTeamColor)))
                .then(() => navigate(`/games/${gameId}/controlPanel`)));
    }

    return (
        <Dialog isOpen={isOpen} canOutsideClickClose={false} onClose={onClose} title="New game" className={useDarkTheme ? 'bp4-dark' : ''}>
            <DialogBody>
                { !hasLoaded && <Spinner /> }
                { hasLoaded &&
                    <div>
                        <FormGroup label="Home team">
                            <ControlGroup>
                                <TeamSelect teams={teams} selectedTeam={selectedHomeTeam} onTeamSelected={setSelectedHomeTeam} disabled={isCreatingGame} />
                                <ColorPicker color={homeTeamColor} onColorPicked={setHomeTeamColor} disabled={isCreatingGame} />
                            </ControlGroup>
                        </FormGroup>
                        <FormGroup label="Away team">
                            <ControlGroup>
                                <TeamSelect teams={teams} selectedTeam={selectedAwayTeam} onTeamSelected={setSelectedAwayTeam} disabled={isCreatingGame} />
                                <ColorPicker color={awayTeamColor} onColorPicked={setAwayTeamColor} disabled={isCreatingGame} />
                            </ControlGroup>
                        </FormGroup>
                        <FormGroup label="Password" labelInfo="(optional)" helperText="Enter a password to prevent unwanted modification of games">
                            <InputGroup type='password' />
                        </FormGroup>
                    </div>
                }
            </DialogBody>
            <DialogFooter 
                actions={
                    <>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button intent="primary" disabled={!isInputValid || isCreatingGame} onClick={handleCreateGame} loading={isCreatingGame}>Create</Button>
                    </>
                } />
        </Dialog>
    );
};