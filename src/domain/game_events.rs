use serde::{Deserialize, Serialize};


#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum GameEvent {
    JamStarted {
        tick: u64,
    },
    JamStopped {
        tick: u64,
    },
}

impl DomainEvent for GameEvent {
    fn event_type(&self) -> String {
        match self {
            GameEvent::JamStarted { .. } => "JamStarted",
            GameEvent::JamStopped { .. } => "JamStopped",
        }.to_string()
    }

    fn event_version(&self) -> String {
        "1.0".to_string()
    }
}
