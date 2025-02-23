import { NextResponse } from "next/server"
import { WizardFormSchema } from "@/schema/WizardFormSchema"
import { currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { ZodError } from "zod"

export async function POST(request: Request) {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const validatedData = WizardFormSchema.parse(body)

    // Transform date string to Date object for Prisma
    const dateOfBirth = validatedData.dateOfBirth ? new Date(
      validatedData.dateOfBirth.split('/').reverse().join('-')
    ) : undefined

    const user = await prisma.user.create({
      data: {
        id: clerkUser.id,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        gender: validatedData.gender,
        phoneNumber: validatedData.phoneNumber,
        dateOfBirth: dateOfBirth,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 