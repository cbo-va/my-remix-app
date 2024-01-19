import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import {
  createContainer,
  VictoryBrushContainer,
  VictoryChart,
  VictoryLine,
  VictoryTooltip,
  VictoryAxis,
  VictoryVoronoiContainer,
  VictoryZoomContainer,
} from "victory";

const colors = [
  "#5d8aa8",
  "#e32636",
  "#ffbf00",
  "#9966cc",
  "#a4c639",
  "#cd9575",
  "#915c83",
  "#008000",
  "#8db600",
  "#fbceb1",
  "#00ffff",
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
  for (
    let iter = startDate;
    iter < to;
    iter = addMinutes(iter, Math.floor(5 + Math.random() * 2))
  ) {
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
    //"eeeeee",
    //"ffffff",
  ];
  const sevenDaysBackInTime = addMinutes(new Date(), -1 * 60 * 24 * 7);
  const data = names.map((name) => createTimeSeries(name, sevenDaysBackInTime));
  const x = data[0].ts.at(0);
  return json(data);
};

const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");

export default function Posts() {
  const [zoomDomain, setZoomDomain] = React.useState();
  const [selectedDomain, setSelectedDomain] = React.useState();

  const handleZoom = React.useCallback(
    (domain) => {
      setSelectedDomain(domain);
      setZoomDomain(domain);
    },
    [setSelectedDomain]
  );

  const handleBrush = React.useCallback(
    (domain) => {
      setZoomDomain(domain);
      setSelectedDomain(domain);
    },
    [setZoomDomain]
  );

  const response = useLoaderData<typeof loader>();

  const data = React.useMemo(
    () =>
      response.map((v) => {
        const name = v.name;
        const ts = v.ts.map(([timestamp, value]) => {
          return [new Date(timestamp), value];
        });
        return { name, ts };
      }),
    [response]
  );

  return (
    <main>
      <div style={{ width: "90%", height: 800 }}>
        <VictoryChart
          width={900}
          scale={{ x: "time" }}
          containerComponent={
            <VictoryZoomVoronoiContainer
              responsive={false}
              zoomDimension="x"
              zoomDomain={zoomDomain}
              onZoomDomainChange={handleZoom}
              mouseFollowTooltips
              voronoiDimension="x"
              labels={({ datum }) => `y: ${datum[1]}`}
            />
          }
        >
          {data.slice(0, 8).map((figure, i) => (
            <VictoryLine
              key={i}
              style={{
                data: { stroke: colors[i], strokeWidth: 1.5 },
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

        <VictoryChart
          width={900}
          height={160}
          scale={{ x: "time" }}
          containerComponent={
            <VictoryBrushContainer
              responsive={false}
              brushDimension="x"
              brushDomain={selectedDomain}
              onBrushDomainChange={handleBrush}
            />
          }
        >
          <VictoryAxis />
          {data.slice(0, 9).map((figure, i) => (
            <VictoryLine
              key={i}
              style={{
                data: { stroke: colors[i], strokeWidth: 0.9 },
                parent: { border: "1px solid #ccc" },
              }}
              data={figure.ts
                .map(([ts, v], i) => {
                  if (i % 20 === 0) {
                    return [ts, v];
                  }
                  return null;
                })
                .filter(Boolean)}
              // data accessor for x values
              x="0"
              // data accessor for y values
              y="1"
            />
          ))}
        </VictoryChart>

        <VictoryChart
          width={900}
          scale={{ x: "time" }}
          containerComponent={
            <VictoryZoomVoronoiContainer
              responsive={false}
              zoomDimension="x"
              zoomDomain={zoomDomain}
              onZoomDomainChange={handleZoom}
              mouseFollowTooltips
              voronoiDimension="x"
              labels={({ datum }) => `y: ${datum[1]}`}
            />
          }
        >
          {data.slice(2, 9).map((figure, i) => (
            <VictoryLine
              labelComponent={<VictoryTooltip />}
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

        <VictoryChart
          width={900}
          height={160}
          scale={{ x: "time" }}
          containerComponent={
            <VictoryBrushContainer
              handleWidth={12}
              handleComponent={
                <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                  <rect width="10" height="10" fill="black" />
                </svg>
              }
              responsive={false}
              brushDimension="x"
              brushDomain={selectedDomain}
              onBrushDomainChange={handleBrush}
            />
          }
        >
          <VictoryAxis />
          {data.slice(0, 9).map((figure, i) => (
            <VictoryLine
              key={i}
              style={{
                data: { stroke: "grey", strokeWidth: 0.5 },
                parent: { border: "1px solid #ccc" },
              }}
              data={figure.ts
                .map(([ts, v], i) => {
                  if (i % 20 === 0) {
                    return [ts, v];
                  }
                  return null;
                })
                .filter(Boolean)}
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
