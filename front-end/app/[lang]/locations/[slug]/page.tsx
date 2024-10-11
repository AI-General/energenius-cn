import { FC } from "react";
import { sideNavItems } from "@/data";
import Content from "@/components/Content";

interface Props {
  params: {
    slug: string;
  };
}

const page: FC<Props> = ({ params }) => {
  const item = sideNavItems.filter((item) => item.href === `/locations/${params.slug}`)[0];

  return (
    <>
      <Content title={item.title} />
    </>
  );
};

export default page;
