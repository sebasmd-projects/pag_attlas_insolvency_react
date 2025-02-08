import { getDictionary } from "../../../dictionaries/dictionaries";
import EducationSection from "./sections/education";
import HeroSection from "./sections/hero";


export async function generateMetadata({ params }) {
  const lang = params?.lang ?? "es";
  const dict = await getDictionary(lang);

  const meta_data = dict.translations.home.meta;

  return {
    applicationName: meta_data.applicationName,
    authors: meta_data.authors,
    title: meta_data.pageTitle,
    description: meta_data.metaDescription,
    keywords: meta_data.metaKeywords.join(", "),
    icons: meta_data.icons,
    manifest: meta_data.manifest,
    openGraph: {
      type: "website",
      title: meta_data.metaOpenGraph.title,
      description: meta_data.metaOpenGraph.description,
      url: meta_data.metaOpenGraph.url,
      siteName: meta_data.metaOpenGraph.siteName,
      images: meta_data.metaOpenGraph.images.map(img => ({
        url: img.url,
        width: img.width,
        height: img.height,
        alt: img.alt
      })),
    },
    twitter: {
      card: "summary",
      title: meta_data.metaTwitter.title,
      description: meta_data.metaTwitter.description,
      images: meta_data.metaTwitter.images,
    },
    robots: meta_data.metaRobots,
  };
}

export default async function HomePage({ params }) {
  const lang = params?.lang ?? "es";
  const dict = await getDictionary(lang);

  return (
    <>
      <HeroSection dict={dict} />
      <EducationSection dict={dict} />
    </>
  );
}
