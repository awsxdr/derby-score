mod domain;
mod services;

use async_trait::async_trait;
use clap::Parser;
use cqrs_es::{mem_store::MemStore, CqrsFramework, EventEnvelope, Query};
use simplelog::{ColorChoice, CombinedLogger, Config, TermLogger, TerminalMode};
use log::{debug, info, LevelFilter};

use domain::jam_clock::{JamClock, JamClockCommand::StartJam, JamClockCommand::StopJam, JamClockServices };

#[derive(Parser, Debug)]

struct CommandLineArguments {
    #[arg(long = "hostname", default_value = "0.0.0.0")]
    hostname: String,

    #[arg(short = 'p', long = "hostPort", default_value_t = 8000)]
    host_port: u16,

    #[arg(short = 'l', long = "logLevel", default_value = "info")]
    log_level: String,
}

#[derive(Debug)]
struct JamStateQuery {}

#[async_trait]
impl Query<JamClock> for JamStateQuery {
    async fn dispatch(&self, aggregate_id: &str, events: &[EventEnvelope<JamClock>]) {
        debug!("Dispatch");
        for event in events {
            debug!("{}-{}\n{:#?}", aggregate_id, event.sequence, &event.payload);
        }
    }
}

#[tokio::main]
async fn main() {
    let arguments = CommandLineArguments::parse();

    let log_level = parse_log_level(arguments.log_level.as_str());
    CombinedLogger::init(
        vec![
            TermLogger::new(log_level, Config::default(), TerminalMode::Mixed, ColorChoice::Auto),
        ]
    ).unwrap();

    info!("Starting server at address http://{}:{}/", arguments.hostname, arguments.host_port);

    let event_store = MemStore::<JamClock>::default();
    let query = JamStateQuery { };

    let cqrs = CqrsFramework::new(event_store, vec![Box::new(query)], JamClockServices { });

    let aggregate_id = "JamClock-Aggregate-A";
    cqrs.execute(aggregate_id, StartJam { }).await.unwrap();

    cqrs.execute(aggregate_id, StopJam { }).await.unwrap();
}


fn parse_log_level(level: &str) -> LevelFilter {
    match level.to_ascii_lowercase().as_str() {
        "trace" => LevelFilter::Trace,
        "debug" => LevelFilter::Debug,
        "info" => LevelFilter::Info,
        "warn" => LevelFilter::Warn,
        "error" => LevelFilter::Error,
        "none" => LevelFilter::Off,
        _ => LevelFilter::Info
    }
}