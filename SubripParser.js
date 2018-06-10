export default
class SubRipParser {

    parse (str) {

        const res = [];
        const subtitles = str.trim().replace(/\r/g, '').split(/\n\n/g);

        for (let i = 0, l = subtitles.length; i < l; i++) {

            const lines = subtitles[i].split(/\n/g);
            const index = parseInt(lines[0]);

            const [st, end] = lines[1].split(/-->/);
            const subtitle = lines[2];

            res.push({
                index,
                subtitle,
                start: this.subTimeToSec(st),
                end: this.subTimeToSec(end),
            });

        }

        return res.sort((a, b) => a.start - b.start);

    }

    subTimeToSec (time) {

        const [hr, min, sec, ms] = time.split(/:|,/g);
        return parseInt(hr) * 60 * 60 + parseInt(min) * 60 + parseInt(sec) + parseInt(ms) / 1000;

    }

}
