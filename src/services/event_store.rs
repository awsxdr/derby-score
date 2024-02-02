use log::{debug, trace};
use mockall::automock;
use serde_json::json;
use sqlite::{State, Value};

use super::event_bus::SerializableEvent;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

#[derive(Clone)]
pub struct EventStore {
    connection_string: String,
}

#[automock]
impl EventStore {
    pub fn new(connection_string: &str) -> Result<Self> {
        let store = Self {
            connection_string: connection_string.to_string(),
        };

        store.create_events_table().unwrap();

        Ok(store)
    }

    pub fn persist<TEvent: SerializableEvent>(&self, event: &TEvent, tick: u128) -> Result<()> {
        let data = json!(event);
        trace!("Persisting event of type {} with data {}", event.get_type_id(), data.to_string());
        
        let tick_bytes: Vec<u8> = tick.to_le_bytes().into();

        let connection = self.get_connection()?;

        let mut statement = connection.prepare("INSERT INTO events VALUES (:tick, :type, :event)")?;
        statement.bind::<&[(_, Value)]>(&[
                (":tick", tick_bytes.into()),
                (":type", event.get_type_id().into()),
                (":event", data.to_string().into())
            ])?;
        while statement.next()? != State::Done {}

        Ok(())
    }

    pub fn get_connection(&self) -> std::result::Result<sqlite::Connection, sqlite::Error> {
        sqlite::open(self.connection_string.clone())
    }

    fn create_events_table(&self) -> Result<()> {
        debug!("Creating events table if not already created");
        let connection = self.get_connection()?;
        connection.execute("CREATE TABLE IF NOT EXISTS events (tick BLOB, type TEXT, event TEXT)")?;

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use serde::{Deserialize, Serialize};

    use crate::{event, services::event_bus::{Event, SerializableEvent}};
    use rand::Rng;

    use super::*;

    event!(TestEvent, TEST_EVENT);

    #[test]
    fn persist_stores_event() {
        let event_store = EventStore::new(":memory:").unwrap();
        let event = TestEvent {};
        let tick: u128 = rand::thread_rng().gen();

        event_store.persist(&event, tick).unwrap();
    }
}