import * as z from "zod";

export const signUpFormSchema = z.object({
    fname:z.string()
    .min(3,{error:"First name is required"})
    .trim(),
    lname:z.string(),
    username:z.string()
    .min(8,{error:'user name should be 8 letters long'})
    .trim(),
    email:z.email({error:"pls enter valid email id"}),
    password:z.string()
    .min(8,{error:"password needs to be atleast 8 letters long"})
    .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
    .regex(/[0-9]/, { error: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      error: 'Contain at least one special character.',
    })
    .trim()
})