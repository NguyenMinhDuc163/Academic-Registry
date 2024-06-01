
const ALL_DAY = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ Nhật",
];
const TIET = [
  ["Tiết 1", "", "", "", "", "", "", "", "07:00"],
  ["Tiết 2", "", "", "", "", "", "", "", "08:00"],
  ["Tiết 3", "", "", "", "", "", "", "", "09:00"],
  ["Tiết 4", "", "", "", "", "", "", "", "10:00"],
  ["Tiết 5", "", "", "", "", "", "", "", "11:00"],
  ["Tiết 6", "", "", "", "", "", "", "", "12:00"],
  ["Tiết 7", "", "", "", "", "", "", "", "13:00"],
  ["Tiết 8", "", "", "", "", "", "", "", "14:00"],
  ["Tiết 9", "", "", "", "", "", "", "", "15:00"],
  ["Tiết 10", "", "", "", "", "", "", "", "16:00"],
  ["Tiết 11", "", "", "", "", "", "", "", "17:00"],
  ["Tiết 12", "", "", "", "", "", "", "", "18:00"],
  ["Tiết 13", "", "", "", "", "", "", "", "19:00"],
  ["Tiết 14", "", "", "", "", "", "", "", "20:00"],
  ["Tiết 15", "", "", "", "", "", "", "", "21:00"],
];
interface IScheduleTable{
  dataTable:any[]
}
const ScheduleTable:React.FC<IScheduleTable> = ({dataTable}) => {
  let dataTableTmp= dataTable
  const addDataTable = TIET.map((item1)=>{
    return item1.map((item2,idx)=>{
      if(idx>0 && idx<8 && dataTableTmp.length>0){
        const x = dataTableTmp[0]
        dataTableTmp=dataTableTmp.slice(1)
        return x
      }
      return item2

    })
  })
  console.log(addDataTable);
  
  return (
    <div className="mt-[10px] px-[4px]">
      <table className="w-full">
        <tr>
          <th className="font-normal w-[80px] text-center border-[1px] border-[#CCCC]">
            <i className="fa-solid fa-left-long text-mainRed"></i> Trước
          </th>
          {ALL_DAY.map((item) => (
            <th className="font-normal border-[1px] border-[#CCCC] w-[100px] bg-mainRed text-white text-center">
              {item}
            </th>
          ))}
          <th className="font-normal w-[80px] text-center border-[1px] border-[#CCCC]">
            Sau <i className="fa-solid fa-right-long text-mainRed"></i>
          </th>
        </tr>
        {addDataTable.map((item) => (
          <tr className="">
            {item.map((x, index) => (
              <td
                className={`w-[80px] text-center border-[1px] border-[#8f8f8fcc] ${
                  index === 0 || index === 8 ? "bg-mainRed text-white" : ""
                }`}
                key={index}
              >
                {index>0&&index<8 && x!==''?<div className="">
                  <h1 className="text-start text-[14px]">Môn: {x.ten_lop}</h1>
                  <h1 className="text-start my-[14px] text-[14px]">Phòng: {x.ten_phong}</h1>
                  <h1 className="text-start text-[14px]">Tòa Nhà: {x.ten_toa_nha}</h1>
                  </div>:<div>{x}</div>}
              </td>
            ))}
          </tr>
        ))}
        <tr>
          <th className="font-normal w-[80px] text-center border-[1px] border-[#CCCC]">
            <i className="fa-solid fa-left-long text-mainRed"></i> Trước
          </th>
          {ALL_DAY.map((item,idx) => (
            <th key={idx} className="font-normal border-[1px] border-[#CCCC] w-[100px] bg-mainRed text-white text-center">
              {item}
            </th>
          ))}
          <th className="font-normal w-[80px] text-center border-[1px] border-[#CCCC]">
            Sau <i className="fa-solid fa-right-long text-mainRed"></i>
          </th>
        </tr>
      </table>
    </div>
  );
};

export default ScheduleTable;
