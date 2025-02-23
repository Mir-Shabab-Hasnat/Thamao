'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { WizardFormSchema, type WizardFormValues } from "@/schema/WizardFormSchema"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { countryCodes } from "@/lib/codes"
import type { CountryCode } from "@/lib/types"

const WizardForm = () => {
  const [step, setStep] = useState(1)
  const router = useRouter()
  const { user } = useUser()
  
  const form = useForm<WizardFormValues>({
    resolver: zodResolver(WizardFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.emailAddresses[0]?.emailAddress || "",
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: WizardFormValues) => {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to create user");
      }
      
      return response.json()
    },
    onSuccess: () => {
      toast.success("Profile created successfully!")
      router.push("/dashboard")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.")
      console.error("Error creating profile:", error)
    },
  })

  const onSubmit = (data: WizardFormValues) => {
    mutation.mutate(data)
  }

  const steps = [
    { number: 1, title: "Personal Information" },
    { number: 2, title: "Additional Information" }
  ]

  return (
    <div className="flex gap-8 max-w-4xl mx-auto">
      {/* Steps Column */}
      <div className="w-64 pt-8">
        <div className="flex flex-col gap-4">
          {steps.map((stepItem) => (
            <div key={stepItem.number} className="flex items-center gap-4">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                  step > stepItem.number 
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : step === stepItem.number
                    ? "border-emerald-500 text-emerald-500"
                    : "border-gray-300 text-gray-300"
                )}
              >
                {step > stepItem.number ? (
                  <Check className="h-4 w-4" />
                ) : (
                  stepItem.number
                )}
              </div>
              <span 
                className={cn(
                  "text-sm font-medium",
                  step >= stepItem.number ? "text-emerald-500" : "text-gray-300"
                )}
              >
                {stepItem.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>
            {step === 1 ? "Personal Information" : "Additional Information"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full"
                  >
                    Next
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Select
                              onValueChange={(value) => {
                                const phoneNumber = field.value?.split(' ')[1] || '';
                                field.onChange(phoneNumber ? `${value} ${phoneNumber}` : value);
                              }}
                              value={field.value?.split(' ')[0] || ''}
                            >
                              <FormControl>
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue placeholder="Code" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-[300px]">
                                {countryCodes.map((country) => (
                                  <SelectItem key={country.name} value={country.dial_code}>
                                    <span className="flex items-center gap-2">
                                      <span>{country.name}</span>
                                      <span>{country.dial_code}</span>
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input 
                              placeholder="Enter phone number" 
                              className="flex-1"
                              onChange={(e) => {
                                const countryCode = field.value?.split(' ')[0] || '';
                                const phoneNumber = e.target.value.replace(/\D/g, '');
                                field.onChange(phoneNumber ? `${countryCode} ${phoneNumber}` : countryCode);
                              }}
                              value={field.value?.split(' ')[1] || ''}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^\d{0,2}(\/\d{0,2}(\/\d{0,4})?)?$/.test(value)) {
                                field.onChange(value);
                              }
                            }}
                            type="text"
                            placeholder="DD/MM/YYYY" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="w-full"
                    >
                      Previous
                    </Button>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "Creating..." : "Submit"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default WizardForm