use clap::Parser;
use simplelog::{ColorChoice, CombinedLogger, Config, TermLogger, TerminalMode};
use log::{info, LevelFilter};

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

    info!("Starting server at address http://{}:{}/", arguments.hostname, arguments.host_port);
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