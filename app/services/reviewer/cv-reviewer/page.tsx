import { CVReviewer } from "@/components/cv-reviwer"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Reviewer | Review",
  description: "Review Page!"
};


const CVReviwerPage = () => {
    return (

            <CVReviewer/>
    )
}

export default CVReviwerPage