"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import TitleComponent from "@/components/micro-components/title";
import SubTitleComponent from "@/components/micro-components/sub_title";
import { BsPersonHeart } from "react-icons/bs";

export default function SocialProjectsSection() {
  const t = useTranslations("Pages.homePage.sections.socialProjectsSection");
  const csrParagraphs = [
    "csr.p1",
    "csr.p2",
    "csr.p3",
    "csr.p4",
    "csr.p5",
    "csr.p6",
  ];

  const galleryImages = [
    {
      src: "/assets/imgs/page/1-soup kitchens for homeless.webp",
      alt: "gallery.alt1",
    },
    {
      src: "/assets/imgs/page/4-diaries.webp",
      alt: "gallery.alt2",
    },
    {
      src: "/assets/imgs/page/3-support for the elderly.webp",
      alt: "gallery.alt3",
    },
    {
      src: "/assets/imgs/page/2-pets.webp",
      alt: "gallery.alt4",
    },
  ];

  return (
    <section id="social-responsibility" className="principles section light-background">
      <div className="container d-flex align-items-center justify-content-center">
        <div className="row gy-4">
          {/* Corporate Social Responsibility - Text */}
          <div className="col-md-8" data-aos="fade-up">
            <div className="content px-xl-5">
              <h3 className="d-flex align-items-center gap-2">
                <span className="d-inline-flex align-items-center gap-2">
                  <SubTitleComponent t={t} sub_title={"csr.title"} aos="fade-right" aosDelay="100" />
                </span>
              </h3>

              {csrParagraphs.map((key, index) => (
                <p
                  key={key}
                  data-aos="fade-down"
                  data-aos-delay={150 + index * 50}
                >
                  {t(key)}
                </p>
              ))}
            </div>
          </div>

          <div className="col-md-4 d-flex align-items-center justify-content-center">
            <Image
              src="/assets/imgs/page/responsabilidad_corporativa.webp"
              className="img-fluid rounded mx-auto d-block m-1"
              alt={t("gallery.alt1")}
              style={{ maxHeight: 400, width: "auto", height: "auto" }}
              width={600}
              height={400}
              data-aos="fade-up"
              data-aos-delay="100"
            />
          </div>

          {/* Social Responsibility with the Community - Gallery */}
          <div className="row container gy-4 justify-content-center" data-aos="fade-up">
            {galleryImages.map((image, index) => (
              <div key={image.src} className="col-5">
                <Image
                  src={image.src}
                  alt={t(image.alt)}
                  className="img-fluid rounded mx-auto d-block m-1"
                  style={{ maxHeight: 400, width: "auto", height: "auto" }}
                  width={600}
                  height={400}
                  data-aos="fade-up"
                  data-aos-delay={100 + index * 50}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
