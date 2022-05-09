import { View, Text,useState } from 'react-native'
import React,{createContext,useContext} from 'react'

// const AuthContext = createContext();
const AuthContext = createContext({
  userDataContext:{},
  setUserDataContext:(userData)=>{}
});

// export const AuthProvider = (props) => {
//   console.log(props.user);
//   // const [user,setUser] = useState("");
//   return (
//     <AuthContext.Provider value={{user:props.user}}>
//         {props.children}
//     </AuthContext.Provider>
//   )
// };

export default AuthContext;

// export default function useAuth(){
//     return useContext(AuthContext);
// }