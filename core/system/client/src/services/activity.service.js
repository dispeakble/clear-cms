class ActivityService {

    intervalId = null;
    #intervalMs = 1000 * 60;
    intervalMs = 1000 * 5;

    state = {
        mouseMoved: 0,
        mouseClicked: 0,
        keyboardTyped: 0,
        focused: 0,
    };

    mapState = {
        mm: "mouseMoved",
        mc: "mouseClicked",
        kt: "keyboardTyped",
        f: "focused"
    };

    data = [];

    ls_key = "act_";

    start() {

        this.addListeners();

        let date = new Date();

        const date_m = date.getMonth() + 1;
        const date_d = date.getDate();
        this.intervalId = setInterval(() => {

            let payload = localStorage.getItem(`${this.ls_key}_${date_m}_${date_d}`) || {};

            if("string" === typeof payload) {
                try {
                    payload = JSON.parse(payload);
                } catch (err) {
                    console.log(err);
                    this.stop();
                }

            }

            date = new Date();

            const hour = date.getHours();
            const minute = date.getMinutes();

            let hourData = {};

            if(Object.hasOwn(payload, String(hour))) {
                hourData = payload[String(hour)];
            }

            const mapped = new Map(Object.keys(this.mapState).map((k) => {

                if(hourData[String(minute)] && Object.hasOwn(hourData[String(minute)], k)) {
                    return [k, hourData[String(minute)][k] + this.state[this.mapState[k]]];
                } else {
                    return [k, this.state[this.mapState[k]]];
                }

            }));

            hourData[`${String(minute)}`] = Object.fromEntries(mapped);

            payload[hour] = hourData;

            localStorage.setItem(`${this.ls_key}_${date_m}_${date_d}`, JSON.stringify(payload));

            this.resetStates();
        }, this.intervalMs);
    }

    stop() {
        clearInterval(this.intervalId);
    }

    addListeners() {
        window.onmousedown = () => {
            this.state.mouseClicked++;
        }

        window.onmousemove = () => {
            this.state.mouseMoved = 1;
        }

        window.onkeydown = () => {
            this.state.keyboardTyped++;
        }

        window.onfocus = () => {
            this.state.focused++;
        }
    }

    resetStates() {
        Object.keys(this.mapState).find(key => {
            this.state[this.mapState[key]] = 0;
            return false;
        });
    }


}

export default ActivityService;