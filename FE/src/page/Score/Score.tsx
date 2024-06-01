import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../../services/config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { setLoading } from "../../features/loading/loadingSlice";

const Score = () => {
  const user = useSelector((state:RootState)=>state.user.user)
  const dispatch = useDispatch()
  const [listScore,setListScore] = useState<any[]>([])
  const getScore = async()=>{
    
    try{
      dispatch(setLoading(true))
      const res = await axios.get(`${env.VITE_API_ENDPOINT}/diem?sinh_vien_id=${user?.tai_khoan_id}`)
      setListScore(res.data.object);
      
    }
    catch(e){
      console.log(e);
      
    }
    finally{
      dispatch(setLoading(false))
    }
  }

  useEffect(()=>{
    getScore()
  },[])
  const getScoreItem=(item:any)=>{
    return ((Number(item.diem[0].diem)+Number(item.diem[2].diem)*2+Number(item.diem[3].diem)*2)+item.diem[1].diem*5)/10
  }

  const getGPA=(item:any)=>{
    const diem = getScoreItem(item)
    if (diem >= 8.5 && diem <= 10) {
      return "A";
  } else if (diem >= 7.5 && diem < 8.5) {
      return "B+";
  } else if (diem >= 6.5 && diem < 7.5) {
      return "B";
  } else if (diem >= 5.5 && diem < 6.5) {
      return "C+";
  } else if (diem >= 4.5 && diem < 5.5) {
      return "C";
  } else if (diem >= 3.5 && diem < 4.5) {
      return "D+";
  } else if (diem >= 0 && diem < 3.5) {
      return "D";
  } else {
      return "Không hợp lệ";
  }
  }
  return (
    <div>
      <div className="bg-mainRed text-[white] font-normal flex justify-between px-[10px] py-[2px]  items-center">
        <div>
          <i className="fa-solid fa-atom mr-[10px]"></i>
          <span>XEM ĐIỂM</span>
        </div>
      </div>

      <table className="w-full rounded-t-md overflow-hidden mt-[40px]">
        <tr className="flex bg-mainRed  text-white text-center justify-between border-[#CCCC]">
          <th className=" border-[1px]  flex-[1] font-normal">STT</th>
          <th className=" border-[1px] flex-[1] font-normal">
            Mã MH <i className="fa-solid fa-caret-up ml-[4px]"></i>
          </th>
          <th className=" font-normal border-[1px]  flex-[1]">Nhóm Tổ</th>
          <th className=" font-normal border-[1px] flex-[5] ">Tên môn học </th>

          <th className=" font-normal border-[1px]  flex-[1]">Số TC</th>
          <th className=" font-normal border-[1px]  flex-[1]">Điểm thi</th>
          <th className=" font-normal border-[1px]  flex-[1]">Điểm TK (10)</th>
          <th className=" font-normal border-[1px]  flex-[1]">Điểm TK (4)</th>
          <th className=" font-normal border-[1px]  flex-[1]">Điểm TK (C)</th>
          <th className=" font-normal border-[1px]  flex-[1]">Kết quả</th>
          <th className=" font-normal border-[1px]  flex-[1]">Chi tiết</th>
        </tr>
        {listScore.length &&
          listScore.map((item, idx) => (
            <tr key={idx} className="flex   text-[black] text-center justify-between border-[#CCCC]">
              <th className=" border-[1px]  flex-[1] font-normal">{idx + 1}</th>
              <th className=" border-[1px] flex-[1] font-normal">
                {/* {item.id} */}
                </th>
              <th className=" font-normal border-[1px]  flex-[1]">
                {/* {item.group} */}
              </th>
              <th className=" font-normal border-[1px] flex-[5] ">
                {item.ten_mon_hoc}
              </th>

              <th className=" font-normal border-[1px]  flex-[1]">
                {/* {item.stc} */}
              </th>
              <th className=" font-normal border-[1px]  flex-[1]">
                {item.diem[1].diem}
              </th>
              <th className=" font-normal border-[1px]  flex-[1]">
                {getScoreItem(item)}
              </th>
              <th className=" font-normal border-[1px]  flex-[1]">
                {(getScoreItem(item)*4/10).toFixed(1)}
              </th>
              <th className=" font-normal border-[1px]  flex-[1]">
                {getGPA(item)}
              </th>
              <th className=" font-normal border-[1px]  flex-[1]">
                <i className="fa-solid fa-check text-mainRed"></i>
              </th>
              <th className=" font-normal border-[1px]  flex-[1]">
                <i className="fa-solid fa-list text-mainRed"></i>
              </th>
            </tr>
          ))}
      </table>
      {/* <div className="py-[10px] bg-[#cccccc78] text-mainRed">
        <div className="flex">
          <h1 className="flex-1">- Điểm trung bình học kỳ hệ 4: </h1>
          <h1 className="flex-[2] text-start">
            - Điểm trung bình tích lũy hệ 4:
          </h1>
        </div>
        <div className="flex">
          <h1 className="flex-1">- Điểm trung bình học kỳ hệ 10: </h1>
          <h1 className="flex-[2] text-start">
            - Điểm trung bình tích lũy hệ 10:
          </h1>
        </div>
        <div className="flex">
          <h1 className="flex-1">- Số tín chỉ đạt học kỳ: </h1>
          <h1 className="flex-[2] text-start">- Số tín chỉ tích lũy:</h1>
        </div>
      </div> */}
    </div>
  );
};

export default Score;
