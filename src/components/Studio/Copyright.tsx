import React from "react";
import { useTranslation } from "../useTranslation";

const Copyright: React.FC = () => {
  const { t } = useTranslation("studio");
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mb-10">
        <h1 className="text-3xl font-bold text-center text-orange-600 pb-4 mb-6 border-b-2 border-orange-600">
          {t("copyright.title")}
        </h1>

        <Section title={t("copyright.sections.originalWorks")}>
          <p>{t("copyright.content.originalWorks")}</p>
        </Section>

        <Section title={t("copyright.sections.copyrightComplaints")}>
          <p>{t("copyright.content.copyrightComplaints")}</p>
        </Section>

        <Section title={t("copyright.sections.nonCommercialUse")}>
          <p>{t("copyright.content.nonCommercialUse")}</p>
        </Section>

        <Section title={t("copyright.sections.platformRights")}>
          <p className="bg-orange-100 p-3 rounded-md font-medium">
            {t("copyright.content.platformRights")}
          </p>
        </Section>

        <Section title={t("copyright.sections.copyrightComplaints")}>
          <p>{t("copyright.content.complaintHandling")}</p>
          <div className="bg-green-100 p-4 rounded-md text-center font-bold mt-4">
            {t("copyright.contactEmail")}
          </div>
        </Section>

        <Section title={t("copyright.sections.userAgreement")}>
          <p>{t("copyright.content.userAgreement")}</p>
        </Section>

        <Section title={t("copyright.sections.applicableLaw")}>
          <p>{t("copyright.content.applicableLaw")}</p>
        </Section>

        <footer className="mt-12  py-5 border-t border-gray-300 text-center text-sm text-gray-600">
          <p>{t("copyright.lastUpdated")}</p>
          <p>{t("copyright.rights")}</p>
          <p>{t("copyright.contact")}</p>
        </footer>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children
}) => {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-orange-500 mb-3 border-l-4 border-orange-500 pl-3">
        {title}
      </h2>
      <div className="bg-white p-4 rounded-md shadow-sm">{children}</div>
    </section>
  );
};

export default Copyright;
