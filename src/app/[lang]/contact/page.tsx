import React from "react";
import { FaEnvelope, FaQuestionCircle } from "react-icons/fa";

const HelpPage: React.FC = () => {
  const faqs = [
    {
      question: "如何成为作者？",
      answer:
        "您可以点击网站右上角的立即开始创作按钮，填写必要的信息即可开始创作。"
    },
    {
      question: "发布作品如何赚钱？",
      answer: "免费作品我们将嵌入广告内容，广告收入所得50%将发放给作者"
    },
    {
      question: "如何修改作品？",
      answer:
        "您可以点击网站右上角的个人头像，进入您的作家工作室，点击编辑。您可以在那里修改作品内容，完成后可以选择发布您的作品。"
    },
    {
      question: "如何修改我的个人资料？",
      answer:
        "登录后，点击右上角的头像，然后选择账号修改。在那里，您可以更新您的个人信息、头像等。"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">需要帮助？</h1>
          <p className="text-gray-600 mb-6">
            如果您有任何问题或需要帮助，请随时与我们联系。我们很乐意为您提供支持。
          </p>
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
            <div className="flex items-center">
              <FaEnvelope className="text-orange-400 mr-3" />
              <p className="text-orange-500">
                您可以通过以下邮箱联系我们：
                <a
                  href="mailto:sundayoffice.jp@gmail.com"
                  className="font-medium hover:underline"
                >
                  sundayoffice.jp@gmail.com
                </a>
              </p>
            </div>
          </div>
          <p className="text-gray-600 mb-8">
            无论您有任何疑问、建议或反馈，我们都欢迎您随时与我们联系。我们的团队将尽快回复您的邮件。
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            常见问题解答
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <FaQuestionCircle className="text-orange-400 mr-2" />
                  {faq.question}
                </h3>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-gray-600">
            <p>
              如果您的问题未在上述列表中得到解答，请随时通过邮件与我们联系。我们的团队将竭诚为您服务。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
