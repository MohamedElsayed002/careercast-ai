"use client"

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "./ui/popover"
import { Button } from './ui/button'
// import { LuShare2 } from 'react-icons/lu';
import {
    TwitterShareButton,
    EmailShareButton,
    LinkedinShareButton,
    TwitterIcon,
    EmailIcon,
    LinkedinIcon,
} from 'react-share';
import { Share2 } from "lucide-react";

export const ShareButtons = ({ title, podcastId }: { title: string, podcastId: string }) => {


    const url = process.env.NEXT_PUBLIC_WEBSITE_URL
    const shareLink = `${url}/community/podcast/${podcastId}`

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant='outline' size='icon' className='p-2'>
                    <Share2 />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side='top'
                align='end'
                sideOffset={10}
                className='flex items-center gap-x-2 justify-center w-full'
            >
                <TwitterShareButton url={shareLink} title={title}>
                    <TwitterIcon size={32} round />
                </TwitterShareButton>
                <LinkedinShareButton url={shareLink} title={title}>
                    <LinkedinIcon size={32} round />
                </LinkedinShareButton>
                <EmailShareButton url={shareLink} subject={title}>
                    <EmailIcon size={32} round />
                </EmailShareButton>
            </PopoverContent>
        </Popover>
    )
}