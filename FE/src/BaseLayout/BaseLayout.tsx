import { useEffect } from "react";
import Nav from "../components/Nav/Nav";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar/SideBar";
import Footer from "../components/Footer/Footer";
import loading from "../assets/img/loading.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setLoading } from "../features/loading/loadingSlice";

const BaseLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const dispatch = useDispatch();
  useEffect(() => {
    if (pathname === "/" || pathname === "") {
      navigate("/home");
    }
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setLoading(false));
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex flex-col justify-between relative lg:h-screen">
      {isLoading && (
        <div className="h-screen w-screen fixed z-[99] flex justify-center items-center bg-[#0404049b]">
          <img src={loading} alt="loading image" className=" h-[400px] " />
        </div>
      )}
      <Nav />
      <div className="flex flex-[8]">
        <div className="flex-[15]">
          <Outlet />
        </div>
        <div className="flex-[3] ml-[10px] min-w-[280px]">
          <SideBar />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BaseLayout;
