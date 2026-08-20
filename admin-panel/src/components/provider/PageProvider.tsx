import { ModuleName } from "@/constants/permissionEnums";
import React, { FC, ReactNode } from "react";
import ComponentCard from "../common/ComponentCard";

interface IPageProvider {
  children: React.ReactNode;
  title: string;
  description: string;
  addDataPageUrl?: string;
  moduleName: ModuleName;
  goBackUrl?: boolean;
  customeButton?: ReactNode;
}

const PageProvider: FC<IPageProvider> = ({
  children,
  title,
  description,
  addDataPageUrl,
  moduleName,
  goBackUrl,
  customeButton,
}) => {
  return (
    <div>
      <ComponentCard
        title={title}
        description={description}
        addDataPageUrl={addDataPageUrl}
        moduleName={moduleName}
        goBlackUrl={goBackUrl}
        customeButton={customeButton}
      >
        {children}
      </ComponentCard>
    </div>
  );
};

export default PageProvider;
