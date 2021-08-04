import fs from 'fs';
import CassandraSchema from './schema.js';
import Report from './html-report.js';

export default class CassandraView {
  async generate(options) {
    const {
      hostnames,
      password,
      username,
      keyspace,
      localdatacenter,
      output
    } = options;

    const schema = new CassandraSchema({
      hostnames,
      password,
      username,
      keyspace,
      localdatacenter,
    });

    const metadata = await schema.retrive();

    const html = new Report().generate(metadata);

    await fs.writeFileSync(output, html);
  }
}