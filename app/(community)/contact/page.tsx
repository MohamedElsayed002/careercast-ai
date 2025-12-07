import { ContactForm } from "@/components/contact-form"
import { Facebook, Instagram, Linkedin, LocateIcon, Mail, Phone } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "CareerCast AI | Contact",
  description: "Contact with us"
};



const Page = () => {
    return (
        <div className='my-10'>
            <div className='space-y-6 text-center  max-w-4xl mx-auto'>
                <h1 className='text-3xl md:text-6xl font-bold'>
                    Contact Us
                </h1>
                <p className='text-gray-400 text-xl px-6'>
                    We&apos;re here to help and answer any question you might have. We look forward
                    to hearing from you.
                </p>
            </div>

            <div className='container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 mt-20'>
                <ContactForm/>
                <div>
                    <div className='space-y-6'>
                        <h1 className='text-2xl md:text-4xl font-bold'>Contact Information</h1>
                        <div className='flex gap-4'>
                            <Mail className='size-8 mr-3 text-indigo-600' />
                            <div className='flex flex-col'>
                                <h1 className='text-xl font-semibold md:text-2xl'>Email Us</h1>
                                <h2 className='text-gray-400'>Our support team will get back to you within 24 hours.</h2>
                                <span className='text-indigo-600 font-bold'>mohammedelsayed002@gmail.com</span>
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <Phone className='size-8 mr-3 text-indigo-600' />
                            <div className='flex flex-col'>
                                <h1 className='text-xl font-semibold md:text-2xl'>Call Us</h1>
                                <h2 className='text-gray-400'>Sat-Thu from 9am to 5pm.</h2>
                                <span className='text-indigo-600 font-bold'>+201093588197</span>
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <LocateIcon className='size-8 mr-3 text-indigo-600' />
                            <div className='flex flex-col'>
                                <h1 className='text-xl font-semibold md:text-2xl'>Our Office</h1>
                                <h2 className='text-gray-400'>Alexandria, Egypt</h2>
                            </div>
                        </div>
                        <div className='mt-10'>
                            <h1 className='text-xl md:text-2xl font-semibold mb-2'>Follow Us</h1>
                            <ul className='flex gap-4'>
                                <li>
                                    <Facebook/>
                                </li>
                                <li>
                                    <Linkedin/>
                                </li>
                                <li>
                                    <Instagram/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page