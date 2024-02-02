use serde::{Deserialize, Serialize};
use serde_json::json;
use tokio::sync::broadcast::{self, error::RecvError, Receiver, Sender};

use super::{clock::ProgramClock, event_store::EventStore};

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

pub struct EventBusReceiver {
    receiver: Receiver<EventEnvelope>,
}

impl EventBusReceiver {
    pub fn new(receiver: Receiver<EventEnvelope>) -> Self {
        Self {
            receiver,
        }
    }

    pub async fn receive(&mut self) -> std::result::Result<EventEnvelope, RecvError> {
        self.receiver.recv().await
    }
}

#[derive(Clone)]
pub struct EventBusSender {
    sender: Sender<EventEnvelope>,
    event_store: EventStore,
    clock: ProgramClock,
}

impl EventBusSender {
    pub fn new(sender: Sender<EventEnvelope>, event_store: EventStore, clock: ProgramClock) -> Self {
        Self {
            sender,
            event_store,
            clock,
        }
    }

    pub async fn send<TEvent: SerializableEvent>(&mut self, event: TEvent) -> Result<()> {
        let envelope = self.wrap_event(event.clone());

        self.persist(&event, envelope.tick)?;
        self.sender.send(envelope)?;

        Ok(())
    }

    fn subscribe(&self) -> EventBusReceiver {
        EventBusReceiver::new(self.sender.subscribe())
    }

    fn persist<TEvent: SerializableEvent>(&self, event: &TEvent, tick: u128) -> Result<()> {
        self.event_store.persist(event, tick)
    }

    fn wrap_event<TEvent: SerializableEvent>(&self, event: TEvent) -> EventEnvelope {
        EventEnvelope::new(self.clock.get_tick(), event)
    }
}

pub trait Event {
    fn get_type_id(&self) -> &'static str;
}

pub trait SerializableEvent: Event + Serialize + for<'a> Deserialize<'a> + Clone + 'static {
}

#[derive(Clone, Debug)]
pub struct EventEnvelope {
    pub tick: u128,
    pub event: String,
    pub event_type_id: String,
}

impl EventEnvelope {
    pub fn new<TEvent: SerializableEvent>(tick: u128, event: TEvent) -> Self {
        Self {
            tick,
            event: json!(event).to_string(),
            event_type_id: event.get_type_id().to_string(),
        }
    }
}

pub trait EventBus {
    fn add_listener(&mut self) -> EventBusReceiver;
    fn get_sender(&self) -> EventBusSender;
    fn split(&mut self) -> (EventBusSender, EventBusReceiver);
}

pub struct PersistedEventBus {
    sender: EventBusSender,
}

impl PersistedEventBus {
    pub fn new(event_store: EventStore, clock: ProgramClock) -> Self {
        let (sender, _) = broadcast::channel::<EventEnvelope>(128);

        Self {
            sender: EventBusSender::new(sender, event_store, clock),
        }
    }
}

impl EventBus for PersistedEventBus {
    fn add_listener(&mut self) -> EventBusReceiver {
        self.sender.subscribe()
    }

    fn get_sender(&self) -> EventBusSender {
        self.sender.clone()
    }

    fn split(&mut self) -> (EventBusSender, EventBusReceiver) {
        (
            self.get_sender(),
            self.add_listener(),
        )
    }
}