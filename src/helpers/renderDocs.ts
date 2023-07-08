import fs from 'fs';

import { Headers, Response } from '../types';

export function renderDocs(headers: Headers, response: Response) {
  const docFilePath = __dirname + '/assets/docs.html';

  const isHtml = /\.html$/.test(docFilePath);

  headers['content-type'] = isHtml ? 'text/html' : 'text/plain';

  fs.readFile(docFilePath, 'utf8', function (err, data) {
    if (err) {
      console.error(err);
      response.writeHead(500, headers);
      response.end();
    }

    response.end(data);
  });
}
