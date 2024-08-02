interface MonthlyIncome {
  month: string;
  income: number;
}
export const getMonthName = (month: number): string => {
  return new Date(2000, month).toLocaleString("zh-CN", { month: "long" });
};

export const generateMonthlyData = (): MonthlyIncome[] => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  let data: MonthlyIncome[] = [];

  for (let i = 0; i < 6; i++) {
    let month = (currentMonth - i + 12) % 12;
    data.push({
      month: getMonthName(month),
      income: Math.floor(Math.random() * 5000) + 7000, // Random income between 7000 and 12000
    });
  }

  return data;
};
