import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell, Moon, Shield } from "lucide-react";
import { useThemeStore } from "@/store/use-theme-store";

export default function Settings() {
  const { theme, toggleTheme } = useThemeStore();

  const preferences = [
    {
      icon: Bell,
      title: "Email Notifications",
      description: "Receive email updates about your programs",
      defaultChecked: true,
      onCheckedChange: () => {}, // Implement email notification logic
    },
    {
      icon: Moon,
      title: "Dark Mode",
      description: "Toggle between light and dark theme",
      checked: theme === "dark",
      onCheckedChange: toggleTheme,
    },
    {
      icon: Shield,
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      defaultChecked: false,
      onCheckedChange: () => {}, // Implement 2FA logic
    },
  ];

  return (
    <div className="container pb-16 mx-auto space-y-8 max-w-4xl">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Customize your application preferences
        </p>
      </div>

      <Separator className="my-6" />

      <Card className="shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle>Application Preferences</CardTitle>
          <CardDescription>
            Customize your experience and notification settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {preferences.map((preference, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 space-x-4 rounded-lg border transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <preference.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{preference.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {preference.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preference.checked ?? preference.defaultChecked}
                  onCheckedChange={preference.onCheckedChange}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
