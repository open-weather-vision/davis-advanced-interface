var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CommandResponse, Record, WeatherStationInterface, setup } from "owvision-environment/interfaces";
import { WeatherStationAdvanced } from "vantjs/weather-station";
class AdvancedDavisInterface extends WeatherStationInterface {
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.station = yield WeatherStationAdvanced.connect({
                    path: this.config.serial_path,
                    rainCollectorSize: this.config.rain_collector_size,
                    baudRate: this.config.baud_rate,
                });
                this.realtime_container = this.station.createDetailedRealtimeDataContainer({
                    updateInterval: 1,
                });
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
    command(command, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return CommandResponse.unknownCommand(command);
        });
    }
    record(sensor_slug) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            if (sensor_slug === "temp-out") {
                return new Record(sensor_slug, (_b = (_a = this.realtime_container) === null || _a === void 0 ? void 0 : _a.tempOut) !== null && _b !== void 0 ? _b : null, (_d = (_c = this.station) === null || _c === void 0 ? void 0 : _c.settings.units.temperature) !== null && _d !== void 0 ? _d : "none");
            }
            return Record.nullRecord(sensor_slug);
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                (_a = this.station) === null || _a === void 0 ? void 0 : _a.disconnect();
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
}
setup(AdvancedDavisInterface);
