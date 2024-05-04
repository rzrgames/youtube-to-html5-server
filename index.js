const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const fs = require('fs');
const app = express();
app.use(cors());


// Remove 'user:pass@' if you don't need to authenticate to your proxy.





const ytdlOptions = {
    requestOptions: {
        maxRetries: 5,
        backoff: {inc: 2000, max: 2000},
        transform: (parsed) => {
            const originURL = parsed.protocol + "//" + parsed.hostname + parsed.path;
            parsed.host = "proxy.darenliang.com";
            parsed.hostname = "proxy.darenliang.com";
            parsed.path = "/?url=" + encodeURIComponent(originURL);
            parsed.protocol = "https:";
            return parsed;
        }
    }
};

const getInfo = async url => {
    console.log("[info] getting info");
    return await ytdl.getInfo(url, ytdlOptions);
};





function sendResponse(response, data) {
	response.end(JSON.stringify(data));
}


/**
 * Send a failed response.
 *
 * @param {ServerResponse} response
 * @param {*} data
 */
function sendError(response, data) {
	sendResponse(response, {
		success: false,
		data
	});
}


app.get('/', (req,res) => {
    var URL = req.query.URL;
  
	try {
const info = getInfo(URL);
				//res.end(JSON.stringify(ytdl.getInfo(URL, ytdlOptions)));
				
				const iTag = 134;
				const video = ytdl(URL, {
  filter: function (format) {
    return format.itag === iTag;
  },
});
				
				
//res.end(JSON.stringify(video));

					ytdl.getInfo(URL).then(data => {
					
					res.end(JSON.stringify(data));
				}).catch(error => {
				
					sendError(res, error);
				});

			} catch (error) {
				sendError(res, error);
			}

});

app.listen(4000, () => {
    console.log('Server Works !!! At port 4000');
});
