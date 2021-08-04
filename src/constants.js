const dataTypes = {
  0: 'custom',
  1: 'ascii',
  2: 'bigint',
  3: 'blob',
  4: 'boolean',
  5: 'counter',
  6: 'decimal',
  7: 'double',
  8: 'float',
  9: 'int',
  10: 'text',
  11: 'timestamp',
  12: 'uuid',
  13: 'varchar',
  14: 'varint',
  15: 'timeuuid',
  16: 'inet',
  17: 'date',
  18: 'time',
  19: 'smallint',
  20: 'tinyint',
  21: 'duration',
  22: 'list',
  23: 'map',
  24: 'set',
  25: 'udt',
  26: 'tuple',
}

const extras = {
  CLUSTERING_KEY: 'CLUSTERING_KEY',
  FROZEN: 'FROZEN',
  PRIMARY_KEY: 'PRIMARY_KEY',
  PARTITION_KEY: 'PARTITION_KEY',
};

export { extras, dataTypes };
