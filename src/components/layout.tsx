import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
    return (
      <div className="flex flex-col h-full justify-center items-center">
        <div className="w-screen border border-slate-400 md:max-2-xl">
          <div className="flex flex-col border border-slate-400">
            {props.children}
          </div>
        </div>
      </div>
    )
};