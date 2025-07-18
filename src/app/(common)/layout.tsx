
import { ReactNode } from "react";
import 'antd/dist/reset.css';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <div className="h-full min-h-[calc(100vh-0px)]">{children}</div>
    </div>
  );
};

export default layout;
