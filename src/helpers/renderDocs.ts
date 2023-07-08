import fs from 'fs';
import path from 'path';

import { Headers, Response } from '../types';
import { docs } from '../constants/docs';

export function renderDocs(headers: Headers, response: Response) {
  // const docFilePath = path.resolve(__dirname, '../assets/docs.html');

  // const isHtml = /\.html$/.test(docFilePath);
  const isHtml = true;

  headers['content-type'] = isHtml ? 'text/html' : 'text/plain';

  fs.readFile(docs, 'utf8', function (err, data) {
    if (err) {
      console.error(err);
      response.writeHead(500, headers);
      response.end();
    }

    response.end(data);
  });
}
