import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  brokers: ['tops-monkfish-9913-eu1-kafka.upstash.io:9092'],
  sasl: {
    mechanism: 'scram-sha-256',
    username: 'dG9wcy1tb25rZmlzaC05OTEzJCst4IFawyi1hN1q36cr-pYHl4Atfo5uFTrlUHY',
    password: 'ZmY0MjMwN2YtN2IwOC00OTY0LWJiMjgtOWE0OGJmYzFiYzdm',
  },
  ssl: true,
});

export { kafka };
