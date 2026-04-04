import { Facebook, Linkedin, X } from "lucide-react"



export const Footer = () => {
    return (
        <footer className='border-t border-t-gray-400 p-10 container mx-auto flex flex-col gap-5 md:flex-row justify-between'>
            <p>&copy; 2026 CareerCast AI. All rights reserved</p>
            <div className='flex gap-5'>
                <Facebook/>
                <X/>
                <Linkedin/>
            </div>
        </footer>
    )
}