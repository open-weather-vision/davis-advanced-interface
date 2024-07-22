import { CommandResponse, Record, WeatherStationInterface, setup, Argument } from "owvision-environment/interfaces";
import { BaudRate, BaudRates, RainCollectorSize, RainCollectorSizes } from "vant-environment/structures";
import { WeatherStationAdvanced } from "vantjs/weather-station";
import { AdvancedRealtimeDataContainer } from "vantjs/realtime-containers";
import { waitForNewSerialConnection } from "vantjs/util";

export type Config = {
    serial_path: Argument<string>,
    baud_rate: Argument<BaudRate>,
    rain_collector_size: Argument<RainCollectorSize>,
}

class AdvancedDavisInterface extends WeatherStationInterface<Config>{
    private station?: WeatherStationAdvanced;
    private realtime_container?: AdvancedRealtimeDataContainer;

    async connect() {
        // const serial_path = await waitForNewSerialConnection();
        this.station = await WeatherStationAdvanced.connect({
            path: this.config.serial_path.value,
            rainCollectorSize: this.config.rain_collector_size.value,
            baudRate: this.config.baud_rate.value,
        });
        this.realtime_container = this.station.createDetailedRealtimeDataContainer({
            updateInterval: 1,
        });
    }

    async command(command: string, params: any[]): Promise<CommandResponse> {
        return CommandResponse.unknown_command(command);
    }

    async record(sensor_slug: string): Promise<Record> {
        if(sensor_slug === "temp-out"){
            return new Record(sensor_slug, this.realtime_container?.tempOut ?? null, this.station?.settings.units.temperature ?? "none");
        }
        return Record.null_record(sensor_slug);
    }

    async disconnect() {
        this.station?.disconnect();
    }
}

setup(AdvancedDavisInterface);