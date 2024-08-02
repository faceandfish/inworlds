// pages/index.tsx
import { useState } from "react";

import { IncomeData } from "@/app/lib/definitions";
import { generateMonthlyData } from "@/app/lib/income";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import { Card, CardContent, CardHeader } from "../Card";

const incomeData: IncomeData = {
  totalIncome: 80000,
  adIncome: 40000,
  donationIncome: 15000,
  copyrightIncome: 25000,
  monthlyIncome: generateMonthlyData(),
};

const ProgressBar: React.FC<{ value: number; max: number; color: string }> = ({
  value,
  max,
  color,
}) => {
  const percentage = (value / max) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className="h-2.5 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      ></div>
    </div>
  );
};

const IncomeCard: React.FC<{
  title: string;
  amount: number;
  color: string;
  totalIncome: number;
}> = ({ title, amount, color, totalIncome }) => (
  <Card className="mb-4">
    <CardHeader className="pb-2">
      <h3 className="text-lg font-semibold">{title}</h3>
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-center mb-2">
        <span className="text-2xl font-bold" style={{ color }}>
          ¥{amount.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500">
          {((amount / totalIncome) * 100).toFixed(1)}%
        </span>
      </div>
      <ProgressBar value={amount} max={totalIncome} color={color} />
    </CardContent>
  </Card>
);

const Income: React.FC = () => {
  const [data] = useState<IncomeData>(incomeData);

  return (
    <div className="font-sans p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-700">
                最近6个月收入
              </h2>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.monthlyIncome}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="income" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-700">收入明细</h2>
            </CardHeader>
            <CardContent>
              <IncomeCard
                title="广告收入"
                amount={data.adIncome}
                color="#3B82F6"
                totalIncome={data.totalIncome}
              />
              <IncomeCard
                title="打赏收入"
                amount={data.donationIncome}
                color="#F59E0B"
                totalIncome={data.totalIncome}
              />
              <IncomeCard
                title="版权收入"
                amount={data.copyrightIncome}
                color="#8B5CF6"
                totalIncome={data.totalIncome}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-700">总收入</h2>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-3xl font-bold text-green-600">
                  ¥{data.totalIncome.toLocaleString()}
                </span>
              </div>
              <ProgressBar
                value={data.totalIncome}
                max={data.totalIncome}
                color="#10B981"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-700">收入分布</h2>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "广告收入",
                        value: data.adIncome,
                        fill: "#3B82F6",
                      },
                      {
                        name: "打赏收入",
                        value: data.donationIncome,
                        fill: "#F59E0B",
                      },
                      {
                        name: "版权收入",
                        value: data.copyrightIncome,
                        fill: "#8B5CF6",
                      },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Income;
