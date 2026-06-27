"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS: Record<string, string> = {
  "Entertainment": "#a141fc",        // purple
  "Gaming": "#29cf65",               // green
  "Productivity & Software": "#2c72e3", // blue
  "Health & Fitness": "#f30909",     // red
  "Shopping": "#fb8f1c",             // orange
  "Education": "#ede505",            // amber
  "Utilities": "#585d68",           // gray
  "Other": "#878e8e",               // slate
};

// chartData.sort((a, b) => b.value - a.value)

export default function CategoryChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className = "flex flex-col sm:flex-row items-center gap-6">
        <ResponsiveContainer width="100%" height={300}>
        <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name]} />
            ))}
            </Pie>
        </PieChart>
        </ResponsiveContainer>
        <ul>
            {data.map((entry) => (
                <li key={entry.name} className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[entry.name] }} />
                <span className="whitespace-nowrap">{entry.name}</span>
                </li>
            ))}
        </ul>
    </div>
    
  );
}


