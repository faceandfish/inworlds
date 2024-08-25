import React from "react";
import Image from "next/image";

interface SponsorInfo {
  id: string;
  username: string;
  avatarUrl: string;
  donationTime: string;
}

// 模拟赞助者数据
const mockSponsors: SponsorInfo[] = [
  {
    id: "1",
    username: "张三",
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    donationTime: "2023-08-20 14:30"
  },
  {
    id: "2",
    username: "李四",
    avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    donationTime: "2023-08-19 09:15"
  },
  {
    id: "3",
    username: "王五",
    avatarUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    donationTime: "2023-08-18 18:45"
  },
  {
    id: "4",
    username: "赵六",
    avatarUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    donationTime: "2023-08-17 11:20"
  },
  {
    id: "5",
    username: "孙七",
    avatarUrl: "https://randomuser.me/api/portraits/men/5.jpg",
    donationTime: "2023-08-16 20:05"
  }
];

interface SponsorListItemProps {
  sponsor: SponsorInfo;
}

export const SponsorListItem: React.FC<SponsorListItemProps> = ({
  sponsor
}) => {
  return (
    <div className="flex justify-between items-center p-4 pb-2 ">
      <div>
        <div className="font-semibold">{sponsor.username}</div>
        <div className="text-sm text-gray-500">{sponsor.donationTime}</div>
      </div>
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <Image
          src={sponsor.avatarUrl}
          alt={`${sponsor.username}'s avatar`}
          width={40}
          height={40}
          className="object-cover"
        />
      </div>
    </div>
  );
};

export const SponsorList: React.FC<{ sponsors?: SponsorInfo[] }> = ({
  sponsors = mockSponsors // 使用默认参数，如果没有传入sponsors，就使用mockSponsors
}) => {
  return (
    <div className="w-1/3 bg-white h-2/3 shadow rounded-xl p-4">
      <h2 className="text-xl font-bold  text-gray-800 mb-4 space-y-1">
        赞助榜单
      </h2>
      {sponsors.map((sponsor) => (
        <SponsorListItem key={sponsor.id} sponsor={sponsor} />
      ))}
    </div>
  );
};
