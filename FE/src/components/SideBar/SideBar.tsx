import { Button, createTheme, TextField, ThemeProvider } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useRef, useState } from "react";
import "./SideBar.css";
import { ROUTES } from "../../until/CONSTANS";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { env } from "../../services/config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { setIsLogin, setLoading } from "../../features/loading/loadingSlice";
import { setUser } from "../../features/user/userSlice";
import { toast } from "react-toastify";
declare module "@mui/material/styles" {
  interface Palette {
    ochre: Palette["primary"];
  }

  interface PaletteOptions {
    ochre?: PaletteOptions["primary"];
  }
}
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    ochre: true;
  }
}
const theme = createTheme({
  palette: {
    ochre: {
      main: "black",
      light: "black",
      dark: "black",
      contrastText: "#242105",
    },
  },
});

const FEATURES = [
  {
    route: ROUTES.COURSE_REGISTRATION,
    name: "Đăng kí môn học",
  },
  {
    route: ROUTES.SCHEDULE,
    name: "Xem thời khóa biểu",
  },
  {
    route: ROUTES.SCORE,
    name: "Xem điểm",
  },
];

const SideBar = () => {
  
  const iconRightLeft = useRef<HTMLDivElement>(null);
  const [isShowMoreIcon, setIsShowMoreIcon] = useState<boolean>(false);
  const showMoreText = useRef<HTMLDivElement>(null);
  const isLogin = useSelector((state:RootState)=>state.loading.isLogin)
  const user = useSelector((state:RootState)=>state.user.user)
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [username,setUsername] = useState<string>("")
  const [password,setPassword] = useState<string>("")


  const handleShowMore = () => {
    !isShowMoreIcon
      ? iconRightLeft.current?.classList.add("rotate-90")
      : iconRightLeft.current?.classList.remove("rotate-90");
    console.log(isShowMoreIcon);

    !isShowMoreIcon
      ? showMoreText.current?.classList.add("parent-height")
      : showMoreText.current?.classList.remove("parent-height");

    setIsShowMoreIcon(!isShowMoreIcon);
  };

  const handleLogin= async()=>{
    if(isLogin) {
      dispatch(setUser(null))
      dispatch(setIsLogin(false))
      navigate(ROUTES.HOME)
      setPassword("")
      return 

    }
    dispatch(setLoading(true))
    try{
      const res = await axios.post(`${env.VITE_API_ENDPOINT}/login`,{username,password})
      if(res.data.responseCode===200){
        dispatch(setUser(res.data.object))
        dispatch(setIsLogin(true))
        navigate(ROUTES.USER_INFOR)

      }
    }
    catch(e){
        toast.error("Not found account, try again")
    }
    finally{
      dispatch(setLoading(false))
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-md bg-white shadow-md pb-[10px] ">
        <div className="bg-mainRed py-[6px] px-[12px]  flex justify-between">
          <h1 className="text-white text-[0.9em] ">
            <i className="fa-solid fa-user mr-[10px]"></i> ĐĂNG NHẬP
          </h1>
          {isLogin && (
            <i
              onClick={handleShowMore}
              ref={iconRightLeft}
              className="fa-solid fa-angle-right text-white transition-all duration-200 ease-in "
            ></i>
          )}
        </div>
        <div className="px-[10px] mt-[10px]">
          {!isLogin && !user ? (
            <>
              <ThemeProvider theme={theme}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tên đăng nhập"
                  variant="standard"
                  color="ochre"
                  value={username}
                  onChange={(e)=>setUsername(e.target.value)}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Mật khẩu"
                  variant="standard"
                  color="ochre"
                  margin="normal"
                  type="password"
                  onChange={(e)=>setPassword(e.target.value)}
                  onKeyDown={(e)=>{if(e.keyCode===13){
                    handleLogin()
                  }}}
                />
              </ThemeProvider>
              {/* <p className="text-end italic text-mainRed text-[0.8em] mb-[6px] cursor-pointer">
                Quên mật khẩu
              </p> */}
            </>
          ) : (
            <div
              className="overflow-hidden parent ease-in-out "
              ref={showMoreText}
            >
              <div className="text-mainRed text-[0.9em] flex py-[6px] border-b-[1px] border-solid border-[#CCCC]">
                <div className="w-[40%]">Tài khoản</div>
                <div className=""> {user?.tai_khoan_id}</div>
              </div>
              <div className="text-mainRed text-[0.9em] flex py-[6px] border-b-[1px] border-solid border-[#CCCC]">
                <div className="w-[40%]">Họ và tên</div>
                <div className=""> {user?.full_name}</div>
              </div>
              <div className="text-mainRed text-[0.9em] flex py-[6px] border-b-[1px] border-solid border-[#CCCC]">
                <div className="w-[40%]">Ngày sinh</div>
                <div className=""> {user?.birth}</div>
              </div>
              <div className="text-mainRed text-[0.9em] flex py-[6px] border-b-[1px] border-solid border-[#CCCC]">
                <div className="w-[40%]">Ngành</div>
                <div className=""> Công Nghệ Thông Tin</div>
              </div>
              <div className="text-mainRed text-[0.9em] flex py-[6px] border-b-[1px] border-solid border-[#CCCC]">
                <div className="w-[40%]">Khoa</div>
                <div className=""> Công Nghệ Thông Tin</div>
              </div>
              {/* <div className="text-mainRed text-[0.9em] flex py-[6px] border-b-[1px] border-solid border-[#CCCC]">
                <div className="w-[40%]">Lớp</div>
                <div className=""> B21CQCN23</div>
              </div> */}
            </div>
          )}

          <Button
            fullWidth
            variant="contained"
            style={{ backgroundColor: "#ad171c" }}
            startIcon={<LoginIcon />}
            onClick={handleLogin}
          >
            {isLogin ? "Đăng Xuất" : "Đăng Nhập"}
          </Button>
        </div>
      </div>
      {isLogin && (
        <div className="mt-[20px] text-[white] overflow-hidden rounded-md  shadow-md ">
          <div className="bg-mainRed py-[6px] px-[12px]">
            <i className="fa-solid fa-gears"></i>TÍNH NĂNG
          </div>
          <div className="pl-[6px] text-mainRed pb-[6px] px-[10px] text-[0.9em]">
            {FEATURES.map((item) => (
              <div
                key={item.name}
                onClick={() => navigate("/" + item.route)}
                className="pt-[6px] border-b-[1px] border-[#7f7f7f7d] cursor-pointer hover:text-[#5a2525]"
              >
                <i
                  className={`fa-solid  fa-chevron-right mr-[10px] transition-all duration-200 ${
                    "/" + item.route === pathname && "rotate-90"
                  }`}
                ></i>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
