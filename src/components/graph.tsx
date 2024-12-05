import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      hour: i,
      mints: Math.floor(Math.random() * 50) + 10,
    });
  }
  return data;
};

export const MintingHistoryGraph: React.FC = () => {
  const [data, setData] = useState(generateData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1), {
          hour: (prevData[prevData.length - 1].hour + 1) % 24,
          mints: Math.floor(Math.random() * 50) + 10,
        }];
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="mintingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#ff6b00" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Area 
          type="monotone" 
          dataKey="mints" 
          stroke="#ff6b00" 
          fillOpacity={1} 
          fill="url(#mintingGradient)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

