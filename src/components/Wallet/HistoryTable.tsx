import React from "react";
import { PurchaseHistory, DonationHistory } from "@/app/lib/definitions";
import { HiShoppingCart, HiGift } from "react-icons/hi2";

interface HistoryTableProps {
  title: string;
  icon: "cart" | "gift";
  data: PurchaseHistory[] | DonationHistory[];
  type: "purchase" | "donation";
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  title,
  icon,
  data,
  type
}) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold mb-4 flex items-center text-orange-800">
      {icon === "cart" ? (
        <HiShoppingCart className="mr-2 text-orange-400 text-2xl" />
      ) : (
        <HiGift className="mr-2 text-orange-400 text-2xl" />
      )}
      {title}
    </h2>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-orange-100">
          <tr>
            <th className="p-2 text-left text-orange-800">日期</th>
            <th className="p-2 text-left text-orange-800">
              {type === "purchase" ? "购买金币" : "打赏金币"}
            </th>
            {type === "purchase" ? (
              <th className="p-2 text-left text-orange-800">支付金额</th>
            ) : (
              <>
                <th className="p-2 text-left text-orange-800">作者</th>
                <th className="p-2 text-left text-orange-800">作品</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-t border-orange-100">
              <td className="p-2 text-orange-700">{item.date}</td>
              <td className="p-2 text-orange-700">{item.coins} 金币</td>
              {type === "purchase" ? (
                <td className="p-2 text-orange-700">
                  ￥{(item as PurchaseHistory).amountPaid}
                </td>
              ) : (
                <>
                  <td className="p-2 text-orange-700">
                    {(item as DonationHistory).authorName}
                  </td>
                  <td className="p-2 text-orange-700">
                    {(item as DonationHistory).bookTitle}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
