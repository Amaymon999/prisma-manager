"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

export function KpiCard({ title, desc, value }: { title: string; desc: string; value: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.6, ease: "easeOut" });
    return () => controls.stop();
  }, [value, mv]);

  return (
    <Card className="transition hover:-translate-y-0.5 hover:shadow-soft">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <motion.div className="text-3xl font-semibold">
          <motion.span>{rounded}</motion.span>
        </motion.div>
      </CardContent>
    </Card>
  );
}
