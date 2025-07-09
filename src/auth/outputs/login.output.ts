import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginOutput {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  role: string;

  @Field()
  token: string;

  @Field()
  expiresIn: number;
}
