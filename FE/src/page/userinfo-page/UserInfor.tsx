import { Autocomplete, TextField } from "@mui/material";
import { KI_HOC } from "../Schedule/Schedule";
import Charts from "./Charts";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect } from "react";
import axios from "axios";
import { env } from "../../services/config";

const UserInfor = () => {
  const user = useSelector((state:RootState)=>state.user.user)

  const getScore = ()=>{
    try{
      const res = axios.get(`${env.VITE_API_ENDPOINT}/diem-ki/${user?.tai_khoan_id}/HK1`)
      console.log(res);
      
    }
    catch(e){

    }
  }

  useEffect(()=>{

    getScore()

  },[])
  return (
    <div className="shadow-md py-[6px] px-[10px] flex justify-between">
      <div className="w-[50%]">
        <div className="shadow-md border-[1px] border-[#cccc] ">
          <h1 className="text-mainRed font-semibold border-b-[1px] px-[10px] py-[6px] border-[#cccc]">
            Thông tin sinh viên
          </h1>
          <div className="flex justify-between">
            <div className="px-[10px] py-[6px] ">
              <div className="flex">
                <p className="w-[200px]">Mã SV</p>
                <p>{user?.tai_khoan_id}</p>
              </div>
              <div className="flex">
                <p className="w-[200px]">Họ và tên</p>
                <p>{user?.full_name}</p>
              </div>
              <div className="flex">
                <p className="w-[200px]">Ngày sinh</p>
                <p>{user?.birth}</p>
              </div>
             
              <div className="flex">
                <p className="w-[200px]">Email</p>
                <p>{user?.email}</p>
              </div>
            
              
              
              <div className="flex">
                <p className="w-[200px]">Hiện diện</p>
                <p>Đang học</p>
              </div>
            </div>

          
          </div>
        </div>

        <div className="shadow-md border-[1px] mt-[20px] border-[#cccc] ">
          <h1 className="text-mainRed font-semibold border-b-[1px] px-[10px] py-[6px] border-[#cccc]">
            Thông tin khoá học
          </h1>

          <div className="px-[10px] py-[6px] ">
            <div className="flex">
              <p className="w-[200px]">Ngành</p>
              <p>Công nghệ thông tin</p>
            </div>
            <div className="flex">
              <p className="w-[200px]">Khoa</p>
              <p>Công nghệ thông tin</p>
            </div>
            <div className="flex">
              <p className="w-[200px]">Bậc hệ đào tạo</p>
              <p>ĐHCQ (4,5 năm)</p>
            </div>
            <div className="flex">
              <p className="w-[200px]">Niên khóa</p>
              <p>2021-2026</p>
            </div>
          </div>
        </div>

        {/* <div className="shadow-md border-[1px] mt-[20px] border-[#cccc] ">
          <h1 className="text-mainRed font-semibold border-b-[1px] px-[10px] py-[6px] border-[#cccc]">
            Cố vấn học tập
          </h1>

          <div className="px-[10px] py-[6px] ">
            <div className="flex">
              <p className="w-[200px]">Tài khoản</p>
              <p>QL1007</p>
            </div>
            <div className="flex">
              <p className="w-[200px]">Họ và tên</p>
              <p>Chu Phương Hiền</p>
            </div>
            <div className="flex">
              <p className="w-[200px]">Email</p>
              <p>cphien@ptit.edu.vn</p>
            </div>
          </div>
        </div> */}
      </div>

      <div className="shadow-lg w-[50%] ml-[10px]">
        <div className="flex items-center  border-b-[1px] border-b-[#cccc] pb-[10px] ">
          <h1 className="text-mainRed font-semibold px-[10px] py-[6px] mt-[10px]">
            Kết quả học tập
          </h1>
          <Autocomplete
            disablePortal
            options={KI_HOC}
            sx={{
              width: 300,

              "& .MuiAutocomplete-input": {
                fontSize: 15,
              },
            }}
            defaultValue={KI_HOC[0]}
            size="small"
            className="mt-[12px] mx-[6px] "
            onChange={(_e, value) => console.log(value)}
            renderInput={(params) => <TextField {...params} label="Kì Học" />}
          />
        </div>
        <Charts />
      </div>
    </div>
  );
};

export default UserInfor;
