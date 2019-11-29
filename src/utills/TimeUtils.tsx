import moment from "jalali-moment";

class TimeUtils {
    static HOUR_FORMAT = 'H:mm:ss';
    static DATE_FORMAT = 'YYYY-MM-DD';

    static getDuration(startTs: number, endTs: number, format = TimeUtils.HOUR_FORMAT) {
        return moment.utc(endTs - startTs).format(format);
    }

    static getClockFormat(ts: number) {
        let date = moment(ts);
        return date.format(TimeUtils.HOUR_FORMAT);
    }

    static getDateFormat(ts: number, jalali = true) {
        let date = moment(ts);
        if (jalali)
            return date.locale('fa').format(TimeUtils.DATE_FORMAT);
        return date.format(TimeUtils.DATE_FORMAT);
    }
}

export default TimeUtils;