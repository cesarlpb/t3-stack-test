import Link from "next/link";
// import { faArrowLeft, faArrowRight, faHome } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function CustomLink(props: { icon?: string, href: string; text: string }) {
  
  // const icon = props.icon == "home" ? "home" 
  //   : props.icon == "arrow-left" ? "arrow-left" 
  //   : props.icon == "arrow-right" ? "arrow-right" : ""
  
  return (
    <>
      <Link
        className="rounded-full bg-[hsl(280,100%,70%)] px-10 py-2
              text-center font-semibold text-black no-underline transition 
              flex flex-row items-center justify-center gap-x-2
              hover:bg-cyan-200/70 hover:text-slate-200 text-[1rem]"
        href={props.href}
      >
        {/* {props.icon && props.icon == "home" ? <FontAwesomeIcon icon={faHome} className="text-[1rem]" /> 
        : props.icon == "arrow-left" ? <FontAwesomeIcon icon={faArrowLeft} className="text-[1rem]" /> 
        : props.icon == "arrow-right" ? <FontAwesomeIcon icon={faArrowRight} className="text-[1rem]" /> : ""} */}

        {props.text}
      </Link>
    </>
  );
}
