"use client";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function StudyHeatmap({ data = [] }) {

  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        Study Consistency
      </h2>

      <CalendarHeatmap
        startDate={oneYearAgo}
        endDate={today}
        values={data}
        classForValue={(value) => {
          if (!value) return "color-empty";
          if (value.count >= 4) return "color-github-4";
          if (value.count >= 3) return "color-github-3";
          if (value.count >= 2) return "color-github-2";
          if (value.count >= 1) return "color-github-1";
          return "color-empty";
        }}
      />
    </div>
  );
}