import {
    CommandResponse,
    Record,
    WeatherStationInterface,
    setup,
    Argument,
} from "owvision-environment/interfaces";
import {
    BaudRate,
    BaudRates,
    RainCollectorSize,
    RainCollectorSizes,
} from "vant-environment/structures";
import { WeatherStationAdvanced } from "vantjs/weather-station";
import { AdvancedRealtimeDataContainer } from "vantjs/realtime-containers";
import { waitForNewSerialConnection } from "vantjs/util";

export type Config = {
    serial_path: Argument<string>;
    baud_rate: Argument<BaudRate>;
    rain_collector_size: Argument<RainCollectorSize>;
};

class AdvancedDavisInterface extends WeatherStationInterface<Config> {
    private station?: WeatherStationAdvanced;
    private realtime_container?: AdvancedRealtimeDataContainer;

    async connect() {
        // const serial_path = await waitForNewSerialConnection();
        this.station = await WeatherStationAdvanced.connect({
            path: this.config.serial_path.value,
            rainCollectorSize: this.config.rain_collector_size.value,
            baudRate: this.config.baud_rate.value,
        });
        this.realtime_container =
            this.station.createDetailedRealtimeDataContainer({
                updateInterval: 1,
            });
    }

    async command(command: string, params: any[]): Promise<CommandResponse> {
        return CommandResponse.unknown_command(command);
    }

    async record(sensor_slug: string): Promise<Record> {
        let regex_matches: RegExpMatchArray | null;
        if (sensor_slug === "temp-out") {
            return new Record(
                sensor_slug,
                this.realtime_container?.tempOut ?? null,
                this.station?.settings.units.temperature ?? "none"
            );
        } else if (sensor_slug === "temp-in") {
            return new Record(
                sensor_slug,
                this.realtime_container?.tempIn ?? null,
                this.station?.settings.units.temperature ?? "none"
            );
        } else if (sensor_slug === "hum-out") {
            return new Record(
                sensor_slug,
                this.realtime_container?.humOut ?? null,
                this.station?.settings.units.humidity ?? "none"
            );
        } else if (sensor_slug === "hum-in") {
            return new Record(
                sensor_slug,
                this.realtime_container?.humIn ?? null,
                this.station?.settings.units.humidity ?? "none"
            );
        } else if (
            (regex_matches = sensor_slug.match(/^temp-extra-([1-7]*)$/))
        ) {
            const number = Number.parseInt(regex_matches[1]);
            return new Record(
                sensor_slug,
                this.realtime_container?.tempExtra[number - 1] ?? null,
                this.station?.settings.units.temperature ?? "none"
            );
        } else if (
            (regex_matches = sensor_slug.match(/^hum-extra-([1-7]*)$/))
        ) {
            const number = Number.parseInt(regex_matches[1]);
            return new Record(
                sensor_slug,
                this.realtime_container?.humExtra[number - 1] ?? null,
                this.station?.settings.units.humidity ?? "none"
            );
        } else if (sensor_slug === "precipation") {
            return new Record(
                sensor_slug,
                this.realtime_container?.rain15m ?? null,
                this.station?.settings.units.rain ?? "none"
            );
        } else if (sensor_slug === "wind") {
            return new Record(
                sensor_slug,
                this.realtime_container?.wind ?? null,
                this.station?.settings.units.wind ?? "none"
            );
        } else if (sensor_slug === "wind-dir") {
            return new Record(
                sensor_slug,
                this.realtime_container?.windDirDeg ?? null,
                "none"
            );
        } else if (sensor_slug === "wind-gust") {
            return new Record(
                sensor_slug,
                this.realtime_container?.windGust ?? null,
                this.station?.settings.units.wind ?? "none"
            );
        } else if (sensor_slug === "wind-gust-dir") {
            return new Record(
                sensor_slug,
                this.realtime_container?.windGustDirDeg ?? null,
                "none"
            );
        } else if (sensor_slug === "wind-avg-2min") {
            return new Record(
                sensor_slug,
                this.realtime_container?.windAvg2m ?? null,
                this.station?.settings.units.wind ?? "none"
            );
        } else if (sensor_slug === "wind-avg-10min") {
            return new Record(
                sensor_slug,
                this.realtime_container?.windAvg10m ?? null,
                this.station?.settings.units.wind ?? "none"
            );
        } else if (sensor_slug === "chill") {
            return new Record(
                sensor_slug,
                this.realtime_container?.chill ?? null,
                this.station?.settings.units.temperature ?? "none"
            );
        } else if (sensor_slug === "thsw-index") {
            return new Record(
                sensor_slug,
                this.realtime_container?.thsw ?? null,
                this.station?.settings.units.temperature ?? "none"
            );
        } else if (sensor_slug === "heat-index") {
            return new Record(
                sensor_slug,
                this.realtime_container?.heat ?? null,
                this.station?.settings.units.temperature ?? "none"
            );
        } else if (sensor_slug === "dewpoint") {
            return new Record(
                sensor_slug,
                this.realtime_container?.dew ?? null,
                this.station?.settings.units.temperature ?? "none"
            );
        } else if (sensor_slug === "pressure") {
            return new Record(
                sensor_slug,
                this.realtime_container?.press ?? null,
                this.station?.settings.units.pressure ?? "none"
            );
        } else if (sensor_slug === "evapotranspiration") {
            return new Record(
                sensor_slug,
                this.realtime_container?.etDay ?? null,
                this.station?.settings.units.evoTranspiration ?? "none"
            );
        } else if (sensor_slug === "solar-radiation") {
            return new Record(
                sensor_slug,
                this.realtime_container?.solarRadiation ?? null,
                this.station?.settings.units.solarRadiation ?? "none"
            );
        } else if (sensor_slug === "uv-index") {
            return new Record(
                sensor_slug,
                this.realtime_container?.uv ?? null,
                "none"
            );
        } else if (
            (regex_matches = sensor_slug.match(/^soil-moisture-([1-4]*)$/))
        ) {
            const number = Number.parseInt(regex_matches[1]);
            return new Record(
                sensor_slug,
                this.realtime_container?.soilMoistures[number - 1] ?? null,
                this.station?.settings.units.soilMoisture ?? "none"
            );
        } else if (
            (regex_matches = sensor_slug.match(/^leaf-temperature-([1-4]*)$/))
        ) {
            const number = Number.parseInt(regex_matches[1]);
            return new Record(
                sensor_slug,
                this.realtime_container?.leafTemps[number - 1] ?? null,
                this.station?.settings.units.leafTemperature ?? "none"
            );
        } else if (
            (regex_matches = sensor_slug.match(/^leaf-wetness-([1-4]*)$/))
        ) {
            const number = Number.parseInt(regex_matches[1]);
            return new Record(
                sensor_slug,
                this.realtime_container?.leafWetnesses[number - 1] ?? null,
                "none"
            );
        } else if (
            (regex_matches = sensor_slug.match(/^soil-temperature-([1-4]*)$/))
        ) {
            const number = Number.parseInt(regex_matches[1]);
            return new Record(
                sensor_slug,
                this.realtime_container?.soilTemps[number - 1] ?? null,
                this.station?.settings.units.soilTemperature ?? "none"
            );
        }
        return Record.null_record(sensor_slug);
    }

    async disconnect() {
        this.station?.disconnect();
    }
}

setup(AdvancedDavisInterface);
