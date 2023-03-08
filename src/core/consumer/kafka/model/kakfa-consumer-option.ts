export class KafkaConsumerOption {
  constructor(
    public kafkaHost: string,
    public topic: string,
    public groupId: string,
    public username?: string,
    public password?: string
  ) {}
}
