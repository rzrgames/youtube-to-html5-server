
const ytdl = require("ytdl-core");

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.listen(4000, () => {
    console.log('Server Works !!! At port 4000');
});



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
