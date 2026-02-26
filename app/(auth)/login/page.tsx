"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@prisma.local");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: true, callbackUrl: "/dashboard" });
    if ((res as any)?.error) toast.error("Credenziali non valide");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[color:var(--bg)] flex items-center justify-center p-6">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.45),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.25),transparent_40%)]" />
      <Card className="relative w-full max-w-md">
        <CardHeader>
          <CardTitle>PRISMA Manager</CardTitle>
          <CardDescription>Accedi per gestire lead, pipeline e creatività AI.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
          <Button className="w-full" onClick={onLogin} disabled={loading}>
            {loading ? "Accesso..." : "Entra"}
          </Button>
          <div className="text-xs text-white/60">
            Seed users: <span className="text-white/80">admin@prisma.local / admin123</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
