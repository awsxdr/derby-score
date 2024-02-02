
use serde::{Deserialize, Serialize};

use crate::services::event_bus::{Event, SerializableEvent};

#[macro_export]
macro_rules! event {
    ($n:tt, $c:tt) => {
        #[derive(Clone, Serialize, Deserialize)]
        pub struct $n;
        pub const $c: &str = stringify!($n);
        impl Event for $n {
            fn get_type_id(&self) -> &'static str { $c }
        }
        impl SerializableEvent for $n {}
    }
}

event!(JamStarted, JAM_STARTED_EVENT_ID);
event!(JamEnded, JAM_ENDED_EVENT_ID);
event!(PeriodStarted, PERIOD_STARTED_EVENT_ID);
