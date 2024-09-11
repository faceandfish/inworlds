import React, { lazy, Suspense } from "react";
import WorkContentSkeleton from "./Skeleton/WorkContentSkeleton";
import DataAnalysisSkeleton from "./Skeleton/DataAnalysisSkeleton";
import CommentsSkeleton from "./Skeleton/CommentsSkeleton";
const LazyWorkContent = lazy(() => import("./WorkContent"));
const LazyDataAnalysis = lazy(() => import("./DataAnalysis"));
const LazyCopyright = lazy(() => import("./Copyright"));
const LazyIncome = lazy(() => import("./Income"));
const LazyComments = lazy(() => import("./Comments"));

interface ContentWrapperProps {
  activeSection: string;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({ activeSection }) => {
  return (
    <>
      <Suspense fallback={<WorkContentSkeleton />}>
        {activeSection === "works" && <LazyWorkContent />}
      </Suspense>
      <Suspense fallback={<DataAnalysisSkeleton />}>
        {activeSection === "analysis" && <LazyDataAnalysis />}
      </Suspense>
      <Suspense fallback={<CommentsSkeleton />}>
        {activeSection === "comments" && <LazyComments />}
      </Suspense>
      <Suspense fallback={<div>Loading copyright info...</div>}>
        {activeSection === "copyright" && <LazyCopyright />}
      </Suspense>
      <Suspense fallback={<div>Loading income data...</div>}>
        {activeSection === "income" && <LazyIncome />}
      </Suspense>
    </>
  );
};

export default ContentWrapper;
