import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { VictoryAxis, VictoryLine, VictoryChart } from "victory";

const colors = [
  "#5d8aa8",
  "#f0f8ff",
  "#e32636",
  "#efdecd",
  "#e52b50",
  "#ffbf00",
  "#ff033e",
  "#9966cc",
  "#a4c639",
  "#f2f3f4",
  "#cd9575",
  "#915c83",
  "#faebd7",
  "#008000",
  "#8db600",
  "#fbceb1",
  "#00ffff",
  "#7fffd4",
  "#4b5320",
  "#e9d66b",
  "#b2beb5",
  "#fdee00",
  "#6e7f80",
];

const addMinutes = (date: Date, minutes: number) =>
  new Date(date.getTime() + minutes * 60000);

const createTimeSeries = (name: string, startDate: Date, to = new Date()) => {
  const offset = Math.random() * 100000000 + startDate.getTime();
  const ts: [Date, number][] = [];
  for (let iter = startDate; iter < to; iter = addMinutes(iter, 5)) {
    ts.push([
      iter,
      10 + Math.random() * 0.5 + Math.sin((offset + iter.getTime()) / 10000000),
    ]);
  }
  return { name, ts };
};

export const loader = async () => {
  const names = [
    "waterPressure",
    "returnTemperature",
    "flowTemperature",
    "aaaaa",
    "bbbbbb",
    "cccccc",
    "dddddddd",
    "ccccccccc",
    "eeeeee",
    "ffffff",
  ];
  const sevenDaysBackInTime = addMinutes(new Date(), -1 * 60 * 24 * 7);
  const data = names.map((name) => createTimeSeries(name, sevenDaysBackInTime));
  const x = data[0].ts.at(0);
  return json(data);
};

export default function Posts() {
  const response = useLoaderData<typeof loader>();
  const data = response.map((v) => {
    const name = v.name;
    const ts = v.ts.map(([timestamp, value]) => {
      return [new Date(timestamp), value];
    });
    return { name, ts };
  });
  return (
    <main>
      <div style={{ width: "90%", height: 800 }}>
        <VictoryChart scale={{ x: "time" }}>
          {data.map((figure, i) => (
            <VictoryLine
              key={i}
              style={{
                data: { stroke: colors[i], strokeWidth: 0.5 },
                parent: { border: "1px solid #ccc" },
              }}
              data={figure.ts}
              // data accessor for x values
              x="0"
              // data accessor for y values
              y="1"
            />
          ))}
        </VictoryChart>
      </div>
    </main>
  );
}
