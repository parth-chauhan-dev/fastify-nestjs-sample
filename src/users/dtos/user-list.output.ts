import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserListOutput {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  role: string;
}
