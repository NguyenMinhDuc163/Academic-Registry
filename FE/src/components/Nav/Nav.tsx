import { useEffect, useRef } from "react";
import subLogo from "../../assets/img/subLogo.png";
import "./Nav.css";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../until/CONSTANS";

const ITEM_HEADER = [
  {
    name: "Trang chủ",
    icon: "fa-solid fa-house",
    type: "/home",
  },
  {
    name: "Thông tin",
    icon: "fa-solid fa-user",
    type: "/userinfo",
  },
];

const Nav = () => {
  const { pathname } = useLocation();
  const subLogoRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      subLogoRef.current?.classList.remove(..."left-[-500px]".split(" "));
      subLogoRef.current?.classList.add(..."left-[0]".split(" "));
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <div>
      <div className="bg-mainRed text-white px-[60px] py-[14px] relative shadow-[0px_10px_20px_1px_rgba(0,0,0,0.3)] flex z-[2] ">
        {ITEM_HEADER.map((item) => (
          <div
            className={`flex mr-[20px] cursor-pointer ${
              pathname === item.type ? "opacity-1" : "opacity-50"
            }`}
            key={item.name.toString()}
            onClick={() => navigate(item.type)}
          >
            <i className={`${item.icon} mr-[10px]`}></i>
            <h1 className="text-[14px]">{item.name}</h1>
          </div>
        ))}
      </div>
      {pathname === "/" + ROUTES.HOME ? (
        <div className="relative z-[1] ">
          <div
            className="relative  left-[-500px] transition-all duration-[1s] ease-in "
            ref={subLogoRef}
          >
            <img
              src={subLogo}
              alt="subLogo"
              className="h-[68px] w-[260px] absolute z-[2] object-cover shadow-[-10px_6px_20px_1px_rgba(0,0,0,0.3)] shadow-[#ffffff78]"
            />
            <div className="subLogo"></div>
          </div>

          <div className="bg-redLight h-[34px]"></div>
          <div className=" h-[34px]"></div>
        </div>
      ) : (
        <div className="mt-[10px]"></div>
      )}
    </div>
  );
};

export default Nav;
