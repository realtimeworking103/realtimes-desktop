// import { Button } from "@/ui/components/ui/button";
// import { Input } from "@/ui/components/ui/input";
// import { useState } from "react";
// import { Alert, AlertDescription } from "@/ui/components/ui/alert";
// import { Loader2 } from "lucide-react";
// import { useAuthStore } from "@/ui/stores/useAuthStore";

// export default function Page() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
  
//   const { 
//     user, 
//     isAuthenticated, 
//     isLoggingIn, 
//     error, 
//     login, 
//     logout 
//   } = useAuthStore();

//   const handleLogin = async () => {
//     try {
//       await login(username, password);
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-8 p-6 space-y-4">
//       {error && (
//         <Alert variant="destructive">
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}
      
//       {isAuthenticated ? (
//         <div className="space-y-4">
//           <div className="p-4 border rounded-lg">
//             <h2 className="text-lg font-semibold mb-2">Welcome!</h2>
//             <p><strong>Username:</strong> {user?.username}</p>
//             <p><strong>User ID:</strong> {user?.userId}</p>
//             <p><strong>Session ID:</strong> {user?.sessionId}</p>
//           </div>
//           <Button onClick={handleLogout} variant="outline" className="w-full">
//             Logout
//           </Button>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           <h1 className="text-2xl font-bold text-center">Login</h1>
//           <Input 
//             type="text" 
//             placeholder="Username" 
//             value={username} 
//             onChange={(e) => setUsername(e.target.value)}
//             disabled={isLoggingIn}
//           />
//           <Input 
//             type="password" 
//             placeholder="Password" 
//             value={password} 
//             onChange={(e) => setPassword(e.target.value)}
//             disabled={isLoggingIn}
//           />
//           <Button 
//             onClick={handleLogin} 
//             disabled={isLoggingIn || !username || !password}
//             className="w-full"
//           >
//             {isLoggingIn ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Logging in...
//               </>
//             ) : (
//               "Login"
//             )}
//           </Button>
//         </div>
//       )}
//     </div>
//   )
// }