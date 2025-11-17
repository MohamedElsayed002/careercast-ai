import { headers } from "next/headers";
import {redirect } from 'next/navigation'
import { auth } from './auth'
import prisma from "./db";

export const requireAuth = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) {
        redirect('/sign-in')
    }

    return session
}

export const requireAdmin = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const user = await prisma.user.findUnique({
        where: { id: session?.user.id }
    })
    if(!session || user?.role !== 'ADMIN') {
        redirect('/')
    }
    return session
}


export const requireUnAuth = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(session) {
        redirect('/')
    }

    return session
}