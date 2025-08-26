"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import TitleComponent from "@/components/micro-components/title";
import SubTitleComponent from "@/components/micro-components/sub_title";
import { BsPersonHeart } from "react-icons/bs";

export default function SocialProjectsSection() {
  const t = useTranslations("Pages.homePage.sections.socialProjectsSection");

  return (
    <section id="social_responsibility" className="principles section light-background">
      <div className="container d-flex align-items-center justify-content-center">
        <div className="row gy-4">
          {/* Corporate Social Responsibility - Text */}
          <div className="col-lg-8" data-aos="fade-up">
            <div className="content px-xl-5">
              <h3 className="d-flex align-items-center gap-2">
                <span className="d-inline-flex align-items-center gap-2">
                  <SubTitleComponent t={t} sub_title={"csr.title"} />
                </span>
              </h3>

              <p>{t("csr.p1")}</p>
              <p>{t("csr.p2")}</p>
              <p>{t("csr.p3")}</p>
              <p>{t("csr.p4")}</p>
              <p>{t("csr.p5")}</p>
            </div>
          </div>

          <div className="col-lg-4">
            <Image
                src="/assets/imgs/page/responsabilidad_corporativa.webp"
                className="img-fluid rounded mx-auto d-block m-1"
                alt={t("gallery.alt1")}
                style={{ maxHeight: 400, width: "auto", height: "auto" }}
                width={600}
                height={400}
              />
          </div>

          {/* Social Responsibility with the Community - Gallery */}
          <div className="row container gy-4 justify-content-center" data-aos="fade-up">
            <div className="col-5">
              <Image
                src="/assets/imgs/page/1-soup kitchens for homeless.webp"
                className="img-fluid rounded mx-auto d-block m-1"
                alt={t("gallery.alt1")}
                style={{ maxHeight: 400, width: "auto", height: "auto" }}
                width={600}
                height={400}
              />
            </div>

            <div className="col-5">
              <Image
                src="/assets/imgs/page/4-diaries.webp"
                className="img-fluid rounded mx-auto d-block m-1"
                alt={t("gallery.alt2")}
                style={{ maxHeight: 400, width: "auto", height: "auto" }}
                width={600}
                height={400}
              />
            </div>

            <div className="col-5">
              <Image
                src="/assets/imgs/page/3-support for the elderly.webp"
                className="img-fluid rounded mx-auto d-block m-1"
                alt={t("gallery.alt3")}
                style={{ maxHeight: 400, width: "auto", height: "auto" }}
                width={600}
                height={400}
              />
            </div>

            <div className="col-5">
              <Image
                src="/assets/imgs/page/2-pets.webp"
                className="img-fluid rounded mx-auto d-block m-1"
                alt={t("gallery.alt4")}
                style={{ maxHeight: 400, width: "auto", height: "auto" }}
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
