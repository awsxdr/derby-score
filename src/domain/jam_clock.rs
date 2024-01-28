use std::fmt::Display;

use async_trait::async_trait;
use cqrs_es::Aggregate;
use log::debug;
use serde::{Deserialize, Serialize};

use super::game_events::GameEvent;

#[derive(Debug, Deserialize)]
pub enum JamClockCommand {
    StartJam { },
    StopJam { },
}

#[derive(Debug)]
pub struct JamClockError(String);

impl Display for JamClockError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl std::error::Error for JamClockError {}

impl From<&str> for JamClockError {
    fn from(value: &str) -> Self {
        Self(value.to_string())
    }
}

#[derive(Default, Serialize, Deserialize)]
pub struct JamClock {
    is_running: bool,
}

pub struct JamClockServices;

#[async_trait]
impl Aggregate for JamClock {
    type Command = JamClockCommand;
    type Event = GameEvent;
    type Error = JamClockError;
    type Services = JamClockServices;

    fn aggregate_type() -> String {
        "JamClock".to_string()
    }

    async fn handle(
        &self,
        command: Self::Command,
        _services: &Self::Services,
    ) ->  Result<Vec<Self::Event> ,Self::Error> {
        match command {
            JamClockCommand::StartJam {  } => Ok(vec![GameEvent::JamStarted { tick: 123 }]),
            JamClockCommand::StopJam { } => Ok(vec![GameEvent::JamStopped { tick: 321 }]),
        }
    }

    fn apply(&mut self, event:Self::Event) {
        debug!("Apply");
        match event {
            GameEvent::JamStarted { .. } => {
                debug!("Jam started");
                self.is_running = true;
            }

            GameEvent::JamStopped { .. } => {
                debug!("Jam stopped");
                self.is_running = false;
            }
        }
    }
}