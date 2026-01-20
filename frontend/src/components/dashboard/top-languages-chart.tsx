'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface TopLanguagesChartProps {
    data: any[];
    isLoading?: boolean;
}

export function TopLanguagesChart({ data, isLoading }: TopLanguagesChartProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Top Languages</CardTitle>
                <CardDescription>By code volume (bytes)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    {isLoading ? (
                        <div className="flex h-full items-center justify-center">Loading...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data as any[]}
                                    dataKey="bytes"
                                    nameKey="language"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                >
                                    {data.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {data.map((lang, i) => (
                            <div key={lang.language} className="flex items-center gap-1 text-xs">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                <span>{lang.language}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
