import { getSession } from "@/utils/server";
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing()

const auth = async () => {
    const data = await getSession();   // <- await!
    return data?.user
}


// FileRouter for your app, can contain multiple FileRoutes 
export const ourFileRouter = {
    imageUpload: f({
        image: {
            maxFileSize: '4MB',
            maxFileCount: 1
        },
    })
        // Set Permissions and file types for this FileRoute 
        .middleware(async () => {
            const user = await auth()

            if (!user) throw new UploadThingError('Unauthorized')

            return { user }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code runs on your server after upload 
            console.log('Upload complete for userId:', metadata.user.id)

            console.log('file url', file.ufsUrl)

            return { uploadedBy: metadata.user.id }
        }),

    audioUpload: f({
        audio: {
            maxFileSize: '16MB',
            maxFileCount: 2
        }
    })
        .middleware(async () => {
            const user = await auth()
            if (!user) throw new UploadThingError("Unauthorized")
            return { userId: user.id }
        })
        .onUploadComplete(async ({ metadata }) => {
            return { uploadedBy: metadata.userId}
        }),
    pdfUpload: f({
        pdf: {
            maxFileSize: '16MB',
            maxFileCount: 1
        }
    })
        .middleware(async () => {
            const user = await auth()
            if (!user) throw new UploadThingError("Unauthorized")
            return { userId: user.id }
        })
        .onUploadComplete(async ({ metadata }) => {
            console.log('Audio uploaded by', metadata)
            return { uploadedBy: metadata.userId }
        })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter