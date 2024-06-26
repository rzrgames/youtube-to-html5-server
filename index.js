const ytdl = require('ytdl-core');
const http = require('http');
const url = require('url');
//const youtubeUrl = 'https://www.youtube.com/watch?v=P56RouFPdLk';
const hostname = "localhost";
const port = 3000;

const successCacheAge = 14400; // 4hrs
const errorCacheAge = 3600; // 1hrs

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
/**
 * Send response headers and data.
 *
 * @param {ServerResponse} response
 * @param {object} data
 */
function sendResponse(response, data) {
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Allow-Methods', 'GET');

	response.setHeader( 'Content-Type', 'application/json' );
	response.end(JSON.stringify(data));
}



/**
 * Send a successful response.
 *
 * @param {ServerResponse} response
 * @param {*} data
 */
function sendSuccess(response, data) {
	sendResponse(response, {
		success: true,
		data
	});
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

//create a server object:
http.createServer(function(request, response) {
	const queryObject = url.parse(request.url, true).query;

	const idParam = queryObject?.id;
	const urlParam = queryObject?.url;

	if (!idParam && !urlParam) {
		sendError(response, 'Missing `url` or `id` paramater.');
	} else {

		/**
		 * Build url from id or url param.
		 *
		 * @type {string}
		 */
		const youtubeUrl = idParam ? `https://www.youtube.com/watch?v=${idParam}` : urlParam;

	try {

				/**
				 * @link https://github.com/fent/node-ytdl-core
				 */
				ytdl.getInfo(youtubeUrl, ytdlOptions).then(data => {
						sendSuccess(response, data);
					//response.end(JSON.stringify(data));
				}).catch(error => {
				
					sendError(response, error);
				});

			} catch (error) {
				sendError(response, error);
			}
	}
  //response.write('Hello World!dd'); //write a response to the client
  //response.end(); //end the response
}).listen(8080)
