use crate::services::event_bus::{EventBus, EventBusReceiver, EventBusSender, EventEnvelope};

use super::events::{PeriodStarted, JAM_STARTED_EVENT_ID};

pub struct PeriodClockAggregate {
    event_sender: EventBusSender,
    event_receiver: EventBusReceiver,
}

struct AggregateState {
    is_running: bool,
    period_running: bool,
}

impl PeriodClockAggregate {
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
            is_running: true,
            period_running: false,
        };

        while state.is_running {
            match aggregate.event_receiver.receive().await {
                Ok(event) => aggregate.handle_event(event, &mut state).await,
                Err(_) => {
                    state.is_running = false;
                }
            }
        }
    }

    async fn handle_event(&mut self, event: EventEnvelope, state: &mut AggregateState) {
        match event.event_type_id.as_str() {
            JAM_STARTED_EVENT_ID => {
                if !state.period_running {
                    self.event_sender.send(PeriodStarted {}).await.unwrap();
                }
            },
            _ => { }
        }
    }
}