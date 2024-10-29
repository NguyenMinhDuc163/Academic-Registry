import { BarChart } from "@mui/x-charts";

interface ChartsProps {
  labels: string[];
  scores: number[];
}

const Charts: React.FC<ChartsProps> = ({ labels, scores }) => {
  return (
      <BarChart
          series={[
            {
              data: scores,
              label: "Điểm",
            },
          ]}
          colors={["rgba(0, 102, 255, 0.85)"]}
          height={400}
          xAxis={[
            {
              scaleType: "band",
              categoryGapRatio: 0.5,
              data: labels,
            },
          ]}
      />
  );
};

export default Charts;
