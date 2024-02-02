use log::debug;

use crate::services::event_bus::{EventBus, EventBusReceiver, EventBusSender, EventEnvelope};

pub struct LogAggregate {
}

struct AggregateState {
    is_running: bool,
}

impl LogAggregate {
    pub fn start<TEventBus: EventBus>(event_bus: &mut TEventBus) {
        let (event_sender, event_receiver) = event_bus.split();

        tokio::task::spawn(Self::listen(event_sender, event_receiver));
    }

    async fn listen(_event_sender: EventBusSender, mut event_receiver: EventBusReceiver) {
        let mut state = AggregateState {
            is_running: true,
        };

        while state.is_running {
            match event_receiver.receive().await {
                Ok(event) => Self::handle_event(event, &mut state),
                Err(_) => {
                    state.is_running = false;
                }
            }
        }
    }

    fn handle_event(event: EventEnvelope, _state: &mut AggregateState) {
        debug!("Event received: {} [Tick: {}]", event.event_type_id, event.tick);
    }
}