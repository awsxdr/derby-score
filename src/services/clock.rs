use std::time::SystemTime;

use mockall::automock;

#[derive(Clone)]
pub struct ProgramClock {
    start_time: SystemTime,
}

#[automock]
impl ProgramClock {
    pub fn new() -> Self {
        Self {
            start_time: SystemTime::now(),
        }
    }

    pub fn get_tick(&self) -> u128 {
        self.start_time.elapsed().unwrap().as_millis()
    }
}
