import { format, createLogger, transports } from "winston";
import chalk from "chalk";

const errorColor = chalk.red.bold;
const warnColor = chalk.yellow.bold;
const infoColor = chalk.white.bold;
const successColor = chalk.green.bold;

const customLevels = {
    error: 0,
    warning: 1,
    info: 2,
    success: 3
}

const timestampFormat = format.timestamp( {format: "YYYY-MM-DD HH:mm:ss"} );

const coloredOutputFormat = format.printf( ( log ) => {
    let color = infoColor;

    switch ( log.level ){
        case "error":
            color = errorColor;
            break;
        case "warning":
            color = warnColor;
            break;
        case "success":
            color = successColor;
            break;
    }

    // bold timestampFormat
    const timeLog = chalk.bold(  log['timestamp'] );

    return `[${timeLog}] ${color(log.message)}`
});

const consoleFormat = format.combine( timestampFormat, coloredOutputFormat );

const logger = createLogger({
    levels: customLevels,
    transports: [
        new transports.Console({
            level: "success",
            format: consoleFormat,
        })
    ],
});


const Logger = {
    error: ( message: string ) => logger.error( message ),
    warning: ( message: string ) => logger.warning( message ),
    info: ( message: string ) => logger.info( message ),
    success: ( message: string ) => logger.log( "success", message )
}

export default Logger;
