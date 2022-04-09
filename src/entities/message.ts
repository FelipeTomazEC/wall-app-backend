type Props = {
  id: string;
  text: string;
  userId: string;
  username: string;
  postedAt: Date;
}

export class Message {
  constructor(private readonly props: Props) {}

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get postedAt(): Date {
    return this.props.postedAt;
  }

  get text(): string {
    return this.props.text;
  }
}