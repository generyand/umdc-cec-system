import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router-dom";
import { User, LogOut, Settings } from "lucide-react";
import umdcLogo from "@/assets/images/umdc-logo.png";

const DEFAULT_AVATAR =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=default";

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const formatRole = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrator";
      case "FOCAL_PERSON":
        return "Focal Person";
      default:
        return "Unknown";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mx-auto">
      <div className="container flex justify-between items-center px-4 mx-auto h-16">
        {/* Logo Section */}
        <Link
          to="/admin"
          className="flex gap-3 items-center transition-opacity hover:opacity-90"
        >
          <div>
            <img
              src={umdcLogo}
              alt="UMDC Logo"
              className="w-10 h-10 rounded-full shadow-sm"
            />
          </div>
          <div className="hidden flex-col md:flex">
            <span className="text-base font-semibold">UM Digos College</span>
            <span className="text-xs text-muted-foreground">
              Community Extension Center
            </span>
          </div>
        </Link>

        {/* User Menu */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-3 items-center">
                <div className="hidden text-sm text-right md:block">
                  <span className="block font-medium">{user?.name}</span>
                  <span className="block text-xs capitalize text-muted-foreground">
                    {formatRole(user?.role || "Unknown")}
                  </span>
                </div>
                <button className="p-1.5 rounded-full hover:bg-accent/50 transition-colors">
                  <Avatar className="w-8 h-8 border-2 shadow-sm border-background">
                    <AvatarImage
                      src={DEFAULT_AVATAR}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-primary/10">
                      {user?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/profile" className="cursor-pointer">
                  <User className="mr-2 w-4 h-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/settings" className="cursor-pointer">
                  <Settings className="mr-2 w-4 h-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="cursor-pointer text-destructive focus:text-destructive dark:text-red-500 dark:hover:text-red-500"
                  >
                    <LogOut className="mr-2 w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to logout?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be redirected to the login page and will need to
                      sign in again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLogout}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
