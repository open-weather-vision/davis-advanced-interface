import { CommandResponse, Record, WeatherStationInterface, setup } from "owvision-environment/interfaces";
import { BaudRate, RainCollectorSize } from "vant-environment/structures";
import { WeatherStationAdvanced } from "vantjs/weather-station";
import { AdvancedRealtimeDataContainer } from "vantjs/realtime-containers";
import { waitForNewSerialConnection } from "vantjs/util";

export type Config = {
    // serial_path: string,
    baud_rate: BaudRate,
    rain_collector_size: RainCollectorSize,
}

class AdvancedDavisInterface extends WeatherStationInterface<Config>{
    private station?: WeatherStationAdvanced;
    private realtime_container?: AdvancedRealtimeDataContainer;
    config: Config = {
        baud_rate: 19200,
        rain_collector_size: "0.1mm"
    }

    async connect() {
        // const serial_path = await waitForNewSerialConnection();
        this.station = await WeatherStationAdvanced.connect({
            path: "/dev/ttyUSB0",
            rainCollectorSize: this.config.rain_collector_size,
            baudRate: this.config.baud_rate,
        });
        this.realtime_container = this.station.createDetailedRealtimeDataContainer({
            updateInterval: 1,
        });
    }

    async command(command: string, params: any[]): Promise<CommandResponse> {
        return CommandResponse.unknownCommand(command);
    }

    async record(sensor_slug: string): Promise<Record> {
        if(sensor_slug === "temp-out"){
            return new Record(sensor_slug, this.realtime_container?.tempOut ?? null, this.station?.settings.units.temperature ?? "none");
        }
        return Record.nullRecord(sensor_slug);
    }

    async disconnect() {
        this.station?.disconnect();
    }
}

setup(AdvancedDavisInterface);