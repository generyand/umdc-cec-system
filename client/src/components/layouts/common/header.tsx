import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import cecLogo from "@/assets/images/cec-logo.png";
import { Notifications } from "@/components/layouts/common/notifications";

export function Header() {
  const { user, logout } = useAuth();

  const name = `${user?.firstName} ${user?.lastName}`;

  // Get initials from name
  const getInitials = (name: string | undefined) => {
    if (!name) return "";

    return name
      .split(" ")
      .map((word) => word?.[0] || "")
      .join("")
      .toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
  };

  const formatPosition = (position: string) => {
    switch (position) {
      case "CEC_HEAD":
        return "CEC Head";
      case "CEC_OFFICE_ASSISTANT":
        return "CEC Office Assistant";
      case "CEC_COORDINATOR":
        return "CEC Coordinator";
      case "VP_DIRECTOR":
        return "VP Director";
      case "DEAN":
        return "Dean";
      case "PROGRAM_HEAD":
        return "Program Head";
      case "FOCAL_PERSON":
        return "Focal Person";
      default:
        return user?.role || "Unknown";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mx-auto">
      <div className="container flex justify-between items-center px-4 mx-auto h-16">
        {/* Logo Section */}
        <Link
          to={
            user?.role === "ADMIN"
              ? "/admin"
              : user?.role === "STAFF"
              ? "/staff"
              : "/dashboard"
          }
          className="flex gap-3 items-center transition-opacity hover:opacity-90"
        >
          <div className="flex gap-2 items-center">
            <img
              src={umdcLogo}
              alt="UMDC Logo"
              className="w-10 h-10 rounded-full shadow-sm"
            />
            <img
              src={cecLogo}
              alt="CEC Logo"
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

        {/* User Menu and Notifications */}
        <div className="flex gap-4 items-center">
          <Notifications />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-1 rounded-full transition-colors hover:bg-accent/50"
                aria-label="User menu"
              >
                <div className="flex relative justify-center items-center w-8 h-8 rounded-full border-2 shadow-sm bg-primary/10 border-background">
                  <span className="text-sm font-medium text-primary">
                    {name ? getInitials(name) : ""}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* User Info Section */}
              <div className="flex gap-3 items-center p-2">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="font-medium bg-primary/10 text-primary">
                    {name ? getInitials(name) : ""}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{name}</span>
                  <span className="text-xs capitalize text-muted-foreground">
                    {formatPosition(user?.position || user?.role || "Unknown")}
                  </span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to={
                    user?.role === "ADMIN" ? "/admin/profile" : "/staff/profile"
                  }
                  className="cursor-pointer"
                >
                  <User className="mr-2 w-4 h-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to={
                    user?.role === "ADMIN"
                      ? "/admin/settings"
                      : "/staff/settings"
                  }
                  className="cursor-pointer"
                >
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
