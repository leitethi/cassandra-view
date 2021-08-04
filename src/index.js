import { Command } from 'commander/esm.mjs';

import View from './view.js';

const program = new Command();

program
  .requiredOption('-h, --hostnames <hostnames>', 'comma separated contact points')
  .requiredOption('-u, --username <username>', 'username to connect')
  .requiredOption('-p, --password <password>', 'password to connect')
  .requiredOption('-l, --localdatacenter <localdatacenter>', 'default local datacenter to use')
  .option('-o, --output <output>', 'output html file to save', 'report.html')
  .option('-k, --keyspace <keyspace>', 'keyspace to use if not specified it will show all keyspaces');

program.parse();

const options = program.opts();

new View().generate(options)
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);

    process.exit(1);
  })