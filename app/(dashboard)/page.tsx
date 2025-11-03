import { HomePage } from "@/components/home/home-page"

import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Podcastr | Home",
  description: "Generate your educational podcast in just minutes!"
};

const App = async () => {
  return <HomePage />
}

export default App