mod api;
mod data_stores;
mod domain;
mod services;

use std::{path::Path, time::Duration};

use clap::Parser;
use domain::events::JamEnded;
use simplelog::{ColorChoice, CombinedLogger, Config, TermLogger, TerminalMode};
use log::{info, LevelFilter};

use crate::{
    data_stores::{
        logo_data_store::LogoDataStore,
        team_data_store::TeamDataStore,
    },
    domain::{
        events::JamStarted, jam_clock_aggregate::JamClockAggregate, log_aggregate::LogAggregate, period_clock_aggregate::PeriodClockAggregate
    },
    services::{
        clock::ProgramClock, event_bus::{EventBus, PersistedEventBus}, event_store::EventStore
    }
};

#[derive(Parser, Debug)]
struct CommandLineArguments {
    #[arg(long = "hostname", default_value = "0.0.0.0")]
    hostname: String,

    #[arg(short = 'p', long = "hostPort", default_value_t = 8000)]
    host_port: u16,

    #[arg(short = 'l', long = "logLevel", default_value = "info")]
    log_level: String,
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

    //info!("Starting server at address http://{}:{}/", arguments.hostname, arguments.host_port);

    info!("Initializing data stores...");

    LogoDataStore::new(Path::new(".").join("data").join("images").join("team_logos")).unwrap();
    let team_data_store = TeamDataStore::new("test.db").unwrap();

    info!("Done");

    team_data_store.add_new("Test Team 1").unwrap();
    team_data_store.add_new("Test Team 2").unwrap();

    for team in team_data_store.get_all().unwrap() {
        println!("{:?}", team);
    }

    let clock = ProgramClock::new();

    let event_store = EventStore::new("test.db").unwrap();
    let mut event_bus = PersistedEventBus::new(event_store, clock);

    LogAggregate::start(&mut event_bus);
    JamClockAggregate::start(&mut event_bus);
    PeriodClockAggregate::start(&mut event_bus);

    // event_bus.get_sender().send(JamStarted { }).await.unwrap();
    // tokio::time::sleep(Duration::from_secs(1)).await;
    // event_bus.get_sender().send(JamEnded { }).await.unwrap();

    // tokio::time::sleep(Duration::from_secs(3)).await;
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