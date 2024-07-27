import Card from "./Card";
import WriteButton from "./WriteButton";
import {
  PencilIcon,
  UsersIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const creatorCards = [
  {
    title: "内容简介",
    description: "完善你的作品简介，让读者燃起好奇心。",
    link: "/write/intro",
  },
  {
    title: "设计封面",
    description: "为你的作品设计引人注目的封面。",
    link: "/write/cover",
  },
  {
    title: "创作内容",
    description: "开始创作你的新内容或管理已有作品。",
    link: "/write/content",
  },
];

export const NewUserView = ({
  toggleCreatorStatus,
}: {
  toggleCreatorStatus: () => void;
}) => (
  <div className="min-h-screen overflow-hidden  bg-gradient-to-br from-purple-100 to-orange-200 flex  justify-center ">
    <div className=" w-full">
      <div className="text-center">
        <h1 className="text-5xl  font-extrabold text-orange-600 my-8">
          成为创作者
        </h1>
      </div>

      <div className="bg-white px-20 py-20 mx-auto w-2/3 shadow-xl rounded-lg overflow-hidden">
        <div className="">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            加入我们的创作者社区，分享你的想法和故事
          </h2>
          <div className="space-y-6 ">
            {[
              { icon: PencilIcon, text: "发布原创内容，展示你的才华" },
              { icon: UsersIcon, text: "与读者互动，建立你的粉丝群" },
              { icon: CurrencyDollarIcon, text: "获得创作收益，实现你的梦想" },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-4 ">
                <div className="flex-shrink-0">
                  <item.icon className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-lg text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="px-8 pt-8">
          <WriteButton
            onClick={toggleCreatorStatus}
            className="w-full py-3 text-lg transition-transform duration-200 transform hover:scale-105"
          >
            立即开始创作之旅
          </WriteButton>
        </div>
      </div>
    </div>
  </div>
);

export const CreatorView = ({
  toggleCreatorStatus,
}: {
  toggleCreatorStatus: () => void;
}) => (
  <div className="p-20">
    <motion.h1
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="text-4xl mb-9 text-center font-bold text-gray-800"
    >
      欢迎回来，创作者！
    </motion.h1>

    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="flex flex-wrap justify-between"
    >
      {creatorCards.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          description={card.description}
          buttonText={`${card.title}`}
          onClick={() => console.log(`Clicked on ${card.title}`)}
          link={card.link}
        />
      ))}
    </motion.div>
    {/* <div className="text-center mt-9">
      <WriteButton onClick={toggleCreatorStatus} variant="secondary">
        直接开始
      </WriteButton>
    </div> */}
  </div>
);
