let timers = [];

export class Timer {
    static wait(id, fn, delay, context, args) {
        window.clearTimeout(timers[id]);

        timers[id] = window.setTimeout(() => {
            fn.apply(context, args);
            delete timers[id];
        }, delay);
    }

    static loop(fn, fps, context, args) {
        let running,
        fpsInterval = 1000 / fps,
        then        = window.performance.now();

        function animate(newTime) {
            // stop the loop if render returned false
            if (running !== false) {
                window.requestAnimationFrame(animate);

                let now = newTime,
                delta   = now - then;

                if (delta > fpsInterval) {
                    then    = now - (delta % fpsInterval);
                    running = fn.apply(context, args);
                }
            }
        }

        animate();
    }
}