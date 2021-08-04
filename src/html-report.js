import { extras } from './constants.js';

export default class HtmlReport {
  _createTableRow(item, attribute) {
    if (attribute === extras.PARTITION_KEY) {
      return `<tr class="partition-key"><td><b>${item.name}</b></td><td>${item.type}</td></tr>`
    }

    if (attribute === extras.CLUSTERING_KEY) {
      return `<tr class="clustering-key"><td><i>${item.name}</i></td><td>${item.type}</td></tr>`
    }

    return `<tr><td>${item.name}</td><td>${item.type}</td></tr>`
  }

  generate(metadata) {
    let body = '';

    Object.keys(metadata).forEach((keyspace) => {
      const tables = metadata[keyspace];

      body += `<h1>${keyspace}</h1>`;

      tables.forEach((table) => {
        let rows = '';

        table.partitionKeys.map((item) => {
          rows += this._createTableRow(item, extras.PARTITION_KEY);
        });

        table.clusteringKeys.map((item) => {
          rows += this._createTableRow(item, extras.CLUSTERING_KEY);
        });

        table.columns.map((item) => {
          rows += this._createTableRow(item);
        });

        body += `
        <table>
          <caption><h2>${table.tableName}</h2></caption>
          <tbody>
            ${rows}
          <tbody>
        </table>
        `;
      });
    });

    return `<!DOCTYPE html>
      <html>
        <head>
          <title></title>
          <style>
            table {
              border-collapse: collapse;
              border-spacing: 0;
              border: 1px solid #ddd;
              display: inline-table;
              margin-top: 0px;
              margin-right: 5px;
              margin-bottom: 5px;
              margin-left: 5px;
            }

            .partition-key {
              background-color: #ddd;
            }

            .clustering-key {
              background-color: #ddd;
            }
          </style>
        </head>
        <body>
          ${body}
        </body>
      </html>`;
  }
}