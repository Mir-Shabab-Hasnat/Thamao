import { auth } from "@clerk/nextjs"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { WizardFormSchema } from "@/schema/WizardFormSchema"

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const validatedData = WizardFormSchema.parse(body)

    const user = await prisma.user.create({
      data: {
        id: userId,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        gender: validatedData.gender,
        phoneNumber: validatedData.phoneNumber,
        dateOfBirth: validatedData.dateOfBirth,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 