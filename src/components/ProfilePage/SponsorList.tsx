import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { SponsorInfo } from "@/app/lib/definitions";
import { getSponsorList } from "@/app/lib/action";
import { useTranslation } from "../useTranslation";
import Pagination from "../Main/Pagination";

interface SponsorListItemProps {
  sponsor: SponsorInfo;
}

const SponsorListItem: React.FC<SponsorListItemProps> = ({ sponsor }) => {
  const { t } = useTranslation("profile");
  return (
    <div className="flex justify-between items-center p-4 pb-2">
      <div>
        <div className="font-semibold">
          {sponsor.displayName || sponsor.userName}
        </div>
        <div className="text-sm text-gray-500">{sponsor.createAt}</div>
      </div>
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <Image
          src={sponsor.avatarUrl || "/defaultImg.png"}
          alt={`${sponsor.userName}'s avatar` || "avatar"}
          width={40}
          height={40}
          className="object-cover  object-center"
        />
      </div>
    </div>
  );
};

interface SponsorListProps {
  userId: string;
}

export const SponsorList: React.FC<SponsorListProps> = ({ userId }) => {
  const [sponsors, setSponsors] = useState<SponsorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { t } = useTranslation("profile");

  const itemsPerPage = 5;

  const fetchSponsors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getSponsorList(userId, currentPage, itemsPerPage);
      if (response.code === 200 && "data" in response) {
        setSponsors(response.data.dataList);
        setTotalPages(response.data.totalPage);
        setError(null);
      } else {
        setError(response.msg);
      }
    } catch (err) {
      setError("error");
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentPage]);

  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="hidden md:flex md:flex-col  md:w-1/3 bg-white shadow rounded-xl p-4 h-[460px] ">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {t("sponsorList.title")}
      </h2>
      <div className="flex-grow ">
        {isLoading ? (
          <div>{t("sponsorList.loading")}</div>
        ) : error ? (
          <div>
            {t("sponsorList.error")}: {error}
          </div>
        ) : sponsors.length > 0 ? (
          sponsors.map((sponsor) => (
            <SponsorListItem key={sponsor.userId} sponsor={sponsor} />
          ))
        ) : (
          <div>{t("sponsorList.noSponsors")}</div>
        )}
      </div>
      {!isLoading && !error && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default SponsorList;
