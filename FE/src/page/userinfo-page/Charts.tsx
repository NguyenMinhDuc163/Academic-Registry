import { BarChart } from "@mui/x-charts";

const Charts = () => {
  return (
    <BarChart
      series={[
        {
          data: [6.8, 5.3, 8, 6.8, 10, 9.6, 7.8],
          label: "Điểm",
        },
      ]}
      colors={["rgba(0, 102, 255, 0.85)"]}
      height={400}
      xAxis={[
        {
          scaleType: "band",
          categoryGapRatio: 0.5,
          data: [
            "BAS1153",
            "BAS1161",
            "INT1313",
            "INT1312",
            "INT1319",
            "INT1332",
            "INT1336",
          ],
        },
      ]}
    />
  );
};

export default Charts;
