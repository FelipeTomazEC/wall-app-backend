interface Props {
  id: string;
  name: string;
  email: string;
}

export class User {
  constructor(private readonly props: Props) { }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }
}