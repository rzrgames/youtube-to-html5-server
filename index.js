const ytstream = require('yt-stream');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.listen(4000, () => {
    console.log('Server Works !!! At port 4000');
});






app.get('/download', (req,res) => {
	
(async () => {
    const stream = await ytstream.stream(`https://www.youtube.com/watch?v=JS64cOhHPWk`, {
        quality: 'high',
        type: 'audio',
        highWaterMark: 1048576 * 32,
        download: true
    });
    
    res.end(stream.url);
})();


});
