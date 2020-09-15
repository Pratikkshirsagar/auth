import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";

export default class AuthController {
  public async register({ request }: HttpContextContract) {
    try {
      const validationSchema = schema.create({
        email: schema.string({ trim: true }, [
          rules.email(),
          rules.maxLength(255),
          rules.unique({ table: "users", column: "email" }),
        ]),
        password: schema.string({ trim: true }),
      });
      const validatedData = await request.validate({
        schema: validationSchema,
      });

      console.log(validatedData);

      const user = await User.create(validatedData);
      return user.toJSON();
    } catch (error) {
      console.log(error);
    }
  }

  public async login({ request, auth }: HttpContextContract) {
    try {
      const body = request.post();

      const email = body.email;
      const password = body.password;

      console.log(email, password);

      const token = await auth.use("api").attempt(email, password);

      return token.toJSON();
    } catch (error) {
      console.log(error);
    }
  }
}
