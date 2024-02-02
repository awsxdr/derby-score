use std::time::Duration;

use log::{debug, trace};

use crate::{domain::events::JAM_ENDED_EVENT_ID, services::event_bus::{EventBus, EventBusReceiver, EventBusSender, EventEnvelope}};

use super::events::{JamEnded, JAM_STARTED_EVENT_ID};

pub struct JamClockAggregate {
    event_sender: EventBusSender,
    event_receiver: EventBusReceiver,
}

struct AggregateState {
    is_listening: bool,
    is_running: bool,
    stop_jam_task: Option<tokio::task::JoinHandle<()>>,
}

impl JamClockAggregate {
    pub fn start<TEventBus: EventBus>(event_bus: &mut TEventBus) {
        let (event_sender, event_receiver) = event_bus.split();

        tokio::task::spawn(Self::listen(event_sender, event_receiver));
    }

    async fn listen(event_sender: EventBusSender, event_receiver: EventBusReceiver) {
        let mut aggregate = Self {
            event_sender,
            event_receiver
        };
        
        let mut state = AggregateState {
            is_listening: true,
            is_running: false,
            stop_jam_task: None,
        };

        while state.is_listening {
            match aggregate.event_receiver.receive().await {
                Ok(event) => aggregate.handle_event(event, &mut state),
                Err(_) => {
                    state.is_listening = false;
                }
            }
        }
    }

    fn handle_event(&mut self, event: EventEnvelope, state: &mut AggregateState) {
        match event.event_type_id.as_str() {
            JAM_STARTED_EVENT_ID => {
                trace!("Jam started");
                state.is_running = true;
                state.stop_jam_task = Some(tokio::task::spawn(
                    Self::wait_for_jam_end(self.event_sender.clone())));
            }
            JAM_ENDED_EVENT_ID => {
                trace!("Jam ended");
                state.is_running = false;
                if let Some(t) = &state.stop_jam_task {
                    t.abort();
                }
                state.stop_jam_task = None;
            }
            _ => { }
        }
    }

    async fn wait_for_jam_end(mut event_sender: EventBusSender) {
        debug!("1");
        tokio::time::sleep(Duration::from_secs(2)).await;
        debug!("2");
        event_sender.send(JamEnded {}).await.unwrap();
        debug!("3");
    }
}