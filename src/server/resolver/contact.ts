import { Arg, Ctx, ID, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import ContactData from "../entity/ContactData";
import { ContactInput } from "../inputTypes/ContactTypes";
import isAuth from "../middleware/auth";
import ContactService from "../services/contactService";
import { MyContext } from "../types";

@Resolver()
class ContactResolver {
  constructor(private contactService: ContactService = new ContactService()){}

  @Mutation(()=> Boolean)
  async sendEmail(@Arg('input') input: ContactInput): Promise<boolean>{
    return this.contactService.sendEmail(input);
  }

  @Query(() => [ContactData])
  async getData() {
    return this.contactService.getContactData();
  }

  @Mutation(() => ContactData)
  @UseMiddleware(isAuth)
  async updateData(
    @Arg('id', () => ID) id: string,
    @Arg('value') value: string,
    @Ctx() { req }: MyContext) {
    return this.contactService.updateData(req.userId, id, value);
  }
}

export default ContactResolver;