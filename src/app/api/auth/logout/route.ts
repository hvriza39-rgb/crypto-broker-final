const handleLogout = async () => {
  try {
    await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
    window.location.replace("/auth/login");
  } catch (error) {
    console.error("Logout failed", error);
    window.location.replace("/auth/login");
  }
};
