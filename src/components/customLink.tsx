import Link from "next/link";
import { faHome, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function CustomLink(props: { icon?: string, href: string; text: string }) {
  
  // const icon = props.icon == "home" ? "home" 
  //   : props.icon == "arrow-left" ? "arrow-left" 
  //   : props.icon == "arrow-right" ? "arrow-right" : ""
  
  return (
    
    <>
      
      <Link
        className="rounded-full bg-[hsl(280,100%,70%)] px-5 py-3 
              text-center font-semibold text-black no-underline transition 
              flex flex-row items-center justify-center gap-x-2
              hover:bg-cyan-200/70 hover:text-slate-200"
        href={props.href}
      >
        {props.icon && props.icon == "home" ? <FontAwesomeIcon icon={faHome} /> 
        : props.icon == "arrow-left" ? <FontAwesomeIcon icon={faArrowLeft} /> 
        : props.icon == "arrow-right" ? <FontAwesomeIcon icon={faArrowRight} /> : ""}

        {props.text}
      </Link>
    </>
  );
}
