import React, { ReactNode } from "react";

interface CardProps {
  className?: string;
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({ className = "", children }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
    {children}
  </div>
);

interface CardHeaderProps {
  className?: string;
  children: ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  className = "",
  children,
}) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

interface CardContentProps {
  className?: string;
  children: ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({
  className = "",
  children,
}) => <div className={`px-6 py-4 ${className}`}>{children}</div>;
