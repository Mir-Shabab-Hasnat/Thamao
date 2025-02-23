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
    .refine((date) => {
      // Check format
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return false;
      
      // Parse date parts
      const [day, month, year] = date.split('/').map(Number);
      
      // Check if date is valid
      const dateObj = new Date(year, month - 1, day);
      return dateObj.getDate() === day && 
             dateObj.getMonth() === month - 1 && 
             dateObj.getFullYear() === year;
    }, "Please enter a valid date in DD/MM/YYYY format")
    .optional(),
})

export type WizardFormValues = z.infer<typeof WizardFormSchema>
