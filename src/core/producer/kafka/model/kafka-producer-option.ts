export class KafkaProducerOption {
  constructor(
    public kafkaHost: string,
    public topic: string,
    public groupId: string,
    public registryHost: string,
    public username?: string,
    public password?: string
  ) {}
}
