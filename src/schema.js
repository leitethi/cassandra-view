import { Client } from 'cassandra-driver';
import { dataTypes } from './constants.js';

export default class CassandraSchema {
  constructor(options) {
    this.options = options;
  }

  async _connect() {
    this.client = new Client({
      contactPoints: this.options.hostnames.split(','),
      credentials: { password: this.options.password, username: this.options.username },
      keyspace: this.options.keyspace,
      localDataCenter: this.options.localdatacenter,
      refreshSchemaDelay: 0
    });

    await this.client.connect();
  }

  async _retrieveTables() {
    let query = 'SELECT * FROM system_schema.tables';

    if (this.options.keyspace) {
      query += ` WHERE keyspace_name='${this.options.keyspace}'`;
    }

    const result = await this.client.execute(query);

    return result.rows.map(row => ({ keyspace: row.keyspace_name, tableName: row.table_name}));
  }

  async _retrieveSchemaInfo() {
    const tables = await this._retrieveTables();

    const queries = tables
      .map(table => this.client.metadata.getTable(table.keyspace, table.tableName));

    await Promise.all(queries);
  }

  _createSchema(tables) {
    return Object.keys(tables).map((tableName) => {
      const table = tables[tableName];

      const partitionKeys = table.partitionKeys.map(col => ({
        name: col.name,
        type: dataTypes[col.type.code],
      }));

      const clusteringKeys = table.clusteringKeys.map(col => ({
        name: col.name,
        type: dataTypes[col.type.code],
      }));

      const columns = table.columns
      .filter(col => partitionKeys.map(key => key.name).includes(col.name) === false 
        && clusteringKeys.map(key => key.name).includes(col.name) === false)
      .map(col => ({
        name: col.name,
        type: dataTypes[col.type.code],
      }));

      return { clusteringKeys, columns, partitionKeys, tableName };
    });
  }

  async retrive() {
    await this._connect();

    await this._retrieveSchemaInfo();

    const keyspaces = this.client.metadata.keyspaces;

    const schema = Object.keys(keyspaces)
      .reduce((prev, curr) => {
        if (Object.keys(keyspaces[curr].tables).length === 0) return prev; 
        
        return { ...prev, [curr]: this._createSchema(keyspaces[curr].tables) };
      }, {});

    return schema;
  }
}