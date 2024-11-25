import React, { ReactNode } from 'react';

interface SectionCardProps {
  children: ReactNode;
}

function SectionCard({ children }: SectionCardProps): JSX.Element {
  return <div>{children}</div>;
}

export default SectionCard;
