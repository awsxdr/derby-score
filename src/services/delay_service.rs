use crate::domain::game_events::GameEvent;

struct DelayedEvent {
    event: GameEvent,
    tick: u64,
}

impl DelayedEvent {
    fn new(event: GameEvent, tick: u64) -> Self {
        Self {
            event,
            tick
        }
    }
}

struct DelayService {
    events: Vec<DelayedEvent>
}

impl DelayService {
    fn new() -> Self {
        Self {
            events: vec![],
        }
    }
}