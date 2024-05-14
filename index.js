
const ytdl = require("ytdl-core");
const remote = require('remote-file-size');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.listen(4000, () => {
    console.log('Server Works !!! At port 4000');
});


var url = 'https://your-worker.jdsjeo.workers.dev/?url=https%3A%2F%2Frr5---sn-npoeenl7.googlevideo.com%2Fvideoplayback%3Fexpire%3D1715733882%26ei%3DGrFDZs_5Bo-8z7sPnM6z0A8%26ip%3D162.158.106.217%26id%3Do-AGg7qwjWoCikLkV4Yq420Wr_ybjkbHMH6-ylk54MX7EL%26itag%3D251%26source%3Dyoutube%26requiressl%3Dyes%26xpc%3DEgVo2aDSNQ%253D%253D%26mh%3Du_%26mm%3D31%252C29%26mn%3Dsn-npoeenl7%252Csn-npoe7nl6%26ms%3Dau%252Crdu%26mv%3Dm%26mvi%3D5%26pl%3D24%26gcr%3Dsg%26initcwndbps%3D483750%26bui%3DAWRWj2TiKT0Qc812GDajv6JPoIrkSot4Yjpt_dTUuMXXmS5QvQPpOvJfoqErKCoAHeiZ9VT_PKa_2mhC%26spc%3DUWF9f5j7njvrJNdfE0jb-nNQvuFaPfnbtDqN4MtlkIH4VYs8ztBf19A%26vprv%3D1%26svpuc%3D1%26mime%3Daudio%252Fwebm%26ns%3DlypfvZWuQkTC0OVYM7Ypm4gQ%26rqh%3D1%26gir%3Dyes%26clen%3D83314889%26dur%3D5129.001%26lmt%3D1698930238670590%26mt%3D1715711877%26fvip%3D4%26keepalive%3Dyes%26c%3DWEB%26sefc%3D1%26txp%3D5532434%26n%3D7y9Sv-EkwfbejQ%26sparams%3Dexpire%252Cei%252Cip%252Cid%252Citag%252Csource%252Crequiressl%252Cxpc%252Cgcr%252Cbui%252Cspc%252Cvprv%252Csvpuc%252Cmime%252Cns%252Crqh%252Cgir%252Cclen%252Cdur%252Clmt%26lsparams%3Dmh%252Cmm%252Cmn%252Cms%252Cmv%252Cmvi%252Cpl%252Cinitcwndbps%26lsig%3DAHWaYeowRQIhALyJDFxQ2ZScYxXz8uyWVfFNAwYIEZtvufqgvey7ZYgkAiBwkuaslv3h-cH_FLekunwDQ0pRDlOdvvWRFMJjY2x--g%253D%253D%26sig%3DAJfQdSswRAIgfHqPp0OOspRme4V7blCK4TVe7NvuUC9gHS4OflgRziwCIGuB3Leq4OtZJ7Oy86-DsupWesLilRYzOu36q9ITPVdy';


const proxy = url => {
    return "https://your-worker.jdsjeo.workers.dev/?url=" + encodeURIComponent(url);
};

const ytdlOptions = {
    requestOptions: {
        maxRetries: 5,
        backoff: {inc: 2000, max: 2000},
        transform: (parsed) => {
            const originURL = parsed.protocol + "//" + parsed.hostname + parsed.path;
            parsed.host = "your-worker.jdsjeo.workers.dev";
            parsed.hostname = "your-worker.jdsjeo.workers.dev";
             parsed.path = "/?url=" + encodeURIComponent(originURL);
            parsed.protocol = "https:";
            return parsed;
        }
    }
};




const getAudioBuffer = async audioInfo => {


    console.log("[info] fetching data");
    //const audioData = await fetchFile(proxy(audioInfo.url));

    
    return proxy(audioInfo.url);
};



const getInfo = async url => {
    console.log("[info] getting info");
    return await ytdl.getInfo(url, ytdlOptions);
};
const getBestAudioBuffer = async url => {
    const info = await getInfo(url);

    console.log("[info] choosing format");
    const audioInfo = ytdl.chooseFormat(info.formats, {
        quality: "highestaudio",
        filter: "audioonly"
    });

    return await getAudioBuffer(audioInfo);
};
	
	
	

app.get('/size', (req,res) => {
	remote(url, function(err, o) {
  res.end(o)
  // => 1548
});

});


app.get('/download', (req,res) => {
	
 //(async () => {
      //  const buffer = await getBestAudioBuffer("https://www.youtube.com/watch?v=zTLsKqQ77qE");
       // res.end(proxy(buffer.url));
   // })();
(async () => {
        const buffer = await getBestAudioBuffer("https://www.youtube.com/watch?v=JS64cOhHPWk");
       res.end(buffer);
    })();
});
