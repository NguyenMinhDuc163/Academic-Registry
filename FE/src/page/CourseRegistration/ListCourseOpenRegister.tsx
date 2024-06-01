import { Checkbox } from "@mui/material";
import { ICourse, ICourseRegisted } from "./CourseRegistration";
interface IListCourseOpenRegister {
  courses:ICourse[]
  onChecked:(item:string) =>void
  listCourseChecked:string[]
  listCourseRegisted:ICourseRegisted[]
}

const ListCourseOpenRegister:React.FC<IListCourseOpenRegister> = ({listCourseRegisted,courses,onChecked,listCourseChecked}) => {
  const handleClick = (item:ICourse)=>{
    onChecked(item.mon_hoc_id)
  }
  const IsDisable = (item:ICourse)=>{

    return !!listCourseRegisted.find((crs)=>crs.mon_hoc_id===item.mon_hoc_id)

  }
  return (
    <div className="flex justify-center bg-[#7a7a7a1c] pb-[20px]  rounded-b-sm">
      <table className="w-[96%] rounded-t-md overflow-hidden bg-[white] rounded-b-md">
        <tr className="flex bg-mainRed text-white text-center justify-between border-[#CCCC] pr-[10px]">
          <th className=" border-[1px] flex-[1] pl-[18px]">
            Mã MH <i className="fa-solid fa-caret-up ml-[4px]"></i>
          </th>
          <th className=" border-[1px] flex-[5] pl-[18px]">Tên môn học </th>
          
          <th className=" border-[1px]  flex-[1]">Số TC</th>
          <th className=" border-[1px]  flex-[1]"></th>
          {/* <th className=" border-[1px]  flex-[1]">Lớp</th>
          <th className=" border-[1px]  flex-[2]">Số Lượng</th>
          <th className=" border-[1px]  flex-[1]">Còn Lại</th>
          <th className=" border-[1px] flex-[2]">Thời khóa biểu</th> */}
        </tr>
        <div className="h-[400px] overflow-y-auto">
        {courses&&courses.length&&courses.map((course,index)=><tr onClick={()=>handleClick(course)} key={index} className="flex  text-black text-center justify-between border-[#cccc]">
          <th className=" border-[1px] flex-[1] text-[grey] font-normal pl-[18px] text-start">{course.mon_hoc_id}</th>
          <th className=" border-[1px] flex-[5] text-[grey] font-normal pl-[18px] text-start">{course.ten_mon_hoc}</th>
          <th className=" border-[1px]  flex-[1] text-[grey] font-normal">{course.so_tc}</th>
          <th className=" border-[1px]  flex-[1]"><Checkbox disabled={IsDisable(course)} checked={listCourseChecked.includes(course.mon_hoc_id)&&!IsDisable(course)} /></th>
         
        </tr>)}
        </div>
      </table>
    </div>
  );
};

export default ListCourseOpenRegister;
