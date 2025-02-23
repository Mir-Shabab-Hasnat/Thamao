import { z } from "zod"

export const WizardFormSchema = z.object({
  // Step 1 fields
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  
  // Step 2 fields
  gender: z.enum(["MALE", "FEMALE"], {
    required_error: "Please select a gender",
  }),
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 characters")
    .optional(),
  dateOfBirth: z.string()
    .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/, "Date must be in DD/MM/YYYY format")
    .transform((date) => {
      const [day, month, year] = date.split('/')
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    })
    .optional(),
})

export type WizardFormValues = z.infer<typeof WizardFormSchema>
