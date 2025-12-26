import { CreatePodcastForm } from "@/components/podcast/create-podcast-form"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Podcastr | Create Podcast Page",
  description: "Create your podcast"
};


const CreatePodcastPage = () => {

  return <CreatePodcastForm />
}

export default CreatePodcastPage