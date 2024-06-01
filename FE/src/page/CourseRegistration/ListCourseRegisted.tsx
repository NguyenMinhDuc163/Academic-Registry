import React from "react";
import { ICourseRegisted } from "./CourseRegistration";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { env } from "../../services/config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { toast } from "react-toastify";
import { setLoading } from "../../features/loading/loadingSlice";
interface IListCourseRegisted {
  listCourseRegisted: ICourseRegisted[];
  onDelete:()=>void
}
const ListCourseRegisted: React.FC<IListCourseRegisted> = ({ listCourseRegisted ,onDelete}) => {
  const user = useSelector((state:RootState)=>state.user.user)
  const dispath = useDispatch()
  const handleDelete = async(item:ICourseRegisted)=>{
    try{
        dispath(setLoading(true))
      const res = await axios.delete(`${env.VITE_API_ENDPOINT}/dang_ki`, {
        headers: {
        
        },
        data: {
          sinh_vien_id:user?.tai_khoan_id,
          mon_hoc_id:item.mon_hoc_id
        }
      });
      console.log(res);
      
      onDelete()
      toast.success("Xóa Thành Công")
    }
    catch(e){
     
      toast.error("Xóa Không Thành Công")
    }
    finally{
      dispath(setLoading(false))
    }
  }

  return (
    <div className="flex justify-center bg-[#7a7a7a1c] pb-[20px]  rounded-b-sm">

    <table className="w-[96%] rounded-t-md overflow-hidden ">
      <tr className="flex bg-mainRed text-white text-center justify-between border-[#CCCC]">
        <th className=" border-[1px]  flex-[1]">Xóa</th>
        <th className=" border-[1px] flex-[1]">
          Mã MH <i className="fa-solid fa-caret-up ml-[4px]"></i>
        </th>
        <th className=" border-[1px] flex-[5] pl-[10px]">Tên môn học </th>

       
        <th className=" border-[1px]  flex-[1]">Trạng thái</th>
      </tr>
      <div className="">
      {listCourseRegisted &&
        listCourseRegisted.map((item: ICourseRegisted) => (
          <tr key={item.dang_ki_id} className="flex  text-black text-center justify-between border-[#cccc]">
            <td className=" border-[1px] flex-[1] ">
            <IconButton onClick={()=>handleDelete(item)} ><CloseIcon/> </IconButton> 
            </td>
            <td className=" text-[grey] border-[1px] flex-[1]">{item.mon_hoc_id}</td>
            <td className=" text-[grey] border-[1px] flex-[5] text-start pl-[10px]">{item.ten_mon_hoc}</td>
          
           
            <td className=" text-[grey] border-[1px] flex-[1]">
              Đã đăng kí 
            </td>
          </tr>
        ))}
        </div>
    </table>
    </div>
  );
};

export default ListCourseRegisted;
