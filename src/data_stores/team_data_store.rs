use log::{debug, info, trace};
use sqlite::{Connection, State, Statement, Value};
use uuid::Uuid;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

pub struct TeamDataStore {
    connection_string: String,
}

#[derive(Debug)]
pub struct Team {
    id: Uuid,
    name: String,
    logo_id: Uuid,
}

trait Flushable {
    fn flush(&mut self) -> sqlite::Result<()>;
}

impl<'a> Flushable for Statement<'a> {
    fn flush(&mut self) -> sqlite::Result<()> {
        while self.next()? != State::Done {};
        Ok(())
    }
}

impl TeamDataStore {
    pub fn new(connection_string: &str) -> Result<Self> {
        let store = Self {
            connection_string: connection_string.to_string()
        };

        debug!("Creating teams table if not already present");
        let connection = store.get_connection()?;
        connection.execute("CREATE TABLE IF NOT EXISTS teams (id TEXT PRIMARY KEY, name TEXT, logo_id TEXT)")?;

        info!("Team data store created");

        Ok(store)
    }

    pub fn get_all(&self) -> Result<Vec<Team>> {
        trace!("get_all()");
        
        let connection = self.get_connection()?;

        let mut statement = connection.prepare("SELECT id, name, logo_id FROM teams")?;

        let mut teams: Vec<Team> = vec![];

        while statement.next()? != State::Done {
            teams.push(Team {
                id: Uuid::parse_str(statement.read::<String, _>("id")?.as_str())?,
                name: statement.read::<String, _>("name")?,
                logo_id: Uuid::parse_str(statement.read::<String, _>("logo_id")?.as_str())?,
            });
        }

        Ok(teams)
    }

    pub fn add_or_replace(&self, team: &Team) -> Result<()> {
        trace!("add_or_replace({:?})", team);

        let connection = self.get_connection()?;

        let mut statement = connection.prepare("INSERT INTO teams (id, name, logo_id) VALUES (:id, :name, :logo_id)")?;
        statement.bind::<&[(_, Value)]>(&[
            (":id", team.id.as_simple().to_string().into()),
            (":name", team.name.clone().into()),
            (":logo_id", team.logo_id.as_simple().to_string().into()),
        ])?;

        statement.flush()?;

        Ok(())
    }

    pub fn add_new(&self, team_name: &str) -> Result<Team> {
        trace!("add_new({})", team_name);

        let team = Team {
            id: Uuid::new_v4(),
            name: team_name.to_string(),
            logo_id: Uuid::new_v4(),
        };
        
        self.add_or_replace(&team)?;

        Ok(team)
    }

    fn get_connection(&self) -> Result<Connection> {
        let connection = sqlite::Connection::open(self.connection_string.clone())?;
        
        Ok(connection)
    }
}